from datetime import datetime, timezone
import pytz
from dateutil.parser import isoparse


def format_time(iso_string):
    # 定义UTC+8时区
    utc_plus_8 = pytz.timezone('Asia/Shanghai')

    # 使用isoparse方法解析ISO 8601格式的时间字符串，包括纳秒
    dt_aware = isoparse(iso_string)

    # 将datetime对象转换为UTC时区，因为我们稍后会将其转换为UTC+8
    dt_utc = dt_aware.replace(tzinfo=timezone.utc)

    # 将UTC时间转换为UTC+8时区
    dt_localized = dt_utc.astimezone(utc_plus_8)

    # 格式化时间为时分秒字符串
    formatted_time = dt_localized.strftime("%Y-%m-%d %H:%M:%S")

    return formatted_time


if __name__ == '__main__':
    iso_string = "2024-03-29T11:24:19.158640911Z"
    print(format_time(iso_string))
