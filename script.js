const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.tab-link');

const setActiveLink = () => {
  const midpoint = window.scrollY + window.innerHeight / 3;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (midpoint >= top && midpoint < bottom) {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${sectionId}`;
        link.classList.toggle('active', isActive);
      });
    }
  });
};

window.addEventListener('scroll', setActiveLink, { passive: true });
window.addEventListener('load', setActiveLink);
