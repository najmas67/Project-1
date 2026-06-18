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

const ensureRecordPlayer = () => {
  let recordPlayerButton = document.getElementById('record-player-button');
  let swanLakeAudio = document.getElementById('swan-lake-audio');
  let recordPlayerStatus = document.getElementById('record-player-status');

  if (recordPlayerButton && swanLakeAudio) {
    return { recordPlayerButton, swanLakeAudio, recordPlayerStatus };
  }

  const pageContent = document.querySelector('.page-content');

  if (!pageContent) {
    return null;
  }

  const dock = document.createElement('div');
  dock.className = 'record-player-dock';
  dock.setAttribute('aria-label', 'Music player');
  dock.innerHTML = `
    <button id="record-player-button" class="record-player" type="button" aria-pressed="false" aria-label="Play Swan Lake by Tchaikovsky">
      <span class="record-player-disc" aria-hidden="true"></span>
      <span class="record-player-text">Play Swan Lake</span>
    </button>
    <p id="record-player-status" class="record-player-status" aria-live="polite">Tap the record to play Swan Lake.</p>
    <audio id="swan-lake-audio" preload="metadata">
      <source src="https://commons.wikimedia.org/wiki/Special:FilePath/Tchaikovsky_Swan_Lake_Op.20_No.10._Sc%C3%A8ne.ogg" type="audio/ogg">
    </audio>
  `;

  pageContent.appendChild(dock);

  recordPlayerButton = document.getElementById('record-player-button');
  swanLakeAudio = document.getElementById('swan-lake-audio');
  recordPlayerStatus = document.getElementById('record-player-status');

  if (!recordPlayerButton || !swanLakeAudio) {
    return null;
  }

  return { recordPlayerButton, swanLakeAudio, recordPlayerStatus };
};

const setupRecordPlayer = () => {
  const playerElements = ensureRecordPlayer();

  if (!playerElements) {
    return;
  }

  const { recordPlayerButton, swanLakeAudio, recordPlayerStatus } = playerElements;

  const setPlayerState = (isPlaying, message, buttonLabel) => {
    recordPlayerButton.classList.toggle('playing', isPlaying);
    recordPlayerButton.setAttribute('aria-pressed', String(isPlaying));

    if (recordPlayerStatus && message) {
      recordPlayerStatus.textContent = message;
    }

    if (buttonLabel) {
      recordPlayerButton.setAttribute('aria-label', buttonLabel);
    }
  };

  swanLakeAudio.addEventListener('play', () => {
    setPlayerState(true, 'Now playing: Swan Lake by Tchaikovsky.', 'Pause Swan Lake by Tchaikovsky');
  });

  swanLakeAudio.addEventListener('pause', () => {
    if (!swanLakeAudio.ended) {
      setPlayerState(false, 'Paused. Tap the record to continue.', 'Play Swan Lake by Tchaikovsky');
    }
  });

  swanLakeAudio.addEventListener('ended', () => {
    setPlayerState(false, 'Swan Lake finished. Tap to play again.', 'Play Swan Lake by Tchaikovsky');
    swanLakeAudio.currentTime = 0;
  });

  swanLakeAudio.addEventListener('error', () => {
    setPlayerState(false, 'Could not load the track right now.', 'Play Swan Lake by Tchaikovsky');
  });

  recordPlayerButton.addEventListener('click', async () => {
    try {
      if (swanLakeAudio.paused) {
        await swanLakeAudio.play();
      } else {
        swanLakeAudio.pause();
      }
    } catch (_error) {
      setPlayerState(false, 'Playback was blocked. Tap again to start music.', 'Play Swan Lake by Tchaikovsky');
    }
  });
};

window.addEventListener('load', () => {
  applyTheme(getInitialTheme());
  setActivePageLink();
  setupRecordPlayer();
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
