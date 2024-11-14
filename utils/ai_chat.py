import os
from dotenv import load_dotenv
from openai import OpenAI
import json

# 加载.env文件中的环境变量
load_dotenv()

def send_chat_request():
    # 构造 client
    client = OpenAI(
        api_key=os.environ.get("API_SECRET"), # 混元 APIKey
        base_url="https://api.hunyuan.cloud.tencent.com/v1", # 混元 endpoint
    )

    # 自定义参数传参示例
    stream = client.chat.completions.create(
        model="hunyuan-pro",
        messages=[
            {
                "role": "user",
                "content": "你认为环保的目的是什么呢",
            },
        ],
        stream=True,
        extra_body={
            "enable_enhancement": True, # <- 自定义参数
        },
    )
    for chunk in stream:
        if not chunk.choices:
            continue
        print(chunk.choices[0].delta.content, end="")
        response_text = chunk.choices[0].delta.content
        print("response_text:",response_text)
        yield response_text
    print()

# 使用示例
# api_secret = os.getenv('API_SECRET')   # 从环境变量获取API密钥
# response_text = send_chat_request(api_secret)
# print(response_text)