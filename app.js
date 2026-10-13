(() => {
  'use strict';
  const PROFESSIONALS_KEY = 'kamba_servicos_professionals_v1';
  const REQUESTS_KEY = 'kamba_servicos_requests_v1';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const safeRead = (key) => {
    try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : []; }
    catch { return []; }
  };
  const safeWrite = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  };
  let activeCategory = '';
  let searchText = '';
  let searchProvince = '';
  $('#year').textContent = new Date().getFullYear();

  const menuButton = $('#menuButton');
  const nav = $('#mainNav');
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menuButton.textContent = open ? '×' : '☰';
  });
  $$('#mainNav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menu'); menuButton.textContent = '☰';
  }));

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }
  function cleanAngolaPhone(value) {
    let digits = String(value || '').replace(/\D/g, '');
    if (digits.startsWith('00')) digits = digits.slice(2);
    if (digits.startsWith('244')) digits = digits.slice(3);
    if (digits.startsWith('0')) digits = digits.slice(1);
    return digits;
  }
  function renderProfessionals() {
    const all = safeRead(PROFESSIONALS_KEY);
    const filtered = all.filter(person => {
      const matchesText = !searchText || `${person.fullName} ${person.serviceCategory} ${person.description}`.toLowerCase().includes(searchText.toLowerCase());
      const matchesProvince = !searchProvince || person.province === searchProvince;
      const matchesCategory = !activeCategory || person.serviceCategory === activeCategory;
      return matchesText && matchesProvince && matchesCategory;
    });
    $('#professionalCount').textContent = all.length ? `${all.length} profissional(is) neste navegador` : 'Os primeiros profissionais podem começar aqui.';
    const list = $('#professionalList');
    if (!filtered.length) {
      list.innerHTML = `<div class="empty-state"><div class="empty-photo"><img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=85" alt="Profissional a trabalhar numa obra" loading="lazy"></div><div class="empty-copy"><span class="eyebrow">${all.length ? 'TENTE OUTRA PESQUISA' : 'A REDE ESTÁ A CRESCER'}</span><h3>${all.length ? 'Não encontrámos resultados.' : 'Seja dos primeiros a ser encontrado.'}</h3><p>${all.length ? 'Experimente outra palavra, categoria ou província.' : 'Estamos a preparar o directório. Se presta serviços, registe-se gratuitamente para dar o primeiro passo.'}</p><a class="button button-primary" href="#registar">Registar como profissional <span aria-hidden="true">→</span></a></div></div>`;
      return;
    }
    list.innerHTML = filtered.map(person => {
      const phone = String(person.phone || '').trim();
      const waNumber = cleanAngolaPhone(phone);
      const whatsappHref = waNumber ? `https://wa.me/244${waNumber}` : '';
      const telHref = phone ? `tel:${phone.replace(/[^+\d]/g, '')}` : '';
      return `<article class="professional-card"><p class="eyebrow">PROFISSIONAL LOCAL</p><h3>${escapeHTML(person.fullName)}</h3><span class="specialty">${escapeHTML(person.serviceCategory)}</span><p><b>Localização:</b> ${escapeHTML(person.province)}</p>${person.description ? `<p>${escapeHTML(person.description)}</p>` : ''}<div class="contact-actions">${whatsappHref ? `<a class="contact-link whatsapp" href="${whatsappHref}" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>` : ''}${telHref ? `<a class="contact-link" href="${telHref}">Ligar ${escapeHTML(phone)}</a>` : ''}</div><p class="form-footnote">Perfil de demonstração guardado neste navegador.</p><button class="remove-button" type="button" data-remove="${escapeHTML(person.id)}">Remover registo deste navegador</button></article>`;
    }).join('');
    $$('[data-remove]').forEach(button => button.addEventListener('click', () => {
      const id = button.getAttribute('data-remove');
      if (!confirm('Queres remover este registo deste navegador?')) return;
      safeWrite(PROFESSIONALS_KEY, safeRead(PROFESSIONALS_KEY).filter(person => person.id !== id));
      renderProfessionals();
    }));
  }
  $('#professionalForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const person = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      fullName: String(data.get('fullName') || '').trim(),
      serviceCategory: String(data.get('serviceCategory') || ''),
      province: String(data.get('province') || ''),
      phone: String(data.get('phone') || '').trim(),
      description: String(data.get('description') || '').trim(),
      createdAt: new Date().toISOString()
    };
    const all = safeRead(PROFESSIONALS_KEY);
    all.unshift(person);
    if (!safeWrite(PROFESSIONALS_KEY, all)) {
      $('#formMessage').textContent = 'Não foi possível guardar neste navegador. Verifique o espaço disponível.';
      return;
    }
    form.reset();
    $('#formMessage').textContent = 'Registo de demonstração guardado neste navegador. Ainda não está publicado online.';
    activeCategory = '';
    $$('.category-card').forEach(button => button.classList.remove('active'));
    searchText = ''; searchProvince = '';
    $('#searchInput').value = ''; $('#provinceFilter').value = '';
    renderProfessionals();
    $('#profissionais').scrollIntoView({behavior:'smooth'});
  });
  $('#searchForm').addEventListener('submit', event => {
    event.preventDefault();
    searchText = $('#searchInput').value.trim();
    searchProvince = $('#provinceFilter').value;
    renderProfessionals();
    $('#profissionais').scrollIntoView({behavior:'smooth'});
  });
  $$('.category-card').forEach(button => button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');
    activeCategory = activeCategory === category ? '' : category;
    $$('.category-card').forEach(item => item.classList.toggle('active', item.getAttribute('data-category') === activeCategory));
    searchText = ''; $('#searchInput').value = '';
    renderProfessionals();
    $('#profissionais').scrollIntoView({behavior:'smooth'});
  }));
  renderProfessionals();
})();
