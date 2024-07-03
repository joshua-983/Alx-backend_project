import mysql.connector

# Database connection details
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '1355',
    'database': 'food_db'
}

def get_db_connection():
    connection = mysql.connector.connect(**db_config)
    return connection

def create_user(username, email, password):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, password))
    connection.commit()
    cursor.close()
    connection.close()

def get_user_by_email(email):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    return user

def get_menu_items():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM menu_items")
    items = cursor.fetchall()
    cursor.close()
    connection.close()
    return items

def create_order(user_id, items):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO orders (user_id, total_price) VALUES (%s, %s)", (user_id, sum(item['price'] * item['quantity'] for item in items)))
    order_id = cursor.lastrowid
    for item in items:
        cursor.execute("INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (%s, %s, %s, %s)",
                       (order_id, item['menu_item_id'], item['quantity'], item['price']))
    connection.commit()
    cursor.close()
    connection.close()
    return order_id

def get_order_by_id(order_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM orders WHERE id = %s", (order_id,))
    order = cursor.fetchone()
    cursor.close()
    connection.close()
    return order

def get_order_items_by_order_id(order_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM order_items WHERE order_id = %s", (order_id,))
    order_items = cursor.fetchall()
    cursor.close()
    connection.close()
    return order_items

def get_user_orders(user_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM orders WHERE user_id = %s", (user_id,))
    orders = cursor.fetchall()
    cursor.close()
    connection.close()
    return orders

def get_user_order_items(user_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM order_items WHERE user_id = %s", (user_id,))
    order_items = cursor.fetchall()
    cursor.close()
    connection.close()
    return order_items


