const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Configuração do body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do banco de dados SQLite
const db = new sqlite3.Database(path.resolve(__dirname, 'users.db'), (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criação da tabela de usuários, se não existir
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
)`);

// Rota de registro de usuários
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(query, [name, email, password], function (err) {
    if (err) {
      console.error('Erro ao registrar usuário:', err);
      res.status(500).json({ error: 'Erro ao registrar usuário.' });
    } else {
      res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    }
  });
});

// Rota de login de usuários
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(query, [email, password], (err, row) => {
    if (err) {
      console.error('Erro ao autenticar usuário:', err);
      res.status(500).json({ error: 'Erro ao autenticar usuário.' });
    } else if (row) {
      res.status(200).json({ message: 'Login realizado com sucesso!' });
    } else {
      res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});