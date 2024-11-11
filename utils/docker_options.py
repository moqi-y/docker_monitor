import docker
import time
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

# 进入指定容器终端
def exec_command_in_container(container_name, command):
    try:
        the_container = client.containers.get(container_name)
        # 执行命令并获取输出
        exec_result = the_container.exec_run(cmd=command, stdout=True, stderr=True, stream=False, tty=True, detach=False,workdir='/usr' )
        # exec_run 返回一个元组，第一个元素是 exit code，第二个元素是输出内容
        return_code = exec_result[0]
        output = exec_result[1].decode('utf-8')  # 将 bytes 解码为 utf-8 字符串
        return return_code, output
    except docker.errors.ContainerError as e:
        # 容器执行命令出错
        return e.exit_code, str(e)
    except docker.errors.APIError as e:
        # Docker API 出错
        return e.status_code, str(e)
    except Exception as e:
        # 其他异常
        return None, str(e)
    
# 进入指定容器终端
def run_command_and_print_output(container_name, commands):
    for command in commands:
        exit_code, output = exec_command_in_container(container_name, command)
        # if exit_code == 0:
        print("Command executed successfully:")
        print(output)
        return {
            "exit_code": 0,
            "output": str(output),
            "command": str(command)
        }
        # else:
            # print("Error executing command:")
            # print(output)
            # return {
            #     "exit_code": -1
            # }

if __name__ == '__main__':
    container_name = 'my_nginx'
    commands = ['ls -l', 'pwd','whoami','ls -l /usr/share/nginx','cat /usr/share/nginx/html/index.html']
    for command in commands:
        run_command_and_print_output(container_name, command)
    # command = 'ls -l'  # 这里以列出容器当前目录下的文件为例
    # run_command_and_print_output(container_name, command)
