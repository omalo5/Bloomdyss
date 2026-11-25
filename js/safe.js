/* ===== BLOOMDYSS — MANEJO GLOBAL DE EXCEPCIONES =====
   Se carga PRIMERO en todas las páginas. Atrapa errores no controlados,
   promesas rechazadas e imágenes rotas, y ofrece utilidades a los demás scripts. */
(function () {
  'use strict';

  var MENSAJE = 'Algo no salió como esperábamos. Recarga la página o escríbenos por WhatsApp 🌸';
  var avisos = 0;

  function report(err, donde) {
    try { console.error('[Bloomdyss]' + (donde ? ' (' + donde + ')' : ''), err); } catch (_) {}
  }

  function toast(msg, ms) {
    try {
      if (!document.body || avisos >= 2) return;
      avisos++;
      var t = document.createElement('div');
      t.setAttribute('role', 'alert');
      t.textContent = msg || MENSAJE;
      t.style.cssText = 'position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:99999;' +
        'max-width:min(92vw,420px);padding:12px 16px;background:#32106b;color:#fff;font:500 13px/1.5 "DM Sans",system-ui,sans-serif;' +
        'border-radius:10px;box-shadow:0 10px 30px rgba(50,16,107,.35);text-align:center';
      document.body.appendChild(t);
      setTimeout(function () { try { t.remove(); } catch (_) {} }, ms || 6000);
    } catch (e) { report(e, 'toast'); }
  }

  /* Escapa texto para insertarlo de forma segura en innerHTML */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Ejecuta fn y nunca lanza: devuelve fallback si falla */
  function run(fn, donde, fallback) {
    try { return fn(); } catch (e) { report(e, donde); return fallback; }
  }

  /* Envuelve un manejador de eventos (sincrónico o async) */
  function safe(fn, donde) {
    return function () {
      try {
        var r = fn.apply(this, arguments);
        if (r && typeof r.catch === 'function') r.catch(function (e) { report(e, donde); toast(); });
        return r;
      } catch (e) { report(e, donde); toast(); }
    };
  }

  /* Número de WhatsApp válido (solo dígitos, 8–15) o cadena vacía */
  function waNumber() {
    var n = String((window.BLOOM && window.BLOOM.whatsapp) || '').replace(/\D/g, '');
    return /^\d{8,15}$/.test(n) ? n : '';
  }

  window.BloomSafe = { report: report, toast: toast, esc: esc, run: run, safe: safe, waNumber: waNumber };

  /* Errores de JavaScript no controlados */
  window.addEventListener('error', function (e) {
    try {
      var t = e && e.target;
      if (t && t !== window && t.tagName) {
        if (t.tagName === 'IMG') {
          if (t.dataset && t.dataset.fb) { t.style.visibility = 'hidden'; return; }
          if (t.dataset) t.dataset.fb = '1';
          t.removeAttribute('srcset');
          t.src = 'assets/logo-bloomdyss.png';
          t.style.objectFit = 'contain';
          t.style.background = '#f4ebf5';
        } else {
          report('No se pudo cargar: ' + (t.src || t.href || t.tagName), 'recurso');
        }
        return;
      }
      report(e.error || e.message, 'window.onerror');
      toast();
    } catch (_) {}
  }, true);

  /* Promesas rechazadas sin catch */
  window.addEventListener('unhandledrejection', function (e) {
    report(e && e.reason, 'unhandledrejection');
    toast();
  });
})();
