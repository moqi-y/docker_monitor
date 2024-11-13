from sql_app import init_db,close_db
conn,cursor = init_db()

# 增加数据
def add_data(table_name, data):
    # 从字典中获取所有键（字段名）并用逗号分隔，形成字符串
    keys = ', '.join(data.keys())
    
    # 根据字典中的值的数量生成相应数量的'?'占位符，并用逗号分隔，形成字符串
    values = ', '.join(['?'] * len(data))
    
    # 构建插入数据的SQL语句
    sql = f"INSERT INTO {table_name} ({keys}) VALUES ({values})"
    
    # 执行SQL语句，插入数据
    # tuple(data.values())将字典的值转换为元组，以便作为参数传递给execute方法
    cursor.execute(sql, list(data.values()))
    
    # 提交事务，确保数据被保存到数据库
    conn.commit()

# 删除数据
def delete_data(table_name, condition):
    sql = f"DELETE FROM {table_name} WHERE {condition}"
    cursor.execute(sql)
    conn.commit()

# 修改数据
def update_data(table_name, data, condition):
    print("update_data",table_name, data, condition)
    set_clause = ', '.join([f"{key} = ?" for key in data.keys()])
    sql = f"UPDATE {table_name} SET {set_clause} WHERE {condition}"
    cursor.execute(sql, tuple(data.values()))
    conn.commit()
# 示例
# add_data('users', {'name': 'Alice', 'age': 25, 'email': 'alice@example.com'}, 'id=1')

# 查询数据
def query_data(table_name, condition=None):
    if condition:
        print("查询条件：", condition)
        sql = f"SELECT * FROM {table_name} WHERE {condition}"
    else:
        sql = f"SELECT * FROM {table_name}"
    cursor.execute(sql)
    return cursor.fetchall()
    # for row in cursor.fetchall():
    #     print(row)
    # condition = "id = 1"