console.log("Site de coleta de lixo e recicláveis carregado com sucesso!");

// Adicionando animações ao rolar a página
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

// Adicionando botão de voltar ao topo
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

console.log("Melhorias interativas adicionadas com sucesso!");
