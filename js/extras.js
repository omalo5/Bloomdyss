(() => {
  'use strict';
  const BS = window.BloomSafe || { report: e => console.error(e), toast() {}, esc: s => String(s == null ? '' : s) };
  const esc = BS.esc;
  const run = (name, fn) => { try { fn(); } catch (e) { BS.report(e, 'extras:' + name); } };
  const C = window.BLOOM || {};
  const waOK = /^\d{8,15}$/.test(String(C.whatsapp || ''));
  const waLink = (t) => `https://wa.me/${C.whatsapp}${t ? '?text=' + encodeURIComponent(t) : ''}`;

  // Botón flotante de WhatsApp
  run('whatsapp-flotante', () => {
    const a = document.createElement('a');
    a.className = 'wa-float'; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', 'Escríbenos por WhatsApp');
    a.href = waOK ? waLink('Hola Bloomdyss, quiero hacer un pedido 🌸') : '#';
    a.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z"/></svg><span>Escríbenos</span>';
    if (!waOK) a.addEventListener('click', e => {
      e.preventDefault();
      if (document.querySelector('.wa-toast')) return;
      const t = document.createElement('div'); t.className = 'wa-toast';
      t.textContent = 'El WhatsApp de Bloomdyss no está disponible por ahora. Escríbenos por Instagram o desde el formulario de pedido.';
      document.body.appendChild(t); setTimeout(() => t.remove(), 4500);
    });
    document.body.appendChild(a);
  });

  // Footer: contacto
  run('footer', () => {
    const links = [...document.querySelectorAll('.footer-links')].find(el => /ENCU/.test(el.textContent));
    if (!links) return;
    const add = (html) => links.insertAdjacentHTML('beforeend', html);
    if (waOK) add(`<a href="${esc(waLink())}" target="_blank" rel="noopener">WhatsApp ↗</a>`);
    if (C.horario) add(`<span>🕐 ${esc(C.horario)}</span>`);
    if (C.zonas) add(`<span>📍 ${esc(C.zonas)}</span>`);
  });

  // Testimonios
  run('testimonios', () => {
    const tBox = document.getElementById('testimonios');
    if (tBox && Array.isArray(C.testimonios) && C.testimonios.length) {
      tBox.innerHTML = `<section class="x-sec x-alt"><div class="x-head"><small>LO QUE DICEN</small><h2>Detalles que <em>se quedan en el corazón.</em></h2></div><div class="quotes-grid">${C.testimonios.slice(0, 3).map(t => `<figure class="quote-card" style="margin:0"><p>“${esc(t && t.texto)}”</p><cite>— ${esc(t && t.nombre)}</cite></figure>`).join('')}</div></section>`;
    }
  });

  // Instagram
  run('instagram', () => {
    const igBox = document.getElementById('instagram');
    if (!igBox) return;
    const fotos = (Array.isArray(C.instagramFotos) ? C.instagramFotos : []).slice(0, 6).map(f => `<img src="${esc(f)}" alt="Trabajo de Bloomdyss" loading="lazy">`).join('');
    igBox.innerHTML = `<section class="x-sec ig-strip"><div class="x-head"><small>@BLOOMDYSS</small><h2>Míranos <em>florecer</em> en Instagram.</h2><p>Nuestros trabajos más recientes, procesos y entregas.</p></div>${fotos ? `<div class="ig-grid">${fotos}</div>` : ''}<a class="button button-purple" href="${esc(C.instagram || 'https://www.instagram.com/bloomdyss/')}" target="_blank" rel="noopener">Seguir en Instagram <b>↗</b></a></section>`;
  });

  // Preguntas frecuentes extra
  run('faq', () => {
    const faq = document.querySelector('.faq-list');
    if (faq && Array.isArray(C.faqExtra)) C.faqExtra.forEach(f => faq.insertAdjacentHTML('beforeend', `<details class="faq-item"><summary>${esc(f && f.q)}</summary><p>${esc(f && f.a)}</p></details>`));
  });

  // Animaciones al hacer scroll
  run('animaciones', () => {
    const targets = document.querySelectorAll('.feature-card,.catalog-card,.values-list article,.step-card,.quote-card,.faq-item,.x-head,.ig-grid,.order-form,.order-aside');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
      targets.forEach(el => { el.classList.add('reveal'); io.observe(el); });
    } else {
      targets.forEach(el => el.classList.add('in'));
    }
  });

  // Campaña de temporada
  run('temporada', () => {
    const T = C.temporada;
    if (!T || !T.activa) return;
    const fin = T.hasta ? new Date(T.hasta + 'T23:59:59') : null;
    if (fin && !isNaN(fin) && new Date() > fin) return;
    const bar = document.createElement('div'); bar.className = 'season-bar';
    bar.innerHTML = `<span>✦ ${esc(T.franja)} ✦</span><a href="${esc(T.enlace)}">Ver más</a><button aria-label="Cerrar">×</button>`;
    const closeBtn = bar.querySelector('button');
    if (closeBtn) closeBtn.onclick = () => bar.remove();
    document.body.prepend(bar);
    const box = document.getElementById('temporada');
    if (box) box.innerHTML = `<section class="x-sec x-season"><small>${esc(T.etiqueta)}</small><h2>${esc(T.titulo)}</h2><p>${esc(T.texto)}</p><a class="button button-pink" href="${esc(T.enlace)}">${esc(T.boton)} <b>↗</b></a></section>`;
  });

  // Ondas decorativas
  run('ondas', () => {
    document.querySelectorAll('.x-alt').forEach(s => s.insertAdjacentHTML('afterbegin', '<div class="wave"><svg viewBox="0 0 1200 46" preserveAspectRatio="none"><path fill="#f4ebf5" d="M0 46V22C150 0 300 0 450 18s300 28 450 8 225-18 300-8v26z"/></svg></div>'));
  });

  // Barra fija en celular
  run('barra-movil', () => {
    if (/pedido|arma/.test(location.pathname)) return;
    const bar = document.createElement('div'); bar.className = 'mbar';
    bar.innerHTML = '<a class="m-order" href="arma.html">Arma tu regalo</a>' + (waOK ? `<a class="m-wa" href="${esc(waLink('Hola Bloomdyss, quiero hacer un pedido 🌸'))}" target="_blank" rel="noopener">WhatsApp</a>` : '<a class="m-wa" href="pedido.html">Hacer pedido</a>');
    document.body.appendChild(bar); document.body.classList.add('has-mbar');
  });
})();
