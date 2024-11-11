import sqlite3

conn = None
cursor = None

# 初始化数据库连接
def init_db():
    global conn, cursor
    try:
        conn = sqlite3.connect('./database/monitor.db')
        cursor = conn.cursor()
        return True
    except Exception as e:
        print("初始化数据库失败：", e)
        return False

# 创建表
def create_table(table_name, columns):
    global conn, cursor
    try:
        cursor.execute(f'CREATE TABLE IF NOT EXISTS {table_name} ({columns})')
        conn.commit()
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
    

# # 链接数据库
# conn = sqlite3.connect('example.db')
# # 创建游标对象
# cursor = conn.cursor()
# # 使用游标对象执行 SQL 命令来创建表
# cursor.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')

# # 查询数据
# cursor.execute('SELECT * FROM users')
# rows = cursor.fetchall()
# for row in rows:
#     print(row)
    
# # 插入数据
# cursor.execute('INSERT INTO users (name, age) VALUES (?, ?)', ('Alice', 30))
# conn.commit()
# # 提交事务
# # 关闭连接
# cursor.close()
# conn.close()

if __name__ == '__main__':
    init_db()