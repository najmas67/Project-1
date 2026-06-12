const navLinks = document.querySelectorAll('.tab-link');
const themeToggle = document.getElementById('theme-toggle');
const THEME_STORAGE_KEY = 'theme-preference';
const PAGE_TRANSITION_MS = 260;

const getCurrentPage = () => {
  const page = window.location.pathname.split('/').pop();
  return page || 'index.html';
};

const setActivePageLink = () => {
  const currentPage = getCurrentPage();

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute('data-page');
    link.classList.toggle('active', linkPage === currentPage);
  });
};

const isNightTime = () => {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 6;
};

const applyTheme = (theme) => {
  document.body.setAttribute('data-theme', theme);

  if (themeToggle) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.textContent = isDark ? 'Light mode ☀️' : 'Dark mode 🌙';
  }
};

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }

  return isNightTime() ? 'dark' : 'light';
};

const setupPageTransitions = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    return;
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');

      if (!href || href.startsWith('#')) {
        return;
      }

      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (link.target === '_blank') {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      const current = new URL(window.location.href);

      if (destination.origin !== current.origin || destination.pathname === current.pathname) {
        return;
      }

      event.preventDefault();
      document.body.classList.add('page-transitioning');

      window.setTimeout(() => {
        window.location.href = destination.href;
      }, PAGE_TRANSITION_MS);
    });
  });
};

window.addEventListener('load', () => {
  applyTheme(getInitialTheme());
  setActivePageLink();
});

setupPageTransitions();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });
}
