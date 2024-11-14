import json

import uvicorn
from fastapi import FastAPI, status
from fastapi import applications
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.middleware.cors import CORSMiddleware
from router.routers import api_router
from utils.ai_chat import send_chat_request

def swagger_monkey_patch(*args, **kwargs):
    return get_swagger_ui_html(
        *args, **kwargs,
        swagger_js_url="https://cdn.bootcdn.net/ajax/libs/swagger-ui/5.1.0/swagger-ui-bundle.min.js",
        swagger_css_url="https://cdn.bootcdn.net/ajax/libs/swagger-ui/5.1.0/swagger-ui.min.css")


applications.get_swagger_ui_html = swagger_monkey_patch

app = FastAPI(
    title="容器管理系统",
    description="容器管理系统开发接口文档",
    version="1.0.0",
)

# 允许所有来源
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

# create_table("users","id INTEGER PRIMARY KEY, name TEXT, post INTEGER, email TEXT, password TEXT, level INTEGER, created_at TEXT, updated_at TEXT, deleted INTEGER,remark TEXT")


@app.get("/hello/{name}", tags=["test"])
async def say_hello(name: str):
    # print("say_hello", name)
    # return {"message": f"Hello {name}"}
    response_text = send_chat_request()
    print("response_text:", response_text)
    return {"message": response_text}
    



if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
