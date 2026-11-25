(() => {
  'use strict';
  const BS = window.BloomSafe || { report: e => console.error(e) };
  try {
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.catalog-card');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(f => f.classList.toggle('active', f === btn));
  const value = btn.dataset.filter;
  cards.forEach(card => card.hidden = value !== 'todos' && card.dataset.category !== value);
}));
  } catch (e) { BS.report(e, 'catalogo:filtros'); }
})();

// Carrusel Bloomdyss: transición lateral automática con forma orgánica.
(() => {
  const BS = window.BloomSafe || { report: e => console.error(e) };
  try {
  const carousel = document.querySelector('.catalog-carousel');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  if (!slides.length) return;
  const dots = [...carousel.querySelectorAll('.carousel-dot')];
  const currentLabel = carousel.querySelector('.carousel-current');
  const previous = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let timer = null;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === activeIndex;
      slide.classList.toggle('is-active', active);
      slide.classList.toggle('is-after', i === (activeIndex + 1) % slides.length);
      slide.classList.toggle('is-before', i === (activeIndex - 1 + slides.length) % slides.length);
      slide.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, i) => {
      const active = i === activeIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
    if (currentLabel) currentLabel.textContent = String(activeIndex + 1).padStart(2, '0');
  }
  function stopTimer() { if (timer) window.clearInterval(timer); timer = null; }
  function startTimer() {
    stopTimer();
    if (!reducedMotion && !document.hidden) timer = window.setInterval(() => showSlide(activeIndex + 1), 4000);
  }
  previous?.addEventListener('click', () => { showSlide(activeIndex - 1); startTimer(); });
  next?.addEventListener('click', () => { showSlide(activeIndex + 1); startTimer(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); startTimer(); }));
  carousel.addEventListener('mouseenter', stopTimer);
  carousel.addEventListener('mouseleave', startTimer);
  carousel.addEventListener('focusin', stopTimer);
  carousel.addEventListener('focusout', startTimer);
  document.addEventListener('visibilitychange', () => document.hidden ? stopTimer() : startTimer());
  showSlide(0);
  startTimer();
  } catch (e) { BS.report(e, 'catalogo:carrusel'); }
})();
