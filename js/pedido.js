/* Pedidos Bloomdyss: los pedidos se envían únicamente por WhatsApp. */
(() => {
  'use strict';
  const BS = window.BloomSafe || { report: e => console.error(e), toast() {}, safe: f => f, waNumber: () => '' };
  try {
    const C = window.BLOOM || {};
    const form = document.querySelector('#orderForm');
    if (!form) return;
    const statusBox = document.querySelector('#formStatus');
    const dateInput = document.querySelector('#fecha');
    const phoneInput = document.querySelector('#telefono');
    const productSelect = document.querySelector('#producto');
    const priceAmount = document.querySelector('#priceAmount');
    const priceNote = document.querySelector('#priceNote');
    const waBtn = document.getElementById('waBtn');
    const params = new URLSearchParams(window.location.search);
    let sending = false;
    const money = value => {
      try { return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 }).format(value).replace('DOP', 'RD$'); }
      catch (_) { return 'RD$' + value; }
    };
    const PRICE = { 'Ramos florales':650, 'Ramos románticos':650, 'Sorpresas especiales':650, 'Regalos personalizados':null, 'Detalles para celebrar':null, 'Cuadros personalizados':750, 'Bolsitas con maquillaje':550, 'Rosa con cadena':350, 'Rosa con gloss':200, 'Cadena con caja':400, 'Otro / tengo una idea':null };
    const ROSAS = { 5:650, 6:700, 7:950, 8:1050, 10:1300, 12:1450, 15:1650, 20:2100, 25:2250, 30:3100 };
    const ROSE_PRODUCTS = ['Ramos florales','Ramos románticos','Sorpresas especiales'];
    const rosasSelect = document.querySelector('#rosas');
    // Devuelve { amount, exact, rosas } según el producto y la cantidad de rosas elegida.
    function priceInfo(producto) {
      const r = rosasSelect ? rosasSelect.value : '';
      if (ROSE_PRODUCTS.includes(producto) && r && ROSAS[r]) return { amount: ROSAS[r], exact: true, rosas: r };
      return { amount: PRICE[producto] || null, exact: false, rosas: r };
    }
    function setStatus(msg) {
      if (!statusBox) { BS.toast(msg); return; }
      statusBox.textContent = msg; statusBox.classList.add('show');
      try { statusBox.scrollIntoView({ behavior:'smooth', block:'nearest' }); } catch (_) {}
    }
    function updatePrice() {
      if (!productSelect || !priceAmount || !priceNote) return;
      const info = priceInfo(productSelect.value), p = info.amount;
      if (!productSelect.value) { priceAmount.textContent='Selecciona un regalo'; priceNote.textContent='El precio final se confirma según los detalles y la disponibilidad.'; }
      else if (info.exact) { priceAmount.textContent = money(p) + ' · ' + info.rosas + ' rosas'; priceNote.textContent='Extras como mariposas, coronas, luces o cadena se suman aparte. Confirmaremos el total por WhatsApp.'; }
      else if (p) { priceAmount.textContent=(ROSE_PRODUCTS.includes(productSelect.value) ? 'Desde ' : '') + money(p); priceNote.textContent = ROSE_PRODUCTS.includes(productSelect.value) ? 'Elige la cantidad de rosas para ver el precio exacto.' : 'Confirmaremos el total por WhatsApp.'; }
      else { priceAmount.textContent='Precio por mensaje'; priceNote.textContent='Las cajas y diseños personalizados se cotizan por WhatsApp según tu idea.'; }
    }
    function collect() {
      const d = new FormData(form), get = k => String(d.get(k) == null ? '' : d.get(k)).trim();
      const producto = get('producto'), info = priceInfo(producto), price = info.amount;
      return { nombre:get('nombre'), telefono:get('telefono') || 'No indicado', producto,
        precio:price ? (info.exact ? money(price) : (ROSE_PRODUCTS.includes(producto) ? 'Desde ' : '') + money(price)) : 'Precio por confirmar', rosas:info.rosas ? info.rosas + ' rosas' : 'No indicado', ocasion:get('ocasion'), fecha:get('fecha'),
        presupuesto:get('presupuesto'), detalles:get('detalles'), mensaje:get('mensaje') || 'No indicado' };
    }
    function orderMessage(o) {
      return ['🌸 NUEVO PEDIDO — BLOOMDYSS','',`Nombre: ${o.nombre}`,`Teléfono / WhatsApp: ${o.telefono}`,'',
        `Producto: ${o.producto}`,`Cantidad de rosas: ${o.rosas}`,`Precio de referencia: ${o.precio}`,`Ocasión: ${o.ocasion}`,`Fecha deseada: ${o.fecha}`,
        `Presupuesto aproximado: ${o.presupuesto}`,'','DETALLES DEL PEDIDO:',o.detalles,'','MENSAJE PARA EL REGALO:',o.mensaje,'',
        'Pedido sujeto a confirmación de disponibilidad y precio.'].join('\n');
    }
    function validate() {
      if (sending) return false;
      if (!form.reportValidity()) return false;
      const phone = phoneInput ? phoneInput.value.trim() : '';
      if (phone && !/^\d{10,15}$/.test(phone)) {
        phoneInput.setCustomValidity('Escribe entre 10 y 15 dígitos, sin letras ni símbolos.');
        phoneInput.reportValidity(); return false;
      }
      return true;
    }
    // Aplica parámetros recibidos desde catálogo y personalización.
    try {
      const productoParam = params.get('producto');
      if (productoParam && productSelect) {
        const normalized = productoParam.trim().toLocaleLowerCase('es');
        const option = [...productSelect.options].find(o => o.text.trim().toLocaleLowerCase('es') === normalized);
        const aliases = {'ramo floral':'Ramos florales','regalo personalizado':'Regalos personalizados','sorpresa especial':'Sorpresas especiales','ramo romántico':'Ramos románticos','detalle para celebración':'Detalles para celebrar','detalle de celebración':'Detalles para celebrar','cuadro':'Cuadros personalizados','cuadros':'Cuadros personalizados'};
        productSelect.value = option ? option.value : (aliases[normalized] || 'Otro / tengo una idea');
      }
      const rosasParam = params.get('rosas');
      if (rosasParam && rosasSelect && ROSAS[rosasParam]) rosasSelect.value = rosasParam;
      const ocasionParam = params.get('ocasion'), occasionSelect = document.querySelector('#ocasion');
      if (ocasionParam && occasionSelect) { const opt = [...occasionSelect.options].find(o => o.text.toLowerCase() === ocasionParam.toLowerCase()); if (opt) occasionSelect.value = opt.value; }
      ['detalles','mensaje'].forEach(n => { const v=params.get(n), el=document.querySelector(`[name="${n}"]`); if (v && el) el.value=v; });
    } catch (e) { BS.report(e, 'pedido:parametros'); }
    productSelect?.addEventListener('change', BS.safe(updatePrice, 'pedido:cambio-producto'));
    rosasSelect?.addEventListener('change', BS.safe(updatePrice, 'pedido:cambio-rosas'));
    updatePrice();
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        const digits = phoneInput.value.replace(/\D/g, '').slice(0, 15);
        if (phoneInput.value !== digits) phoneInput.value = digits;
        phoneInput.setCustomValidity(digits && !/^\d{10,15}$/.test(digits) ? 'El teléfono debe contener entre 10 y 15 dígitos.' : '');
      });
      phoneInput.addEventListener('invalid', () => {
        if (phoneInput.value && !/^\d{10,15}$/.test(phoneInput.value)) phoneInput.setCustomValidity('Escribe entre 10 y 15 dígitos, sin letras ni símbolos.');
      });
    }
    try { if (dateInput) { const today=new Date(); today.setMinutes(today.getMinutes()-today.getTimezoneOffset()); dateInput.min=today.toISOString().slice(0,10); } }
    catch (e) { BS.report(e, 'pedido:fecha'); }
    form.addEventListener('submit', event => { event.preventDefault(); setStatus('Pulsa «Enviar pedido por WhatsApp» para continuar.'); });
    waBtn?.addEventListener('click', BS.safe(() => {
      if (!validate()) return;
      const num = BS.waNumber();
      if (!/^\d{8,15}$/.test(String(num || ''))) { setStatus('No se pudo abrir WhatsApp porque el número de contacto no está configurado correctamente. Inténtalo más tarde.'); return; }
      const o=collect(), url=`https://wa.me/${num}?text=${encodeURIComponent(orderMessage(o))}`;
      const w=window.open(url, '_blank', 'noopener,noreferrer');
      if (!w) window.location.href=url;
      setStatus('WhatsApp se abrirá con los datos de tu pedido. Revisa el mensaje y pulsa Enviar para completar el pedido.');
    }, 'pedido:whatsapp'));
  } catch (e) { BS.report(e, 'pedido:init'); }
})();
