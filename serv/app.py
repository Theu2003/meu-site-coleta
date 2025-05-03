from flask import Flask, request, jsonify, redirect, url_for, send_from_directory
import sqlite3
from urllib.parse import parse_qs
import os

app = Flask(__name__, static_folder='c:/Users/mateu/OneDrive/Documentos/GitHub/Projeto-teste', static_url_path='')

def init_db():
    # Inicializa o banco de dados e cria a tabela de usuários, se não existir
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        ''')
        conn.commit()

# Configuração para servir arquivos estáticos
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(os.path.dirname(__file__), filename)

@app.route('/register', methods=['POST'])
def register():
    if request.content_type == 'application/x-www-form-urlencoded':
        data = parse_qs(request.get_data(as_text=True))
        username = data.get('username', [None])[0]
        password = data.get('password', [None])[0]
    else:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    try:
        with sqlite3.connect('database.db') as conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
            conn.commit()
        return redirect('/index.html')  # Redireciona para o arquivo index.html após o cadastro
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 409

@app.route('/login', methods=['POST'])
def login():
    if request.content_type == 'application/x-www-form-urlencoded':
        data = parse_qs(request.get_data(as_text=True))
        username = data.get('username', [None])[0]
        password = data.get('password', [None])[0]
    else:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password))
        user = cursor.fetchone()

    if user:
        return redirect('/index.html')  # Redireciona para o arquivo index.html
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/')
def index():
    return redirect('/index.html')  # Redireciona para o arquivo index.html

if __name__ == '__main__':
    init_db()
    app.run(debug=True)