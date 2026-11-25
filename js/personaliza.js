(() => {
  const BS = window.BloomSafe || { report: e => console.error(e), safe: f => f, esc: x => String(x == null ? '' : x) };
  try {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const COL = [
    ['Morado','#7b3fc0','#5a2a96','#9a62d6'],['Rojo','#c4122f','#8f0b21','#e23a52'],['Amarillo','#f2b01d','#c98600','#ffd75e'],
    ['Azul','#2447b3','#16307f','#4a6fd8'],['Rosa','#f08cb8','#d0608d','#f9b8d5'],['Negro','#2a2430','#0f0c12','#4d4556'],['Blanco','#f4efe9','#cfc6bd','#ffffff']];
  const S = {tipo:'Ramo de rosas',cols:['Rojo'],n:'7',extras:[],tema:'Sin tema',msg:''};
  const PROD = {'Ramo de rosas':'Ramos florales','Caja de regalo':'Regalos personalizados','Sorpresa con luces':'Sorpresas especiales'};
  const colBox = $('#pzColors'); if (!colBox) return;
  colBox.innerHTML = COL.map(c => `<button type="button" data-c="${c[0]}" title="${c[0]}" aria-label="${c[0]}" style="background:${c[1]}"></button>`).join('');
  const POS = [];
  // Distribución en filas para que la vista previa admita hasta 30 rosas.
  [4,5,6,7,8].forEach((count,row) => {
    const y = 100 + row * 25;
    for (let i=0;i<count;i++) POS.push([150 + (i-(count-1)/2)*21, y]);
  });
  const ORDER = POS.map((_,i)=>i);
  function rose(x,y,c,r){const k=COL.find(a=>a[0]===c)||COL[0];return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="${k[1]}" stroke="${k[2]}" stroke-width="1.5"/><circle r="${r*.7}" fill="${k[3]}" stroke="${k[2]}" stroke-width="1.2"/><circle r="${r*.42}" fill="${k[1]}" stroke="${k[2]}" stroke-width="1.2"/><path d="M-${r*.2} 0a${r*.2} ${r*.2} 0 1 1 ${r*.4} 0" fill="none" stroke="${k[2]}" stroke-width="1.2"/></g>`;}
  function draw(){ try { drawInner(); } catch (e) { BS.report(e, 'personaliza:draw'); } }
  function drawInner(){
    const n = +S.n, r = n>24 ? 9 : n>19 ? 11 : n>14 ? 13 : n>9 ? 16 : n>6 ? 21 : 25, e = S.extras, has = x => e.includes(x);
    let s = `<path d="M150 285 L55 120 Q150 60 245 120Z" fill="#f4e9f8" stroke="#b88ad6" stroke-width="2"/><path d="M150 285 L82 105 Q150 70 218 105Z" fill="#fffdf8" stroke="#d9b4ec" stroke-width="1.5"/>`;
    if (S.tipo==='Caja de regalo') s = `<rect x="55" y="105" width="190" height="150" rx="6" fill="#fffdf8" stroke="#b88ad6" stroke-width="2.5"/><rect x="55" y="105" width="190" height="26" fill="#32106b"/>`;
    if (S.tipo==='Sorpresa con luces') s = `<rect x="50" y="110" width="200" height="150" rx="6" fill="#2a1450" stroke="#b88ad6" stroke-width="2"/>`;
    if (has('Luces LED') || S.tipo==='Sorpresa con luces') for (let i=0;i<18;i++){const a=i/18*6.283;s+=`<circle cx="${150+Math.cos(a)*112}" cy="${145+Math.sin(a)*92}" r="3.2" fill="#ffd75e"><animate attributeName="opacity" values=".35;1;.35" dur="${1.4+i%4*.4}s" repeatCount="indefinite"/></circle>`;}
    for (let i=0;i<n;i++){const p=POS[ORDER[i]];s+=rose(p[0],p[1]+(S.tipo==='Ramo de rosas'?0:25),S.cols[i%S.cols.length],r);}
    if (has('Mariposas doradas')) s+=`<g transform="translate(214 92) rotate(18)"><ellipse cx="-9" cy="0" rx="10" ry="6" fill="#e8b93a" stroke="#a37a10"/><ellipse cx="9" cy="0" rx="10" ry="6" fill="#e8b93a" stroke="#a37a10"/><rect x="-1.5" y="-7" width="3" height="14" fill="#a37a10"/></g>`;
    if (has('Chocolates')) s+=[[128,244],[150,252],[172,244]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="#d9a82e" stroke="#8a6410" stroke-width="1.5"/>`).join('');
    if (has('Collar')) s+=`<rect x="124" y="40" width="52" height="38" rx="4" fill="#1b1522" stroke="#e8d9c0" stroke-width="2"/><path d="M134 50 Q150 80 166 50" fill="none" stroke="#e8c76a" stroke-width="1.5"/><circle cx="150" cy="65" r="3.5" fill="#fff" stroke="#e8c76a"/>`;
    if (has('Globos')) s+=`<path d="M40 250 Q52 190 60 120" fill="none" stroke="#999"/><ellipse cx="60" cy="100" rx="20" ry="25" fill="#e23a52" stroke="#8f0b21" stroke-width="1.5"/>`;
    if (has('Vino')) s+=`<rect x="238" y="170" width="16" height="70" rx="5" fill="#5a1220"/><rect x="242" y="152" width="8" height="22" fill="#5a1220"/>`;
    if (has('Pastel')) s+=`<rect x="30" y="238" width="52" height="30" rx="4" fill="#fff" stroke="#c4122f" stroke-width="2"/><path d="M30 246 h52" stroke="#c4122f" stroke-width="3"/>`;
    s += `<path d="M150 272 q-26 -16 -32 6 q26 4 32 -6 q26 10 32 -6 q-6 -22 -32 6z" fill="#efb8d8" stroke="#b25f93" stroke-width="1.5"/>`;
    const svg = $('#pzSvg'); if (svg) svg.innerHTML = s;
    const cardTxt = $('#pzCardTxt'); if (cardTxt) cardTxt.textContent = S.msg || 'Tu mensaje aparecerá aquí';
    const items = [S.tipo, `${S.n} rosas`, S.cols.join(' + '), ...e]; if (S.tema!=='Sin tema') items.push('Tema: '+S.tema);
    const sum = $('#pzSum'); if (sum) sum.innerHTML = items.map(t=>`<li>${BS.esc(t)}</li>`).join('');
    const det = `Diseño armado en la web — Tipo: ${S.tipo}. Rosas: ${S.n} en ${S.cols.join(' y ')}. Extras: ${e.join(', ')||'ninguno'}. Tema: ${S.tema}.`;
    const ord = $('#pzOrder'); if (ord) ord.href = `pedido.html?producto=${encodeURIComponent(PROD[S.tipo] || 'Otro / tengo una idea')}&detalles=${encodeURIComponent(det)}${S.msg?'&mensaje='+encodeURIComponent(S.msg):''}${S.tipo==='Ramo de rosas'?'&rosas='+encodeURIComponent(S.n):''}`;
    const C = typeof BLOOM!=='undefined'?BLOOM:{}, ok = /^\d{8,15}$/.test(C.whatsapp||'');
    const wa = $('#pzWa'), ref = $('#pzRefWa');
    if (wa && ref) { if (ok){wa.hidden=false;wa.href=`https://wa.me/${C.whatsapp}?text=${encodeURIComponent('Hola Bloomdyss, quiero este diseño: '+det+(S.msg?' Mensaje: '+S.msg:''))}`;ref.href=`https://wa.me/${C.whatsapp}?text=${encodeURIComponent('Hola Bloomdyss, les envío una foto de referencia para mi regalo.')}`;}
    else {ref.href='https://www.instagram.com/bloomdyss/';ref.textContent='Escríbenos por Instagram ↗';ref.target='_blank';} }
    colBox.querySelectorAll('button').forEach(b=>b.classList.toggle('on',S.cols.includes(b.dataset.c)));
    $$('.pz-opts[data-key]').forEach(g=>g.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.v===String(S[g.dataset.key]))));
    $$('#pzExtras button').forEach(b=>b.classList.toggle('on',S.extras.includes(b.dataset.v)));
  }
  $$('.pz-opts[data-key] button').forEach(b=>b.addEventListener('click',BS.safe(()=>{S[b.parentNode.dataset.key]=b.dataset.v;draw();},'personaliza:opcion')));
  colBox.addEventListener('click',BS.safe(e=>{const b=e.target.closest('button');if(!b)return;const c=b.dataset.c,i=S.cols.indexOf(c);if(i>-1){if(S.cols.length>1)S.cols.splice(i,1);}else{S.cols.push(c);if(S.cols.length>2)S.cols.shift();}draw();},'personaliza:color'));
  $$('#pzExtras button').forEach(b=>b.addEventListener('click',BS.safe(()=>{const v=b.dataset.v,i=S.extras.indexOf(v);i>-1?S.extras.splice(i,1):S.extras.push(v);draw();},'personaliza:extra')));
  $('#pzMsg')?.addEventListener('input',BS.safe(e=>{S.msg=e.target.value.trim();draw();},'personaliza:mensaje'));
  $$('#pzSugs button').forEach(b=>b.addEventListener('click',BS.safe(()=>{const m=$('#pzMsg');if(m)m.value=b.textContent;S.msg=b.textContent;draw();},'personaliza:sugerencia')));
  const Q = {dulce:{cols:['Rosa','Blanco'],n:'9',extras:['Mariposas doradas'],t:'Una persona dulce merece algo suave y delicado.'},
    elegante:{cols:['Rojo','Negro'],n:'7',extras:['Mariposas doradas','Chocolates'],t:'Rojo y negro, con un toque dorado: elegancia pura.'},
    atrevida:{cols:['Morado','Rosa'],n:'9',extras:['Luces LED'],t:'Morado intenso con luces para alguien que brilla.'},
    alegre:{cols:['Amarillo','Azul'],n:'7',extras:['Globos'],t:'Mucho color para alguien que contagia alegría.'}};
  $$('.pz-quizgrid button').forEach(b=>b.addEventListener('click',BS.safe(()=>{const q=Q[b.dataset.q];if(!q)return;S.cols=[...q.cols];S.n=q.n;S.extras=[...q.extras];draw();const qm=$('#pzQuizMsg');if(qm)qm.textContent=q.t+' Lo apliqué al diseñador de arriba.';$('#disena')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});},'personaliza:quiz')));
  draw();
  } catch (e) { BS.report(e, 'personaliza:init'); }
})();
