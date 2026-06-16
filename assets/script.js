/* ═══════════════════════════════════════════════════════
   NÓVERA — Script principal
═══════════════════════════════════════════════════════ */

// ── Loader ──
(function () {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const hideLoader = () => loader.classList.add('hide');
  // Fallback: hide after 1.5s no matter what
  setTimeout(hideLoader, 1500);
  // Also hide on load event if earlier
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 600);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 600));
  }
})();

// ── Nav scroll ──
(function () {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const isTransparent = nav.dataset.transparent === 'true';
  const apply = () => {
    if (isTransparent) {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    }
  };
  if (!isTransparent) {
    nav.classList.add('solid');
  }
  window.addEventListener('scroll', apply);
  apply();
})();

// ── Mobile menu ──
// Menú móvil accesible: sincroniza aria-expanded/aria-label, mueve el foco al abrir,
// atrapa el foco dentro (Tab/Shift+Tab cíclico), cierra con Escape y devuelve el foco.
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  // Botón de cierre interno (creado por JS).
  const closeBtn = document.createElement('button');
  closeBtn.className = 'mobile-menu-close';
  closeBtn.setAttribute('aria-label', 'Cerrar menú');
  closeBtn.innerHTML = '&#10005;';
  mobileMenu.prepend(closeBtn);

  // Devuelve los elementos enfocables actuales dentro del menú (cierre + enlaces).
  const getFocusables = () =>
    mobileMenu.querySelectorAll('a[href], button:not([disabled])');

  // Atrapa el foco dentro del menú mientras está abierto (foco cíclico).
  const trapFocus = (e) => {
    if (e.key !== 'Tab') return;
    const items = getFocusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus(); // del primero salta al último
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus(); // del último vuelve al primero
    }
  };

  // Abre el menú: estado ARIA, foco al primer enlace y activación del trap.
  const openMenu = () => {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Cerrar menú');
    // Movemos el foco al primer enlace del menú (saltando el botón de cierre).
    const firstLink = mobileMenu.querySelector('a[href]');
    (firstLink || closeBtn).focus();
    document.addEventListener('keydown', trapFocus);
  };

  // Cierra el menú: estado ARIA, libera el trap y devuelve el foco a la hamburguesa.
  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menú');
    document.removeEventListener('keydown', trapFocus);
    hamburger.focus(); // devolvemos el foco al disparador
  };

  // Alterna abrir/cerrar según el estado actual.
  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) closeMenu();
    else openMenu();
  });
  closeBtn.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Cierre con la tecla Escape mientras el menú está abierto.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });
})();

// ── Reveal on scroll ──
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
})();

// ── Consentimiento de cookies + Plausible ──
// Gestiona el banner de cookies y la carga condicional de la analítica Plausible.
// Solo se inyecta Plausible si el usuario ha ACEPTADO (requisito legal/AEPD).
(function () {
  const CONSENT_KEY = 'novera_cookie_consent'; // clave en localStorage
  const banner = document.getElementById('cookieBanner');

  // Inyecta dinámicamente el script de Plausible en el <head>.
  // Solo se llama cuando el consentimiento es 'accepted'. Evita duplicados.
  const cargarPlausible = () => {
    if (document.getElementById('plausible-analytics')) return; // ya cargado
    const s = document.createElement('script');
    s.id = 'plausible-analytics';
    s.defer = true;
    s.setAttribute('data-domain', 'ejemplo.danimefle.com');
    s.src = 'https://analytics.danimefle.com/js/script.js';
    document.head.appendChild(s);
  };

  // Al cargar, comprobamos el consentimiento previo guardado.
  const consent = localStorage.getItem(CONSENT_KEY);
  if (consent === 'accepted') {
    // Ya aceptó en una visita anterior → cargamos analítica directamente.
    cargarPlausible();
  }

  // Si no hay banner en esta página, no seguimos (pero Plausible ya se gestionó arriba).
  if (!banner) return;

  // Si todavía no hay decisión guardada, mostramos el banner.
  if (!consent) {
    banner.hidden = false; // lo hacemos visible al DOM
    // Pequeño retardo para que la transición de entrada se aprecie.
    setTimeout(() => banner.classList.add('show'), 800);
  }

  // Oculta el banner con la transición de salida y luego lo retira del flujo.
  const ocultarBanner = () => {
    banner.classList.remove('show');
    setTimeout(() => { banner.hidden = true; }, 600); // espera al fin de la transición
  };

  // Gestiona el clic en los botones Aceptar / Rechazar.
  banner.querySelectorAll('[data-cookie-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const accion = btn.dataset.cookieAction; // 'accepted' | 'rejected'
      localStorage.setItem(CONSENT_KEY, accion); // persistimos la decisión
      if (accion === 'accepted') cargarPlausible(); // solo cargamos si acepta
      ocultarBanner();
    });
  });
})();

