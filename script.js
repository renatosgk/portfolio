const CONFIG = {
  CHAR_DELAY: 0.04,
  PER_CHAR_MS: 40,
  CHAR_ANIMATION_DURATION: 1200,
  KANJI_DELAY_OFFSET: 100,
  INK_DROP_COUNT: 6,
  INK_DROP_MIN_SIZE: 6,
  INK_DROP_MAX_SIZE: 20,
  INK_DROP_LEFT_MIN: 8,
  INK_DROP_LEFT_MAX: 84,
  INK_DROP_ANIMATION_DELAY_MAX: 1.2,
  OBSERVER_THRESHOLD: 0.15,
};

const DOM = {
  splitElements: document.querySelectorAll('.split'),
  oniBtn: document.getElementById('oni-btn'),
  mobileMenu: document.getElementById('mobile-menu'),
  mobileLinks: document.querySelectorAll('.mobile-menu-link'),
  kanji: document.querySelector('.kanji-samurai.sumi-level2'),
  revealElements: document.querySelectorAll('.split, .reveal'),
};

function initCharacterSplit() {
  DOM.splitElements.forEach((el) => {
    const text = el.innerText;
    el.innerHTML = '';

    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.innerText = char === ' ' ? ' ' : char;
      span.style.transitionDelay = `${i * CONFIG.CHAR_DELAY}s`;
      el.appendChild(span);
    });
  });
}

function createInkDrops(kanji) {
  kanji.querySelectorAll('.ink-drop').forEach((drop) => drop.remove());

  for (let i = 0; i < CONFIG.INK_DROP_COUNT; i++) {
    const drop = document.createElement('span');
    drop.className = 'ink-drop';

    const left = CONFIG.INK_DROP_LEFT_MIN + Math.random() * CONFIG.INK_DROP_LEFT_MAX;
    drop.style.left = `${left}%`;

    const size = CONFIG.INK_DROP_MIN_SIZE + Math.random() * CONFIG.INK_DROP_MAX_SIZE;
    drop.style.width = `${size}px`;
    drop.style.height = `${size * 1.1}px`;

    drop.style.animationDelay = `${Math.random() * CONFIG.INK_DROP_ANIMATION_DELAY_MAX}s`;

    kanji.appendChild(drop);
    drop.addEventListener('animationend', () => drop.remove());
  }
}

function toggleMenu(isOpen) {
  DOM.oniBtn.classList.toggle('open', isOpen);
  DOM.mobileMenu.classList.toggle('open', isOpen);
  DOM.oniBtn.setAttribute('aria-expanded', String(isOpen));
  DOM.mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function initMenuToggle() {
  DOM.oniBtn.addEventListener('click', () => {
    const isOpen = DOM.oniBtn.classList.contains('open');
    toggleMenu(!isOpen);
  });

  DOM.mobileLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

function initIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('active');
      observer.unobserve(entry.target);

      if (entry.target.classList.contains('delay-2') && DOM.kanji && !DOM.kanji.classList.contains('active')) {
        const chars = entry.target.querySelectorAll('.char');
        const totalDelay = Math.max(0, (chars.length - 1) * CONFIG.PER_CHAR_MS) +
                          CONFIG.CHAR_ANIMATION_DURATION +
                          CONFIG.KANJI_DELAY_OFFSET;

        setTimeout(() => {
          DOM.kanji.classList.add('active');
          createInkDrops(DOM.kanji);
        }, totalDelay);
      }
    });
  }, { threshold: CONFIG.OBSERVER_THRESHOLD });

  DOM.revealElements.forEach((el) => {
    observer.observe(el);
  });
}

initCharacterSplit();
initMenuToggle();
initIntersectionObserver();
