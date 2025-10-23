// Mobile menu toggle + active link highlight + footer year
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navMenu.classList.remove('active')));

// Highlight nav link on scroll
// Highlight nav link on scroll (only for hash links like #home, #about, …)
const sections = document.querySelectorAll('section[id]');
const hashLinks = document.querySelectorAll('.nav-menu a[href^="#"]'); // ONLY # links

function setActive() {
  let current = '';
  const top = window.scrollY + 140; // offset for sticky nav

  sections.forEach(sec => {
    if (top >= sec.offsetTop && top < sec.offsetTop + sec.offsetHeight) {
      current = '#' + sec.id;
    }
  });

  hashLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === current);
  });
}

window.addEventListener('scroll', setActive);
setActive();


// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
