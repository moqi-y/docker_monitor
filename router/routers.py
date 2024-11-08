import json

from fastapi import APIRouter, status
from func.get_all_dockers import get_all_images, get_all_containers
from utils.docker_options import start_container, stop_container, remove_container, get_container_logs
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