// ── Portfolio filters ──
(function () {
  const filters = document.querySelectorAll('.portfolio-filter');
  const items = document.querySelectorAll('.masonry-item');
  if (!filters.length || !items.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const cats = (item.dataset.category || '').split(/\s+/);
        const show = filter === 'all' || cats.includes(filter);
        item.style.display = show ? '' : 'none';
      });
    });
  });
})();

// ── Hero Slider ──
// Carrusel del hero a 6000ms. Respeta prefers-reduced-motion (no auto-rota) y
// admite un botón de pausa/play (.hero-slider-pause) con su estado ARIA.
(function () {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-slider-dot');
  const label = document.querySelector('.hero-slide-label');
  const pauseBtn = document.querySelector('.hero-slider-pause');
  if (slides.length <= 1) return;

  const INTERVALO = 6000; // ms entre diapositivas (antes 1200, mareante)
  // ¿El usuario prefiere menos movimiento? Si es así, no auto-rotamos.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current = 0;
  let timer = null;       // referencia del setInterval activo
  let pausado = reduceMotion; // arrancamos pausado si se prefiere menos movimiento

  // Muestra la diapositiva i y sincroniza dots y etiqueta.
  const activate = (i) => {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    if (label) {
      const lbl = slides[i].dataset.label;
      if (lbl) {
        label.style.opacity = '0';
        setTimeout(() => { label.textContent = lbl; label.style.opacity = '1'; }, 300);
      }
    }
    current = i;
  };

  // Arranca la auto-rotación (solo si no está pausada ni se prefiere menos movimiento).
  const iniciar = () => {
    if (pausado || reduceMotion) return;
    clearInterval(timer);
    timer = setInterval(() => activate((current + 1) % slides.length), INTERVALO);
  };
  // Detiene la auto-rotación.
  const detener = () => clearInterval(timer);

  // Navegación manual por los dots.
  dots.forEach((dot, i) => dot.addEventListener('click', () => activate(i)));

  // Botón de pausa/play: alterna el estado y actualiza ARIA.
  if (pauseBtn) {
    // Refleja el estado inicial (importante si arranca pausado por reduce-motion).
    const syncPauseBtn = () => {
      pauseBtn.setAttribute('aria-pressed', pausado ? 'true' : 'false');
      pauseBtn.setAttribute('aria-label',
        pausado ? 'Reanudar presentación automática' : 'Pausar presentación automática');
    };
    syncPauseBtn();
    pauseBtn.addEventListener('click', () => {
      pausado = !pausado;
      if (pausado) detener(); else iniciar();
      syncPauseBtn();
    });
  }

  // Pausa al pasar el ratón por encima y reanuda al salir (si no está pausado a mano).
  slider.addEventListener('mouseenter', detener);
  slider.addEventListener('mouseleave', iniciar);

  iniciar(); // arranque
})();

