// Mobile menu toggle + active link highlight + footer year
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navMenu.classList.remove('active')));

// Highlight nav link on scroll
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-menu a');
const activate = () => {
  let current = '';
  sections.forEach(sec => {
    const top = window.scrollY + 140;
    if (top >= sec.offsetTop && top < sec.offsetTop + sec.offsetHeight) current = '#' + sec.id;
  });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === current));
};
window.addEventListener('scroll', activate);
activate();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
