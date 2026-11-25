(() => {
  const BS = window.BloomSafe || { report: e => console.error(e), toast() {}, esc: x => String(x == null ? '' : x), safe: f => f };
  const esc = BS.esc;
  try {
  const C = window.BLOOM || {};
  const ROSAS = { 5: 650, 6: 700, 7: 950, 8: 1050, 10: 1300, 12: 1450, 15: 1650, 20: 2100, 25: 2250, 30: 3100 };
  const TYPES = [
    { n: 'Ramo de rosas', d: 'Tú eliges cuántas rosas', rosas: true },
    { n: 'Ramo romántico', d: 'Para enamorar', rosas: true },
    { n: 'Rosa con cadena', d: 'Una rosa y una cadena de regalo', p: 350 },
    { n: 'Rosa con gloss', d: 'Una rosa individual con gloss', p: 200 },
    { n: 'Bolsita con maquillaje', d: 'Lista para regalar', p: 550 },
    { n: 'Cuadro personalizado', d: 'Tu artista, álbum o fotos enmarcados', p: 750 },
    { n: 'Caja personalizada', d: 'Te damos el precio por mensaje', p: null }
  ];
  const EX = (C.extras || []).map(e => typeof e === 'string' ? { n: e, p: null } : e);
  const COLORS = [['Rosa', '#f2a7c9'], ['Rojo', '#d6334a'], ['Blanco', '#fffaf4'], ['Morado', '#7a3fa0'], ['Lila', '#c3a2e0'], ['Amarillo', '#f6d04d'], ['Naranja', '#f4954a'], ['Azul', '#6ea8e0']];
  const OCC = ['Cumpleaños', 'Amor y amistad', 'Aniversario', 'Graduación o logro', 'Regalo sorpresa', 'Solo porque sí', 'Otra ocasión'];
  const money = v => 'RD$' + v.toLocaleString('es-DO');
  const S = { tipo: '', cantidad: '', colores: [], ocasion: '', extras: [], nombre: '', fecha: '', notas: '' };
  const typeObj = () => TYPES.find(t => t.n === S.tipo) || null;
  let steps = [];
  function buildSteps() {
    steps = ['tipo'];
    if (typeObj() && typeObj().rosas) steps.push('cantidad');
    steps.push('colores', 'ocasion');
    if (EX.length) steps.push('extras');
    steps.push('detalles');
  }
  buildSteps();
  function total() {
    const t = typeObj(); if (!t) return null;
    let base = t.rosas ? (ROSAS[S.cantidad] || null) : t.p;
    if (!base) return null;
    return base + S.extras.reduce((s, n) => s + ((EX.find(e => e.n === n) || {}).p || 0), 0);
  }
  let cur = 0;
  const $ = id => document.getElementById(id), box = $('stepBox');
  if (!box) return;
  const optBtn = (t, sub, sel) => `<button type="button" class="opt${sel ? ' sel' : ''}" data-v="${t}">${t}${sub ? `<small>${sub}</small>` : ''}</button>`;
  function render() { try { renderInner(); } catch (e) { BS.report(e, 'arma:render'); } }
  function renderInner() {
    const k = steps[cur]; let h = '';
    if (k === 'tipo') h = `<h2 class="step-q">¿Qué quieres <em>regalar?</em></h2><p class="step-h">Elige el tipo de detalle.</p><div class="opts">${TYPES.map(t => optBtn(t.n, t.d, S.tipo === t.n)).join('')}</div>`;
    if (k === 'cantidad') h = `<h2 class="step-q">¿Cuántas <em>rosas?</em></h2><p class="step-h">El precio cambia según la cantidad.</p><div class="opts">${Object.keys(ROSAS).map(n => optBtn(n + ' rosas', money(ROSAS[n]), S.cantidad === n).replace('data-v="' + n + ' rosas"', 'data-v="' + n + '"')).join('')}</div>`;
    if (k === 'colores') h = `<h2 class="step-q">¿Qué <em>colores</em> imaginas?</h2><p class="step-h">Elige hasta 3.</p><div class="swatches">${COLORS.map(([n, c]) => `<button type="button" class="sw${S.colores.includes(n) ? ' sel' : ''}" data-v="${n}"><i style="background:${c}"></i>${n}</button>`).join('')}</div>`;
    if (k === 'ocasion') h = `<h2 class="step-q">¿Para qué <em>ocasión?</em></h2><p class="step-h">Así sabemos qué quieres hacer sentir.</p><div class="opts">${OCC.map(o => optBtn(o, '', S.ocasion === o)).join('')}</div>`;
    if (k === 'extras') h = `<h2 class="step-q">Hazlo aún <em>más especial</em></h2><p class="step-h">Opcional: elige los extras que quieras.</p><div class="opts">${EX.map(e => optBtn(e.n, e.p ? '+' + money(e.p) + (e.n === 'Mariposa' ? ' c/u' : '') : '', S.extras.includes(e.n))).join('')}</div>`;
    if (k === 'detalles') h = `<h2 class="step-q">Últimos <em>detalles</em></h2><p class="step-h">Con esto armamos tu mensaje de pedido.</p><div class="step-form"><label>Tu nombre *<input id="fNombre" value="${esc(S.nombre)}" autocomplete="name"></label><label>Fecha en que lo necesitas *<input id="fFecha" type="date" value="${esc(S.fecha)}"></label><label>Cuéntanos más o escribe el mensaje del regalo (opcional)<textarea id="fNotas" rows="4">${esc(S.notas)}</textarea></label></div>`;
    box.innerHTML = h; if ($('progress')) $('progress').innerHTML = steps.map((_, i) => `<i class="${i <= cur ? 'on' : ''}"></i>`).join('');
    if ($('prevBtn')) $('prevBtn').hidden = cur === 0;
    if (!$('nextBtn')) return;
    $('nextBtn').innerHTML = cur === steps.length - 1 ? 'Enviar por WhatsApp <b>↗</b>' : 'Siguiente <b>→</b>';
    $('nextBtn').classList.toggle('send-wa', cur === steps.length - 1);
    const f = $('fFecha'); if (f) { const t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset()); f.min = t.toISOString().slice(0, 10); }
    summary();
  }
  function summary() {
    if (!$('sumTitle') || !$('sumList') || !$('sumPrice')) return;
    const rows = [['Tipo', S.tipo], ['Rosas', S.cantidad ? S.cantidad + ' rosas' : ''], ['Colores', S.colores.join(', ')], ['Ocasión', S.ocasion], ['Extras', S.extras.join(', ')], ['Para el', S.fecha]].filter(r => r[1]);
    $('sumTitle').textContent = S.tipo || 'Aún sin elegir';
    $('sumList').innerHTML = rows.length ? rows.map(([a, b]) => `<li><b>${a.toUpperCase()}</b>${b}</li>`).join('') : '<li>Empieza eligiendo el tipo de regalo.</li>';
    const t = typeObj(), tt = total();
    $('sumPrice').textContent = !t ? '' : tt ? (t.rosas || S.extras.length ? 'Estimado: ' : '') + money(tt) : t.rosas ? 'Desde ' + money(650) : 'Precio por mensaje';
  }
  box.addEventListener('click', BS.safe(e => {
    const b = e.target.closest('[data-v]'); if (!b) return; const v = b.dataset.v, k = steps[cur];
    if (k === 'tipo') { S.tipo = v; S.cantidad = ''; buildSteps(); } if (k === 'cantidad') S.cantidad = v; if (k === 'ocasion') S.ocasion = v;
    if (k === 'colores') { if (S.colores.includes(v)) S.colores = S.colores.filter(x => x !== v); else if (S.colores.length < 3) S.colores.push(v); }
    if (k === 'extras') S.extras = S.extras.includes(v) ? S.extras.filter(x => x !== v) : [...S.extras, v];
    render();
  }, 'arma:click'));
  box.addEventListener('input', BS.safe(e => { if (e.target.id === 'fNombre') S.nombre = e.target.value; if (e.target.id === 'fFecha') S.fecha = e.target.value; if (e.target.id === 'fNotas') S.notas = e.target.value; summary(); }, 'arma:input'));
  const say = t => { const s = $('buildStatus'); if (!s) { BS.toast(t); return; } s.textContent = t; s.classList.add('show'); };
  const valid = () => { const k = steps[cur];
    if (k === 'tipo' && !S.tipo) return say('Elige el tipo de regalo para continuar.'), false;
    if (k === 'cantidad' && !S.cantidad) return say('Elige la cantidad de rosas para continuar.'), false;
    if (k === 'ocasion' && !S.ocasion) return say('Elige una ocasión para continuar.'), false;
    if (k === 'detalles' && (!S.nombre.trim() || !S.fecha)) return say('Completa tu nombre y la fecha.'), false;
    $('buildStatus')?.classList.remove('show'); return true; };
  $('prevBtn')?.addEventListener('click', BS.safe(() => { if (cur > 0) { cur--; render(); } }, 'arma:anterior'));
  $('nextBtn')?.addEventListener('click', BS.safe(() => {
    if (!valid()) return;
    if (cur < steps.length - 1) { cur++; render(); window.scrollTo({ top: box.getBoundingClientRect().top + scrollY - 140, behavior: 'smooth' }); return; }
    const msg = ['🌸 *Arma tu regalo — Bloomdyss*', '', `*Nombre:* ${S.nombre}`, `*Tipo:* ${S.tipo}`, S.cantidad ? `*Cantidad de rosas:* ${S.cantidad}` : '', total() ? `*Precio estimado:* ${money(total())}${S.extras.some(n => n === 'Mariposa') ? ' (mariposa RD$25 c/u)' : ''}` : '*Precio:* por confirmar', `*Colores:* ${S.colores.join(', ') || 'A tu criterio'}`, `*Ocasión:* ${S.ocasion}`, S.extras.length ? `*Extras:* ${S.extras.join(', ')}` : '', `*Fecha deseada:* ${S.fecha}`, S.notas ? `*Detalles / mensaje:* ${S.notas}` : ''].filter(Boolean).join('\n');
    if (/^\d{8,15}$/.test(String(C.whatsapp || ''))) {
      const url = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;
      const w = window.open(url, '_blank', 'noopener');
      if (w === undefined) window.location.href = url;
    } else say('El WhatsApp de Bloomdyss no está disponible por ahora. Puedes hacer tu pedido desde el formulario.');
  }, 'arma:siguiente'));
  render();
  } catch (e) { BS.report(e, 'arma:init'); }
})();