// ── Lightbox para Portfolio ──
(function () {
  const items = document.querySelectorAll('.portfolio-item, .masonry-item, [data-lightbox]');
  if (!items.length) return;

  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="Cerrar">✕</button>
    <button class="lightbox-prev" aria-label="Anterior">←</button>
    <img alt="" />
    <button class="lightbox-next" aria-label="Siguiente">→</button>
    <div class="lightbox-caption"></div>
  `;
  document.body.appendChild(lb);
  const img = lb.querySelector('img');
  const caption = lb.querySelector('.lightbox-caption');
  const close = lb.querySelector('.lightbox-close');
  const prev = lb.querySelector('.lightbox-prev');
  const next = lb.querySelector('.lightbox-next');

  const images = [...items].map(el => {
    const bg = el.style.backgroundImage || '';
    const innerBg = el.querySelector('.img')?.style.backgroundImage || '';
    const style = innerBg || bg;
    const m = style.match(/url\(['"]?([^'"]+)['"]?\)/);
    const title = el.querySelector('h4')?.textContent?.trim();
    const tag = el.querySelector('span')?.textContent?.trim();
    return { src: m ? m[1] : null, title, tag };
  }).filter(x => x.src);

  let currentIdx = 0;
  let lastTrigger = null; // elemento que abrió el lightbox (para devolver el foco)

  const show = (i) => {
    currentIdx = (i + images.length) % images.length;
    const big = images[currentIdx].src.replace(/[?&]w=\d+/, '').replace(/\?q=\d+/, '') + (images[currentIdx].src.includes('unsplash.com') ? '?w=1800&q=90' : '');
    img.src = big;
    // alt descriptivo con el título del proyecto (nunca vacío) por accesibilidad.
    const titulo = [images[currentIdx].title, images[currentIdx].tag].filter(Boolean).join(' · ');
    img.alt = titulo || 'Imagen del proyecto';
    caption.textContent = titulo;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    close.focus(); // movemos el foco dentro del modal (botón cerrar)
  };

  const hide = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    // Devolvemos el foco al elemento que abrió el lightbox.
    if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
  };

  items.forEach((el, i) => {
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href') !== '#') return;
      e.preventDefault();
      lastTrigger = el; // recordamos el disparador
      show(i);
    });
  });

  close.addEventListener('click', hide);
  prev.addEventListener('click', () => show(currentIdx - 1));
  next.addEventListener('click', () => show(currentIdx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) hide(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') show(currentIdx - 1);
    if (e.key === 'ArrowRight') show(currentIdx + 1);
  });
})();

// ── La Florecilla Modal ──
// Modal accesible: gestiona aria-hidden, mueve el foco dentro al abrir,
// lo devuelve al disparador al cerrar y cierra con Escape.
(function () {
  const modal = document.getElementById('florecillaModal');
  if (!modal) return;
  const openers = document.querySelectorAll('[data-open-florecilla]');
  const closers = modal.querySelectorAll('[data-close-florecilla]');
  let lastTrigger = null; // elemento que abrió el modal

  const open = (e) => {
    e?.preventDefault();
    lastTrigger = e?.currentTarget || null; // recordamos el disparador
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false'); // visible para lectores de pantalla
    document.body.style.overflow = 'hidden';
    // Movemos el foco al primer elemento enfocable del modal (normalmente el botón cerrar).
    const focusable = modal.querySelector('a[href], button:not([disabled])');
    if (focusable) focusable.focus();
  };

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true'); // oculto para lectores de pantalla
    document.body.style.overflow = '';
    // Devolvemos el foco al disparador.
    if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
  };

  openers.forEach(btn => btn.addEventListener('click', open));
  closers.forEach(btn => btn.addEventListener('click', close));
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
})();

// ── Active nav link ──
// Marca el enlace de la página actual con la clase .active y aria-current="page".
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page'); // accesibilidad: enlace activo
    }
  });
})();

// ── Formularios (demo) ──
// Intercepta el envío de los formularios de contacto/moda: evita la recarga,
// resetea los campos y muestra un mensaje accesible en el contenedor .form-status
// (role="status" aria-live="polite"). No hay backend: comportamiento de demostración.
(function () {
  const forms = document.querySelectorAll('.contact-form, .contact-form-simple, form[data-demo]');
  if (!forms.length) return;

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // sin backend, evitamos la recarga
      form.reset();       // limpiamos los campos

      // Buscamos el contenedor de estado: dentro del form o como hermano cercano.
      const status = form.querySelector('.form-status') ||
                     form.parentElement?.querySelector('.form-status');
      if (status) {
        // Escribimos el mensaje de confirmación en la zona aria-live.
        status.textContent = 'Gracias por tu mensaje. Te responderemos lo antes posible.';
        status.classList.add('visible');
      } else {
        // Si no existe el contenedor, mantenemos el fallback de demo sin fallar.
        alert('Gracias por tu mensaje. Te responderemos lo antes posible.');
      }
    });
  });
})();
