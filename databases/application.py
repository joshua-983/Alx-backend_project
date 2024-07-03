from flask import Flask, jsonify, request, render_template
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

def create_connection():
    connection = None
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="1355",
            database="food_db"
        )
        if connection.is_connected():
            print("Connection to MySQL DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")
    return connection

connection = create_connection()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/menu', methods=['GET'])
def get_menu():
    cursor = connection.cursor(dictionary=True)
    search_query = request.args.get('search', '').lower()
    if search_query:
        cursor.execute("SELECT * FROM menu_items WHERE LOWER(name) LIKE %s", ('%' + search_query + '%',))
    else:
        cursor.execute("SELECT * FROM menu_items")
    menu_items = cursor.fetchall()
    return jsonify(menu_items)

@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    data = request.get_json()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO contacts (name, email, message) VALUES (%s, %s, %s)",
                   (data['name'], data['email'], data['message']))
    connection.commit()
    return jsonify({"message": "Thank you for contacting us!"})

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                   (data['username'], data['email'], data['password']))
    connection.commit()
    return jsonify({"message": "Sign up successful!"})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s",
                   (data['email'], data['password']))
    user = cursor.fetchone()
    if user:
        return jsonify({"message": "Login successful!"})
    return jsonify({"error": "Invalid email or password!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

