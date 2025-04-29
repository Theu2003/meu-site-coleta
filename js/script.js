console.log("Site de coleta de lixo e recicláveis carregado com sucesso!");

//Animações ao rolar a página
const sections = document.querySelectorAll('section');

function animateOnScroll() {
  const windowHeight = window.innerHeight;
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < windowHeight - 100) {
      section.classList.add('visible');
    } else {
      section.classList.remove('visible');
    }
  });
}

window.addEventListener('scroll', animateOnScroll);

// Botão de voltar ao topo
const backToTopButton = document.createElement('button');
backToTopButton.textContent = '⬆️';
backToTopButton.id = 'back-to-top';
backToTopButton.style.position = 'fixed';
backToTopButton.style.bottom = '20px';
backToTopButton.style.right = '20px';
backToTopButton.style.display = 'none';
backToTopButton.style.padding = '10px';
backToTopButton.style.border = 'none';
backToTopButton.style.borderRadius = '50%';
backToTopButton.style.backgroundColor = '#6a1b9a';
backToTopButton.style.color = '#fff';
backToTopButton.style.cursor = 'pointer';
backToTopButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
backToTopButton.style.zIndex = '1000';

document.body.appendChild(backToTopButton);

backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function toggleBackToTopButton() {
  if (window.scrollY > 300) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
}

window.addEventListener('scroll', toggleBackToTopButton);

// Lógica para alternar entre login e notificação
const loginForm = document.getElementById('login-form');
const notificationSection = document.getElementById('notification');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Impede o envio do formulário

  // Simula um login bem-sucedido
  alert('Login realizado com sucesso!');

  // Esconde o formulário de login e exibe a seção de notificação
  loginForm.parentElement.style.display = 'none';
  notificationSection.style.display = 'block';
});

const notificationForm = document.getElementById('notification-form');
notificationForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Impede o envio do formulário

  // Captura os dados do formulário
  const type = document.getElementById('type').value;
  const description = document.getElementById('description').value;

  // Obtém o ID do usuário logado
  const user = firebase.auth().currentUser;
  if (user) {
    saveNotification(type, description, user.uid);
  } else {
    alert('Você precisa estar logado para enviar uma notificação.');
  }

  // Limpa o formulário
  notificationForm.reset();
});

// Configuração do Firebase
// Substitua as chaves abaixo pelas suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Configuração do Firestore
const db = firebase.firestore();

// Função para salvar notificações no Firestore
function saveNotification(type, description, userId) {
  db.collection('notifications').add({
    type: type,
    description: description,
    userId: userId,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    alert('Notificação salva com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao salvar notificação:', error);
    alert('Erro ao salvar notificação. Tente novamente.');
  });
}

// Referências aos botões de login
const googleLoginButton = document.getElementById('google-login');
const phoneLoginButton = document.getElementById('phone-login');

// Login com Google
googleLoginButton.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      alert(`Bem-vindo, ${result.user.displayName}!`);
      // Exibe a seção de notificação
      document.getElementById('login').style.display = 'none';
      document.getElementById('notification').style.display = 'block';
    })
    .catch((error) => {
      console.error('Erro no login com Google:', error);
      alert('Erro ao fazer login com Google. Tente novamente.');
    });
});

// Login com Telefone
phoneLoginButton.addEventListener('click', () => {
  const phoneNumber = prompt('Digite seu número de telefone (com DDD):');
  const appVerifier = new firebase.auth.RecaptchaVerifier('phone-login', {
    size: 'invisible'
  });

  firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      const code = prompt('Digite o código de verificação enviado para seu telefone:');
      return confirmationResult.confirm(code);
    })
    .then((result) => {
      alert(`Bem-vindo, ${result.user.phoneNumber}!`);
      // Exibe a seção de notificação
      document.getElementById('login').style.display = 'none';
      document.getElementById('notification').style.display = 'block';
    })
    .catch((error) => {
      console.error('Erro no login com Telefone:', error);
      alert('Erro ao fazer login com Telefone. Tente novamente.');
    });
});

