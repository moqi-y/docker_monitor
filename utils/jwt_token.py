import jwt
from datetime import datetime, timedelta
from fastapi import status,HTTPException,Header

# 定义一个密钥，生产环境中应该保密,这里使用一个简单的字符串示例
SECRET_KEY = "1234567890"  #在生产环境中，需要从环境变量或配置文件中读取这个密钥,例如：SECRET_KEY = os.getenv("SECRET_KEY")

# 定义过期时间，例如24小时
ACCESS_TOKEN_EXPIRE_MINUTES = 24 * 60

# 生成JWT
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    # 生成JWT
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

# 定义一个函数来验证JWT
def verify_token(token: str = Header(...)):
    try:
        # 验证JWT
        decoded_jwt = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return {"message": "Token is valid", "data": decoded_jwt}
    except jwt.ExpiredSignatureError:
        # 如果JWT过期，返回401状态码
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.InvalidTokenError:
        # 如果JWT无效，返回401状态码
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception as e:
        # 如果发生其他错误，返回500状态码
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
# 在生产环境中，需要处理更多的异常情况，例如：jwt.InvalidAudienceError, jwt.InvalidIssuedAtError等
# 并且需要将SECRET_KEY设置为环境变量，以增加安全性
# 在生产环境中，还需要考虑如何处理JWT的刷新，例如：使用refresh token
# 在生产环境中，还需要考虑如何处理JWT的撤销，例如：使用黑名单机制
# 在生产环境中，还需要考虑如何处理JWT的签发，例如：使用RSA加密算法