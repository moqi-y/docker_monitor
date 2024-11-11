import psutil
import platform
import datetime
import os
from concurrent.futures import ThreadPoolExecutor
from functools import partial
import threading
from typing import Dict, Any
import time

class SystemInfoCollector:
    """系统信息收集器类"""
    
    def __init__(self):
        """初始化系统信息收集器"""
        # 缓存一些不经常变化的系统信息
        self._static_info = self._get_static_system_info()
        # 用于存储最后一次获取的动态数据
        self._last_dynamic_info = {}
        # 设置缓存过期时间(秒)
        self._cache_timeout = 2
        # 记录最后更新时间
        self._last_update_time = 0
        # 线程锁
        self._lock = threading.Lock()

    def _get_static_system_info(self) -> Dict[str, Any]:
        """
        获取静态系统信息(不经常变化的信息)
        """
        return {
            "system_info": {
                "os": platform.system(), # 操作系统类型(Windows/Linux/Darwin)
                "os_release": platform.release(), # 操作系统发行版本
                "os_version": platform.version(), # 操作系统详细版本信息
                "architecture": platform.machine(), # 系统架构(x86_64/arm64等)
                "hostname": platform.node(), # 主机名
                "processor": platform.processor(), # 处理器信息
                "python_version": platform.python_version(), # Python解释器版本
                "cpu_physical_cores": psutil.cpu_count(logical=False), # CPU物理核心数
                "cpu_logical_cores": psutil.cpu_count(logical=True) #CPU逻辑核心数(包含超线程)
            }
        }

    def _get_cpu_info(self) -> Dict[str, Any]:
        """获取CPU信息"""
        return {
            "cpu_usage": psutil.cpu_percent(interval=0.1) * 10,  #CPU总体使用率
            "per_cpu_percent": psutil.cpu_percent(percpu=True, interval=0.1), #每个CPU核心的使用率
            "cpu_freq": dict(psutil.cpu_freq()._asdict()) if psutil.cpu_freq() else {} # CPU频率信息(当前/最小/最大)
        }

    def _get_memory_info(self) -> Dict[str, Any]:
        """获取内存信息"""
        memory_info = psutil.virtual_memory()
        swap_info = psutil.swap_memory()
        
        return {
            "memory_info": {
                "total": round(memory_info.total / (1024 ** 3), 2), # 总物理内存
                "available": round(memory_info.available / (1024 ** 3), 2), # 可用物理内存
                "used": round(memory_info.used / (1024 ** 3), 2), # 已用物理内存
                "percent": memory_info.percent, # 物理内存使用率
                "swap": {
                    "total": round(swap_info.total / (1024 ** 3), 2), # 总交换内存
                    "used": round(swap_info.used / (1024 ** 3), 2), # 已用交换内存
                    "free": round(swap_info.free / (1024 ** 3), 2), # 可用交换内存
                    "percent": swap_info.percent # 交换内存使用率
                }
            }
        }

    def _get_disk_info(self) -> Dict[str, Any]:
        """获取磁盘信息"""
        partitions = []
        for partition in psutil.disk_partitions():
            try:
                usage = psutil.disk_usage(partition.mountpoint)
                partitions.append({
                    "device": partition.device, # 设备名
                    "mountpoint": partition.mountpoint,  # 挂载点
                    "fstype": partition.fstype,  # 文件系统类型
                    "total": round(usage.total / (1024 ** 3), 2),  # 总大小
                    "used": round(usage.used / (1024 ** 3), 2),  # 已用大小
                    "free": round(usage.free / (1024 ** 3), 2), # 可用大小
                    "percent": usage.percent # 使用率
                })
            except Exception:
                continue

        return {
            "disk_info": {
                "partitions": partitions, # 磁盘分区信息
                "io_counters": dict(psutil.disk_io_counters()._asdict()) if psutil.disk_io_counters() else {} # 磁盘IO信息
            }
        }

    def _get_network_info(self) -> Dict[str, Any]:
        """获取网络信息"""
        return {
            "network_info": {
                "io_counters": dict(psutil.net_io_counters()._asdict()),  # 网络IO信息
                "connections": len(psutil.net_connections()) # 当前网络连接数
            }
        }

    def _get_process_info(self) -> Dict[str, Any]:
        """获取进程信息"""
        current_process = psutil.Process(os.getpid())
        return {
            "process_info": {
                "total_processes": len(psutil.pids()), # 当前运行的进程数
                "current_process": {
                    "pid": current_process.pid, # 当前进程的PID
                    "memory_percent": current_process.memory_percent(),  # 当前进程的内存使用率
                    "cpu_percent": current_process.cpu_percent(interval=0.1)  # 当前进程的CPU使用率
                }
            }
        }

    def get_system_info(self) -> Dict[str, Any]:
        """
        获取系统信息的主方法,使用缓存机制
        """
        current_time = time.time()
        
        # 检查缓存是否有效
        with self._lock:
            if current_time - self._last_update_time < self._cache_timeout:
                return self._last_dynamic_info

        try:
            # 使用线程池并发收集动态信息
            with ThreadPoolExecutor(max_workers=5) as executor:
                futures = [
                    executor.submit(self._get_cpu_info), 
                    executor.submit(self._get_memory_info),
                    executor.submit(self._get_disk_info),
                    executor.submit(self._get_network_info),
                    executor.submit(self._get_process_info)
                ]

                # 合并所有结果
                result = {
                    "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  # 时间戳
                    **self._static_info  # 添加静态信息
                }

                for future in futures:
                    try:
                        result.update(future.result())
                    except Exception as e:
                        print(f"Error collecting system info: {str(e)}")

            # 更新缓存
            with self._lock:
                self._last_dynamic_info = result
                self._last_update_time = current_time

            return result

        except Exception as e:
            print(f"Error getting system info: {str(e)}")
            return None

# 创建全局实例
system_collector = SystemInfoCollector()

def get_system_info() -> Dict[str, Any]:
    """
    获取系统信息的便捷方法
    """
    return system_collector.get_system_info()

if __name__ == '__main__':
    print(get_system_info())
