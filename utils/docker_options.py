import docker

client = docker.from_env()


# for container in client.containers.list(all=True):
#     # 启动所有容器
#     # container.start()
#     print(container.name)
#     container.stop()
#     print(container.status)


#   启动指定的容器
def start_container(container_name):
    try:
        the_container = client.containers.get(container_name)
        the_container.start()
        return the_container
    except Exception as e:
        print(e)
        return False


# 停止指定的容器
def stop_container(container_name):
    try:
        the_container = client.containers.get(container_name)
        the_container.stop()
        return the_container
    except Exception as e:
        print(e)
        return False


# 获取指定容器的状态
def get_container_status(container_name):
    try:
        the_container = client.containers.get(container_name)
        return the_container
    except Exception as e:
        print(e)
        return False


# 重启指定的容器
def restart_container(container_name):
    the_container = client.containers.get(container_name)
    the_container.restart()
    return the_container


# 删除指定的容器
def remove_container(container_name):
    try:
        the_container = client.containers.get(container_name)
        the_container.remove()
        return the_container
    except Exception as e:
        print(e)
        return False


# 获取指定容器日志
def get_container_logs(container_name):
    try:
        the_container = client.containers.get(container_name)
        # 获取日志
        logs = the_container.logs()
        # 打印为字符串数组,根据“/n”计算行数，打印最后100行
        logs_lines = logs.decode('utf-8').split('\n')
        logs_text = ''
        for i in range(len(logs_lines) - 1, len(logs_lines) - 100, -1):
            logs_text += logs_lines[i] + '\n'
        return logs_text
    except docker.errors.NotFound:
        print(f"容器 '{container_name}' 未找到。")
        return False
    except docker.errors.APIError as api_error:
        print(f"Docker API 错误：{api_error}")
        return False
    except Exception as e:
        print(f"获取容器日志时发生错误：{e}")
        return False


if __name__ == '__main__':
    get_container_logs('my_nginx')
