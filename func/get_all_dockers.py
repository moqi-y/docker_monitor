import docker
import json

from func.format import format_time

try:
    client = docker.from_env()
except Exception as e:
    print(f"无法连接到Docker进程：{e}")
    exit(1)


def get_all_images():
    try:
        # 获取全部镜像列表
        images = client.images.list()

        image_array = []

        for image in images:
            # 尝试获取镜像的标签，如果不存在则标记为 '<none>'
            tags = image.tags[0] if image.tags else '<none>'
            create_time = format_time(image.attrs['Created'])
            virtual_size = image.attrs.get('VirtualSize')

            # 创建镜像信息字典并添加到image_array中
            image_item = {
                'image_id': image.id,
                'tags': tags,
                'create_time': create_time,
                'virtual_size': virtual_size,
            }
            image_array.append(image_item)

        # 将image_array转换为JSON格式的字符串并返回
        json_data = json.dumps(image_array, ensure_ascii=False, indent=4)
        return json_data
    except Exception as e:
        print(f"获取镜像列表时出错：{e}")
        return None


def get_all_containers():
    try:
        # 获取全部容器列表，包括正在运行的和已停止的容器
        containers = client.containers.list(all=True)

        docker_array = []

        for container in containers:
            container_image_name = container.image.tags[0] if container.image.tags else "未知"
            create_time = format_time(container.attrs['Created'])
            start_time = format_time(container.attrs['State']['StartedAt']) if 'StartedAt' in container.attrs['State'] else "未启动"
            last_stop_time = format_time(container.attrs['State']['FinishedAt']) if 'FinishedAt' in container.attrs['State'] else "未停止"
            restart_count = container.attrs.get('RestartCount', '未知')  # 使用get方法提供默认值
            status = container.status

            print("容器数量：", len(containers))
            print(f"容器名称: {container.name}, 镜像名称: {container_image_name}, 创建时间: {create_time}, 启动时间: {start_time}, 停止时间: {last_stop_time}, 重启次数: {restart_count}, 状态: {status}")

            # 如果容器正在运行，获取内存和网络统计信息
            if status == "running":
                stats = container.stats(stream=False)
                memory_limit_value = stats['memory_stats'].get('limit')
                if memory_limit_value is None:
                    memory_limit = "未知"
                    memory_usage = "未知"
                    memory_rate = "未知"
                else:
                    memory_limit = format(stats['memory_stats']['limit'] / (1024 ** 3), '.3f') + " GB"
                    memory_usage = format(stats['memory_stats']['usage'] / (1024 ** 3), '.3f') + " GB"
                    memory_rate = format((stats['memory_stats']['usage'] / stats['memory_stats']['limit']) * 100, '.3f') + " %"

                # 检查networks和eth0是否存在
                networks = stats.get('networks', {})
                if 'eth0' in networks:
                    network_input = networks['eth0'].get('rx_bytes', "未知")
                    network_output = networks['eth0'].get('tx_bytes', "未知")
                else:
                    network_input = "未知"
                    network_output = "未知"
            else:
                memory_limit = "N/A"
                memory_usage = "N/A"
                memory_rate = "N/A"
                network_input = "N/A"
                network_output = "N/A"

            ports = container.attrs.get('NetworkSettings', {}).get('Ports', {})
            port_info = []
            for port, bindings in ports.items():
                if bindings is not None:  # 检查 bindings 是否为 None
                    for binding in bindings:
                        port_info.append(f"{port} -> {binding['HostIp']}:{binding['HostPort']}")

            # 创建容器信息字典并添加到docker_array中
            container_item = {
                'container_id': container.id,
                'container_name': container.name,
                'container_image_name': container_image_name,
                'create_time': create_time,
                'start_time': start_time,
                'last_stop_time': last_stop_time,
                'restart_count': restart_count,
                'memory_limit': memory_limit,
                'memory_usage': memory_usage,
                'memory_rate': memory_rate,
                'network_input': network_input,
                'network_output': network_output,
                "ports": port_info,
                'status': status
            }
            docker_array.append(container_item)

        # 将docker_array转换为JSON格式的字符串并返回
        json_data = json.dumps(docker_array, ensure_ascii=False, indent=4)
        return json_data
    except Exception as e:
        print(f"获取容器列表时出错：{str(e)}")
        return {
            'error': str(e)
        }
    


if __name__ == '__main__':
    print(get_all_containers())
