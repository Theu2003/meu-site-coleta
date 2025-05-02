const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userModel = require('./models/userModel');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cria a tabela de usuários ao iniciar o servidor
userModel.createTable();

// Rotas de autenticação
app.use('/auth', authRoutes);

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});