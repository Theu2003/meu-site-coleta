const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = require('../database/db');

// Cria a tabela de usuários se não existir
function createTable() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`);
}

// Adiciona um novo usuário
function addUser(name, email, password, callback) {
  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(query, [name, email, password], function (err) {
    callback(err, this ? this.lastID : null);
  });
}

// Busca um usuário pelo email
function findUserByEmail(email, callback) {
  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], (err, row) => {
    callback(err, row);
  });
}

module.exports = {
  createTable,
  addUser,
  findUserByEmail,
};