// Adicionando spinner para feedback visual
function showSpinner() {
  const spinner = document.createElement('div');
  spinner.id = 'spinner';
  spinner.style.position = 'fixed';
  spinner.style.top = '50%';
  spinner.style.left = '50%';
  spinner.style.transform = 'translate(-50%, -50%)';
  spinner.style.border = '4px solid #f3f3f3';
  spinner.style.borderTop = '4px solid #6a1b9a';
  spinner.style.borderRadius = '50%';
  spinner.style.width = '40px';
  spinner.style.height = '40px';
  spinner.style.animation = 'spin 1s linear infinite';
  document.body.appendChild(spinner);
}

function hideSpinner() {
  const spinner = document.getElementById('spinner');
  if (spinner) {
    spinner.remove();
  }
}

// Adicionando mensagens de erro detalhadas no login
if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    showSpinner();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        hideSpinner();
        alert('Login realizado com sucesso!');
        window.location.href = 'index.html';
      })
      .catch((error) => {
        hideSpinner();
        let errorMessage;
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'Usuário não encontrado. Verifique o email digitado.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Senha incorreta. Tente novamente.';
            break;
          default:
            errorMessage = 'Erro ao fazer login. Tente novamente mais tarde.';
        }
        alert(errorMessage);
      });
  });
}

// Adicionando mensagens de erro detalhadas no agendamento de coleta
if (scheduleForm) {
  scheduleForm.addEventListener('submit', (event) => {
    event.preventDefault();
    showSpinner();
    const type = document.getElementById('type').value;
    const address = document.getElementById('address').value;
    const description = document.getElementById('description').value;
    const quantity = document.getElementById('quantity').value;

    const user = firebase.auth().currentUser;
    if (user) {
      db.collection('schedules').add({
        type,
        address,
        description,
        quantity,
        userId: user.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        hideSpinner();
        alert('Coleta agendada com sucesso!');
        scheduleForm.reset();
      })
      .catch((error) => {
        hideSpinner();
        console.error('Erro ao agendar coleta:', error);
        alert('Erro ao agendar coleta. Tente novamente mais tarde.');
      });
    } else {
      hideSpinner();
      alert('Você precisa estar logado para agendar uma coleta.');
    }
  });
}

// Adicionando botão de logout
const logoutButton = document.createElement('button');
logoutButton.textContent = 'Sair';
logoutButton.id = 'logout-button';
logoutButton.style.position = 'fixed';
logoutButton.style.top = '20px';
logoutButton.style.right = '20px';
logoutButton.style.padding = '10px';
logoutButton.style.border = 'none';
logoutButton.style.borderRadius = '5px';
logoutButton.style.backgroundColor = '#6a1b9a';
logoutButton.style.color = '#fff';
logoutButton.style.cursor = 'pointer';
logoutButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
logoutButton.style.zIndex = '1000';

document.body.appendChild(logoutButton);

logoutButton.addEventListener('click', () => {
  firebase.auth().signOut()
    .then(() => {
      alert('Você saiu da sua conta.');
      window.location.href = 'login.html';
    })
    .catch((error) => {
      console.error('Erro ao sair:', error);
      alert('Erro ao sair. Tente novamente.');
    });
});

// Animação do spinner
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

// Alternar entre telas com base no tipo de usuário
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const userDashboard = document.getElementById('user-dashboard');
const collectorDashboard = document.getElementById('collector-dashboard');
const welcomeSection = document.getElementById('welcome');

loginButton.addEventListener('click', () => {
  // Simula o login e define o tipo de usuário
  const userType = prompt('Digite o tipo de usuário (cidadão ou coletor):').toLowerCase();

  if (userType === 'cidadão') {
    welcomeSection.style.display = 'none';
    userDashboard.style.display = 'block';
  } else if (userType === 'coletor') {
    welcomeSection.style.display = 'none';
    collectorDashboard.style.display = 'block';
  } else {
    alert('Tipo de usuário inválido. Tente novamente.');
  }
});

registerButton.addEventListener('click', () => {
  alert('Funcionalidade de cadastro em breve!');
});

console.log("Melhorias interativas adicionadas com sucesso!");