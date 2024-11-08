import psutil


def get_system_info():
    try:
        cpu_usage = psutil.cpu_percent(interval=1)
        cpu_physical_cores = psutil.cpu_count(logical=False)
        cpu_logical_cores = psutil.cpu_count(logical=True)
        memory_info = psutil.virtual_memory()
        return {
            "cpu_usage": cpu_usage * 10, 
            "cpu_physical_cores": cpu_physical_cores,
            "cpu_logical_cores": cpu_logical_cores,
            "memory_info": {
                "total": memory_info.total / (1024 ** 3),
                "available": memory_info.available / (1024 ** 3),
                "used": memory_info.used / (1024 ** 3),
                "percent": memory_info.percent
            }
        }
    except Exception as e:
        print("Error getting system info: ", e)
        return None


if __name__ == '__main__':
    print(get_system_info())
