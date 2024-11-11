from sql_app import init_db
conn,cursor = init_db()

# 增加数据
def add_data(table_name, data):
    keys = ', '.join(data.keys())
    values = ', '.join(['%s'] * len(data))
    sql = f"INSERT INTO {table_name} ({keys}) VALUES ({values})"
    cursor.execute(sql, tuple(data.values()))
    conn.commit()

# 删除数据
def delete_data(table_name, condition):
    sql = f"DELETE FROM {table_name} WHERE {condition}"
    cursor.execute(sql)
    conn.commit()

# 修改数据
def update_data(table_name, data, condition):
    set_clause = ', '.join([f"{key} = %s" for key in data.keys()])
    sql = f"UPDATE {table_name} SET {set_clause} WHERE {condition}"
    cursor.execute(sql, tuple(data.values()))
    conn.commit()

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