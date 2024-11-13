import json
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from func.get_all_dockers import get_all_images, get_all_containers
from utils.docker_options import start_container, stop_container, remove_container, get_container_logs,run_command_and_print_output,reset_global_variable_storage_directory_status
from utils.sys_options import get_system_info
from sql_app.curd import *
from utils.jwt_token import create_access_token, verify_token
from router.model import SSH, UserLogin,UserRegister
from utils.remote_ssh import ssh_command

api_router = APIRouter()


@api_router.get("/image/list", summary="获取所有镜像列表",dependencies=[Depends(verify_token)])
async def root():
    return {
        "code": status.HTTP_200_OK,
        "message": "操作成功",
        "data":
            {
                "dockerImage": {
                    "images": json.loads(get_all_images()),
                    "count": len(json.loads(get_all_images()))
                }
            }
    }


@api_router.get("/container/list", summary="获取所有容器列表",dependencies=[Depends(verify_token)])
async def root():
    return {
        "code": status.HTTP_200_OK,
        "message": "操作成功",
        "data":
            {
                "dockerContainer": {
                    "containers": json.loads(get_all_containers()),
                    "count": len(json.loads(get_all_containers()))
                }
            }
    }


@api_router.post("/container/start/{container_name}", summary="启动容器",dependencies=[Depends(verify_token)])
async def root(container_name: str):
    if start_container(container_name):
        return {
            "code": status.HTTP_200_OK,
            "message": "操作成功"
        }
    else:
        return {
            "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "message": "操作失败"
        }


@api_router.post("/container/stop/{container_name}", summary="停止容器",dependencies=[Depends(verify_token)])
async def root(container_name: str):
    if stop_container(container_name):
        return {
            "code": 200,
            "message": "操作成功"
        }
    else:
        return {
            "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "message": "操作失败"
        }


# 获取指定容器日志
@api_router.get("/container/logs/{container_name}", summary="获取指定容器日志",dependencies=[Depends(verify_token)])
async def root(container_name: str):
    print("获取指定容器日志")
    return {
        "code": 200,
        "message": "操作成功",
        "data":
            {
                "dockerContainer": {
                    "logs": get_container_logs(container_name)
                }
            }
    }


@api_router.delete("/container/delete/{container_name}", summary="删除指定容器",dependencies=[Depends(verify_token)])
async def root(container_name: str):
    if remove_container(container_name):
        return {
            "code": 200,
            "message": "操作成功"
        }
    else:
        return {
            "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "message": "操作失败"
        }


# 获取系统信息
@api_router.get("/system/info", summary="获取系统信息",dependencies=[Depends(verify_token)])
async def root():
    return {
        "code": 200,
        "message": "操作成功",
        "data":
            {
                "systemInfo": get_system_info()
            }
    }

class CommandItem(BaseModel):
    containerName: str
    command: list | None = None

# 向指定容器发送终端命令
@api_router.post("/container/terminal", summary="向指定容器发送终端命令",dependencies=[Depends(verify_token)])
async def root(commandItem: CommandItem):
    print(commandItem.dict())  # 使用 .dict() 方法将 Pydantic 模型转换为字典
    data = run_command_and_print_output(commandItem.containerName, commandItem.command)
    if data.get("exit_code") == 0:
        return {
            "code": 200,
            "message": "操作成功",
            "output": remove_quotes(json.dumps(data["output"]).encode().decode('unicode-escape')),  # 使用字典的键来访问 output,转换为utf-8  text.encode('utf-8')
            "command": json.dumps(commandItem.command),  # 使用 commandItem.command
        }
    else:
        return {
            "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "message": "操作失败",
        }
    
# 重置全局变量存储目录状态的辅助方法
@api_router.get("/reset_directory", summary="重置全局变量存储目录状态",dependencies=[Depends(verify_token)])
async def reset_directory():
    return json.dumps(reset_global_variable_storage_directory_status())
    
# 去除首尾引号方法
def remove_quotes(text):
    # 检查字符串首尾是否有双引号，并删除它们
    if text.startswith('"') and text.endswith('"'):
        cleaned_text = text[1:-1]
    else:
        cleaned_text = text
    return cleaned_text

# #######    用户相关   ########
@api_router.get("/users/list", tags=["user"], summary="获取用户列表",dependencies=[Depends(verify_token)])
async def get_users_list():
    rows = query_data('users')
    users = []
    for row in rows:
        print(row)          
        user = {
            "uid": row[0],
            "name": row[1],
            "post": row[2],
            "email": row[3],
            "password": None,
            "level": row[5],
            "created_at": row[6],
            "updated_at": row[7],
            "deleted": row[8],
            "remark": row[9]
        }
        users.append(user)
    return {
            "code": status.HTTP_200_OK,
            "message": "成功",
            "users": users
        }

# 查找用户
@api_router.get("/users/{user_id}", tags=["user"], summary="获取用户信息",dependencies=[Depends(verify_token)])
async def find_user(user_id: int):
    row = query_data('users', f"uid={user_id}")[0]
    print(row)
    if row:
        user = {
            "uid": row[0],
            "name": row[1],
            "post": row[2],
            "email": row[3],
            "password": None,
            "level": row[5],
            "created_at": row[6],
            "updated_at": row[7],
            "deleted": row[8],
            "remark": row[9]
        }
        return {
            "code": status.HTTP_200_OK,
            "message": "成功",
            "data": user
        }
    else:
        return {
            "code":status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
            "message": "用户不存在"
        }
    
# 登录
@api_router.post("/login", tags=["user"], summary="用户登录")
async def login(user: UserLogin):
    rows = query_data('users', f"name='{user.name}' and password='{user.password}'")
    print("rows", rows)
    if rows:
        token = create_access_token(data={"sub": user.name})
        uid = rows[0][0]
        return {
            "code": status.HTTP_200_OK,
            "message": "成功",
            "data": {
                "token": token,
                "user": {
                    "uid": uid,
                    "name": user.name,
                    "post": rows[0][2],
                    "email": rows[0][3],
                    "level": rows[0][5],
                    "created_at": rows[0][6],
                    "updated_at": rows[0][7],
                    "deleted": rows[0][8]
                }
            }
        }
    else:
        return {
            "code": status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
            "message": "用户不存在"
        }

# 注册
@api_router.post("/register", tags=["user"], summary="用户注册")
async def register(user: UserRegister):
    rows = query_data('users', f"name='{user.name}'")
    print("rows:",rows,type(rows),len(rows))
    if len(rows)>0:
        return {
                "code": status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
                "message": "用户已存在"
            }
    else:
        print("user:",user.model_dump())
        add_data('users', user.model_dump())
        return {
            "code": status.HTTP_200_OK,
            "message": "成功"
        }
    


# 查询表中的是否存在数据,用于判断是否初始化系统
@api_router.get("/is_initial_sys", tags=["user"], summary="查询表中的是否存在数据")
def is_initial_sys():
    rows = query_data('users')
    if len(rows)>0:
        return {
            "code": status.HTTP_200_OK,
            "message": "存在数据"
        }
    else:
        return {
            "code": status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
            "message": "不存在数据"
        }
    



# 远程ssh
@api_router.post("/ssh", tags=["ssh"], summary="远程ssh")
async def ssh(ssh: SSH):
    # ssh_command("10.13.6.47","root","Yuy@123","ls -l")
    return {
        "code":200,
        "message":"success",
        "data":{
            "input":ssh.command,
            "output":ssh_command(ssh.ip, ssh.username, ssh.password, ssh.command)
        }
    }
