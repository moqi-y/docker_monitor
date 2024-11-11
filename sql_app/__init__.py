import sqlite3

# 初始化数据库连接
def init_db():
    global conn, cursor
    try:
        conn = sqlite3.connect('./database/monitor.db')
        cursor = conn.cursor()
        print("初始化数据库连接成功")
        return conn, cursor
    except Exception as e:
        print("初始化数据库连接失败：", e)
        return False

# 创建表
def create_table(table_name, columns):
    global conn, cursor
    try:
        cursor.execute(f'CREATE TABLE IF NOT EXISTS {table_name} ({columns})')
        conn.commit()
        print("创建表成功")
        return True
    except Exception as e:
        print("创建表失败：", e)
        return False

# 关闭数据库连接
def close_db():
    global conn, cursor
    try:
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print("关闭数据库失败：", e)
        return False

# 初始化 conn 和 cursor
conn = None
cursor = None

# 导出
__all__ = ['init_db', 'create_table', 'close_db']