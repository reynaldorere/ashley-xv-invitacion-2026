'use strict';
(() => {
  const body = document.body;
  const openButton = document.querySelector('#open-invitation');
  const intro = document.querySelector('#intro');
  const musicButton = document.querySelector('#music-toggle');
  const musicIcon = document.querySelector('#sound-icon');
  const musicLabel = document.querySelector('#music-label');
  const audio = document.querySelector('#background-audio');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  audio.volume = 0.26;
  let musicPlaying = false;
  const syncMusic = (playing) => {
    musicPlaying = playing;
    musicButton.setAttribute('aria-pressed', String(playing));
    musicButton.setAttribute('aria-label', playing ? 'Silenciar canción' : 'Activar canción Moonlight');
    musicButton.classList.toggle('playing', playing);
    musicLabel.textContent = playing ? 'Silenciar' : 'Moonlight';
    musicIcon.setAttribute('href', playing ? '#i-sound' : '#i-mute');
  };
  const playMusic = async () => {
    try {
      await audio.play();
      syncMusic(true);
    } catch (error) {
      // Browsers may block playback. The toggle remains available for another gesture.
      syncMusic(false);
    }
  };
  musicButton.addEventListener('click', async () => {
    if (audio.paused) await playMusic();
    else { audio.pause(); syncMusic(false); }
  });
  audio.addEventListener('ended', () => syncMusic(false));
  audio.addEventListener('pause', () => syncMusic(false));

  // Opening is explicit, so music playback occurs only after a user gesture.
  openButton.addEventListener('click', () => {
    body.classList.add('opened');
    intro.setAttribute('aria-hidden', 'true');
    openButton.blur();
    window.scrollTo({ top: 0, behavior: 'instant' });
    playMusic();
    setTimeout(() => intro.setAttribute('inert', ''), reduced ? 0 : 1150);
  });

  // Fade in content as it enters the viewport.
  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reduced) {
    const observer = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('visible'));

  // Date is in San Miguel de Allende (Mexico City timezone, UTC-06:00 on Dec 25, 2026).
  const eventTime = new Date('2026-12-25T16:00:00-06:00').getTime();
  const countdown = document.querySelector('.countdown');
  const finished = document.querySelector('#count-finished');
  const fields = ['days', 'hours', 'minutes', 'seconds'].map(id => document.getElementById(id));
  const updateCountdown = () => {
    const delta = Math.max(0, eventTime - Date.now());
    if (delta === 0) {
      countdown.hidden = true;
      finished.hidden = false;
      return true;
    }
    let total = Math.floor(delta / 1000);
    const days = Math.floor(total / 86400); total %= 86400;
    const hours = Math.floor(total / 3600); total %= 3600;
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    [days, hours, minutes, seconds].forEach((v, i) => {
      fields[i].textContent = String(v).padStart(2, '0');
    });
    return false;
  };
  updateCountdown();
  const interval = window.setInterval(() => {
    if (updateCountdown()) window.clearInterval(interval);
  }, 1000);

  // Lightweight botanical accents: CSS animated petals, no heavy runtime animation library.
  if (!reduced) {
    const petals = document.getElementById('petals');
    for (let i = 0; i < 13; i++) {
      const element = document.createElement('span');
      element.className = 'petal';
      const f = (k) => (Math.sin((i + 1) * k) + 1) / 2;
      element.style.setProperty('--left', `${5 + f(4.56) * 89}%`);
      element.style.setProperty('--dur', `${12 + f(2.23) * 11}s`);
      element.style.setProperty('--delay', `${-f(7.91) * 21}s`);
      element.style.setProperty('--drift', `${-100 + f(1.78) * 220}px`);
      element.style.setProperty('--r', `${f(3.33) * 180}deg`);
      element.style.width = `${10 + f(4.84) * 8}px`;
      element.style.height = `${16 + f(5.11) * 9}px`;
      petals.appendChild(element);
    }
  }
})();
