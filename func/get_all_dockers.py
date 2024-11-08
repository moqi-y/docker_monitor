import docker
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
import threading
from concurrent.futures import ThreadPoolExecutor
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 初始化Docker客户端
try:
    client = docker.from_env()
except Exception as e:
    logger.error(f"无法连接到Docker进程：{e}")
    exit(1)

# 创建一个简单的缓存装饰器
def cache_stats(timeout_seconds=5):
    cache = {}
    lock = threading.Lock()

    def decorator(func):
        def wrapper(*args, **kwargs):
            key = str(args) + str(kwargs)
            with lock:
                if key in cache:
                    timestamp, data = cache[key]
                    if (datetime.now() - timestamp).seconds < timeout_seconds:
                        return data
            
            result = func(*args, **kwargs)
            with lock:
                cache[key] = (datetime.now(), result)
            return result
        return wrapper
    return decorator

def format_time(time_str: str) -> str:
    """格式化时间字符串"""
    if not time_str or time_str == "0001-01-01T00:00:00Z":
        return "未知"
    try:
        dt = datetime.fromisoformat(time_str.replace('Z', '+00:00'))
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except ValueError:
        return "未知"

def format_size(size_bytes: float) -> str:
    """格式化字节大小为GB"""
    try:
        return f"{size_bytes / (1024 ** 3):.3f}"
    except (TypeError, ZeroDivisionError):
        return "未知"

@cache_stats(timeout_seconds=5)
def get_container_stats(container: Any) -> Dict[str, Any]:
    """获取容器统计信息（带缓存）"""
    if container.status != "running":
        return {
            "memory_limit": "N/A",
            "memory_usage": "N/A",
            "memory_rate": "N/A",
            "network_input": "未知",
            "network_output": "未知"
        }

    try:
        stats = container.stats(stream=False)
        memory_stats = stats.get('memory_stats', {})
        memory_limit = memory_stats.get('limit', 0)
        memory_usage = memory_stats.get('usage', 0)
        networks = stats.get('networks', {}).get('eth0', {})

        return {
            "memory_limit": format_size(memory_limit) if memory_limit else "未知",
            "memory_usage": format_size(memory_usage) if memory_usage else "未知",
            "memory_rate": float(f"{(memory_usage / memory_limit * 100):.3f}") if memory_limit and memory_usage else "未知",
            "network_input": networks.get('rx_bytes', "未知"),
            "network_output": networks.get('tx_bytes', "未知")
        }
    except Exception as e:
        logger.error(f"获取容器统计信息失败: {e}")
        return {
            "memory_limit": "错误",
            "memory_usage": "错误",
            "memory_rate": "错误",
            "network_input": "错误",
            "network_output": "错误"
        }

def process_container(container: Any) -> Dict[str, Any]:
    """处理单个容器的所有信息"""
    try:
        # 处理端口信息
        ports = container.attrs.get('NetworkSettings', {}).get('Ports', {})
        port_info = [
            f"{port} -> {binding['HostIp']}:{binding['HostPort']}"
            for port, bindings in ports.items()
            if bindings
            for binding in bindings
        ]

        # 基本信息
        container_info = {
            'container_id': container.id,
            'container_name': container.name,
            'container_image_name': container.image.tags[0] if container.image.tags else "未知",
            'create_time': format_time(container.attrs['Created']),
            'start_time': format_time(container.attrs['State'].get('StartedAt', '')),
            'last_stop_time': format_time(container.attrs['State'].get('FinishedAt', '')),
            'restart_count': container.attrs.get('RestartCount', '未知'),
            'status': container.status,
            'ports': port_info
        }

        # 获取统计信息
        stats = get_container_stats(container)
        container_info.update(stats)

        return container_info
    except Exception as e:
        logger.error(f"处理容器信息失败: {e}")
        return {
            'container_id': container.id,
            'error': str(e),
            'status': 'error'
        }

def get_all_containers():
    """获取所有容器信息"""
    try:
        containers = client.containers.list(all=True)
        
        # 使用线程池并发处理容器信息
        with ThreadPoolExecutor(max_workers=min(len(containers), 10)) as executor:
            docker_array = list(executor.map(process_container, containers))
        
        return json.dumps(docker_array, ensure_ascii=False, indent=4)
    except Exception as e:
        error_msg = f"获取容器列表时出错：{str(e)}"
        logger.error(error_msg)
        return json.dumps({'error': error_msg}, ensure_ascii=False)

def get_all_images():
    """获取所有镜像信息"""
    try:
        images = client.images.list()
        image_array = []

        for image in images:
            image_item = {
                'image_id': image.id,
                'tags': image.tags[0] if image.tags else '<none>',
                'create_time': format_time(image.attrs['Created']),
                'virtual_size': format_size(image.attrs.get('VirtualSize', 0))
            }
            image_array.append(image_item)

        return json.dumps(image_array, ensure_ascii=False, indent=4)
    except Exception as e:
        error_msg = f"获取镜像列表时出错：{str(e)}"
        logger.error(error_msg)
        return json.dumps({'error': error_msg}, ensure_ascii=False)

if __name__ == '__main__':
    print("容器列表:")
    print(get_all_containers())
    print("\n镜像列表:")
    print(get_all_images())