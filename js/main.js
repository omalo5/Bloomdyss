(() => {
  'use strict';
  const BS = window.BloomSafe || { report: e => console.error(e) };
  try {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    const closeNav = () => {
      nav?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      if (navToggle) navToggle.textContent = '☰';
    };
    if (navToggle && nav) {
      navToggle.addEventListener('click', () => {
        try {
          const open = nav.classList.toggle('open');
          navToggle.setAttribute('aria-expanded', String(open));
          navToggle.textContent = open ? '✕' : '☰';
        } catch (e) { BS.report(e, 'main:menu'); }
      });
      nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
    }
    const year = new Date().getFullYear();
    document.querySelectorAll('.year').forEach(el => { el.textContent = year; });
  } catch (e) {
    BS.report(e, 'main:init');
  }
})();
