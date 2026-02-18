const splitElements = document.querySelectorAll(".split");

splitElements.forEach((el) => {
  const text = el.innerText;
  el.innerHTML = "";

  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.innerText = char === " " ? "\u00A0" : char;

    span.style.transitionDelay = `${i * 0.04}s`;
    el.appendChild(span);
  });
});

function createInkDrops(kanji, count = 6) {
  kanji.querySelectorAll(".ink-drop").forEach((n) => n.remove());

  for (let i = 0; i < count; i++) {
    const drop = document.createElement("span");
    drop.className = "ink-drop";

    const left = 8 + Math.random() * 84;
    drop.style.left = `${left}%`;

    const size = 6 + Math.random() * 20;
    drop.style.width = `${size}px`;
    drop.style.height = `${size * 1.1}px`;

    drop.style.animationDelay = `${Math.random() * 1.2}s`;

    kanji.appendChild(drop);
    drop.addEventListener("animationend", () => drop.remove());
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("active");
      observer.unobserve(entry.target);

      if (entry.target.classList.contains("delay-2")) {
        const chars = entry.target.querySelectorAll(".char");
        const perCharMs = 40;
        const charAnimationDuration = 1200;
        const totalDelay =
          Math.max(0, (chars.length - 1) * perCharMs) +
          charAnimationDuration +
          100;

        const kanji = document.querySelector(".kanji-samurai.sumi-level2");
        if (kanji && !kanji.classList.contains("active")) {
          const rect = kanji.getBoundingClientRect();
          setTimeout(() => {
            kanji.classList.add("active");
            createInkDrops(kanji, 6);
          }, totalDelay);
        }
      }
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".split, .reveal").forEach((el) => {
  observer.observe(el);
});

