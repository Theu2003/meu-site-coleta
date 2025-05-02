const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Controlador para registrar um novo usuário
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    userModel.addUser(name, email, hashedPassword, (err, userId) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ message: 'E-mail já cadastrado.' });
        }
        return res.status(500).json({ message: 'Erro ao registrar usuário.' });
      }
      res.status(201).json({ message: 'Usuário registrado com sucesso.', userId });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Controlador para login de usuário
const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }
  userModel.findUserByEmail(email, async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor.' });
    }
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, 'secreta', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login bem-sucedido.', token });
  });
};

module.exports = {
  register,
  login,
};
