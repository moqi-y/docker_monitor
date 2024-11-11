import json

from fastapi import APIRouter, status
from pydantic import BaseModel
from func.get_all_dockers import get_all_images, get_all_containers
from utils.docker_options import start_container, stop_container, remove_container, get_container_logs,run_command_and_print_output
from utils.sys_options import get_system_info

api_router = APIRouter()


@api_router.get("/image/list", summary="获取所有镜像列表")
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


@api_router.get("/container/list", summary="获取所有容器列表")
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


@api_router.post("/container/start/{container_name}", summary="启动容器")
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


@api_router.post("/container/stop/{container_name}", summary="停止容器")
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
@api_router.get("/container/logs/{container_name}", summary="获取指定容器日志")
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


@api_router.delete("/container/delete/{container_name}", summary="删除指定容器")
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
@api_router.get("/system/info", summary="获取系统信息")
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
@api_router.post("/container/terminal", summary="向指定容器发送终端命令")
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
    
# 去除首尾引号方法
def remove_quotes(text):
    # 检查字符串首尾是否有双引号，并删除它们
    if text.startswith('"') and text.endswith('"'):
        cleaned_text = text[1:-1]
    else:
        cleaned_text = text
    return cleaned_text