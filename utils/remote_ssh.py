import paramiko
 

def ssh_command(ip, username, password, command):
    print("启动SSH连接")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(ip,port=22, username=username, password=password,timeout=10)
    print("command:",command)
    # invoke = ssh.invoke_shell()
    # invoke.send(command)
    # time.sleep(1)
    # res = invoke.recv(9999).decode("utf-8")
    stdin, stdout, stderr = ssh.exec_command(command)
    result = stdout.read().decode(encoding="utf-8")
    ssh.close()
    return result


# # 创建SSH对象
# ssh = paramiko.SSHClient()
 
# # 允许连接不在~/.ssh/known_hosts文件中的主机
# ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
 
# # 连接服务器
# ssh.connect(hostname="10.13.6.47", port=22, username="root", password="Yuy@123")
 
# # 执行命令，不要执行top之类的在不停的刷新的命令(可以执行多条命令，以分号来分隔多条命令)
# # stdin, stdout, stderr = ssh.exec_command("cd %s;mkdir %s" % ("/www/wwwroot", "aa"))
# stdin, stdout, stderr = ssh.exec_command("ls -l")
# stdin.write("终端等待输入...\n")   # test.py文件有input()函数，如果不需要与终端交互，则不写这两行
# stdin.flush()
 
# # 获取命令结果
# res, err = stdout.read(), stderr.read()
# result = res if res else err
# res = result.decode()
# res = result.decode("utf-8")
# res = result.decode(encoding="utf-8")
# print("res",res)
 
# # 关闭服务器连接
# ssh.close()

if __name__ == '__main__':
    # ssh_command("10.13.6.47","root","Yuy@123","ls -l")
    print("test")