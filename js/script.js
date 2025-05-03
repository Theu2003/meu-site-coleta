// Centraliza URLs da API
const API_BASE_URL = 'http://localhost:3000/auth';

// Função para exibir mensagens de erro
function showError(input, message) {
  const errorElement = document.createElement('small');
  errorElement.textContent = message;
  errorElement.style.color = 'red';
  input.parentElement.appendChild(errorElement);
  input.style.borderColor = 'red';
}

// Remove mensagens de erro anteriores
function clearErrors(form) {
  const errors = form.querySelectorAll('small');
  errors.forEach(error => error.remove());
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => (input.style.borderColor = ''));
}

// Função para enviar dados de login ao back-end
const loginForm = document.querySelector('#login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearErrors(loginForm);

    const email = document.getElementById('email_login');
    const password = document.getElementById('senha_login');

    if (!email.value || !password.value) {
      if (!email.value) showError(email, 'E-mail é obrigatório.');
      if (!password.value) showError(password, 'Senha é obrigatória.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value })
      });

      const result = await response.json();
      if (response.ok) {
        alert('Login realizado com sucesso!');
        window.location.href = 'index.html';
      } else {
        alert(result.message || 'Erro ao realizar login.');
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
      alert('Erro ao conectar ao servidor.');
    }
  });
}

// Função para enviar dados de cadastro ao back-end
const registerForm = document.querySelector('#register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearErrors(registerForm);

    const name = document.getElementById('nome_cad');
    const email = document.getElementById('email_cad');
    const password = document.getElementById('senha_cad');

    if (!name.value || !email.value || !password.value) {
      if (!name.value) showError(name, 'Nome é obrigatório.');
      if (!email.value) showError(email, 'E-mail é obrigatório.');
      if (!password.value) showError(password, 'Senha é obrigatória.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value, email: email.value, password: password.value })
      });

      const result = await response.json();
      if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        window.location.hash = '#login';
      } else {
        alert(result.message || 'Erro ao realizar cadastro.');
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
      alert('Erro ao conectar ao servidor.');
    }
  });
}

// Navegação suave entre seções
const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Mensagem de boas-vindas no console
console.log("Bem-vindo ao site de coleta de lixo e recicláveis!");
