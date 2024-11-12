import docker
import argparse
from typing import Optional, List

class DockerManager:
    def __init__(self, base_url: str):
        """
        初始化Docker客户端连接
        base_url示例: tcp://192.168.1.100:2375 或 ssh://user@remote_host
        """
        self.client = docker.DockerClient(base_url=base_url)
    
    def list_containers(self, all_containers: bool = False) -> List[dict]:
        """列出所有容器"""
        containers = self.client.containers.list(all=all_containers)
        container_list = []
        for container in containers:
            container_list.append({
                'id': container.short_id,
                'name': container.name,
                'status': container.status,
                'image': container.image.tags[0] if container.image.tags else container.image.id
            })
        return container_list

    def start_container(self, container_id: str) -> bool:
        """启动容器"""
        try:
            container = self.client.containers.get(container_id)
            container.start()
            return True
        except docker.errors.NotFound:
            print(f"容器 {container_id} 未找到")
            return False
        except Exception as e:
            print(f"启动容器时发生错误: {str(e)}")
            return False

    def stop_container(self, container_id: str) -> bool:
        """停止容器"""
        try:
            container = self.client.containers.get(container_id)
            container.stop()
            return True
        except docker.errors.NotFound:
            print(f"容器 {container_id} 未找到")
            return False
        except Exception as e:
            print(f"停止容器时发生错误: {str(e)}")
            return False

    def remove_container(self, container_id: str, force: bool = False) -> bool:
        """删除容器"""
        try:
            container = self.client.containers.get(container_id)
            container.remove(force=force)
            return True
        except docker.errors.NotFound:
            print(f"容器 {container_id} 未找到")
            return False
        except Exception as e:
            print(f"删除容器时发生错误: {str(e)}")
            return False

    def get_container_logs(self, container_id: str, tail: Optional[int] = 100) -> str:
        """获取容器日志"""
        try:
            container = self.client.containers.get(container_id)
            logs = container.logs(tail=tail).decode('utf-8')
            return logs
        except docker.errors.NotFound:
            return f"容器 {container_id} 未找到"
        except Exception as e:
            return f"获取日志时发生错误: {str(e)}"

def main():
    parser = argparse.ArgumentParser(description='Docker远程管理工具')
    parser.add_argument('--host', required=True, help='远程Docker主机地址 (例如: tcp://192.168.1.100:2375)')
    parser.add_argument('--action', choices=['list', 'start', 'stop', 'remove', 'logs'], required=True)
    parser.add_argument('--container-id', help='容器ID')
    parser.add_argument('--all', action='store_true', help='显示所有容器（包括已停止的）')
    
    args = parser.parse_args()
    
    manager = DockerManager(args.host)
    
    if args.action == 'list':
        containers = manager.list_containers(args.all)
        for container in containers:
            print(f"ID: {container['id']}, 名称: {container['name']}, "
                  f"状态: {container['status']}, 镜像: {container['image']}")
    
    elif args.action == 'start':
        if not args.container_id:
            print("需要指定容器ID")
            return
        success = manager.start_container(args.container_id)
        print(f"启动{'成功' if success else '失败'}")
    
    elif args.action == 'stop':
        if not args.container_id:
            print("需要指定容器ID")
            return
        success = manager.stop_container(args.container_id)
        print(f"停止{'成功' if success else '失败'}")
    
    elif args.action == 'remove':
        if not args.container_id:
            print("需要指定容器ID")
            return
        success = manager.remove_container(args.container_id)
        print(f"删除{'成功' if success else '失败'}")
    
    elif args.action == 'logs':
        if not args.container_id:
            print("需要指定容器ID")
            return
        logs = manager.get_container_logs(args.container_id)
        print(logs)

if __name__ == '__main__':
    main()