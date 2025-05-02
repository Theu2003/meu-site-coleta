// Função para enviar dados de login ao back-end
const loginForm = document.querySelector('#login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email_login').value;
    const password = document.getElementById('senha_login').value;

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
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

    const name = document.getElementById('nome_cad').value;
    const email = document.getElementById('email_cad').value;
    const password = document.getElementById('senha_cad').value;

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
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
