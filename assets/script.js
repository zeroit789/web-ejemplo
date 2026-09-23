/* ═══════════════════════════════════════════════════════
   NÓVERA — Script principal
   NÓVERA — Main script
   -------------------------------------------------------
   JavaScript puro, sin dependencias. Cada bloque es una IIFE
   independiente que sale sin hacer nada si su página no tiene
   los elementos que necesita.
   Vanilla JavaScript, no dependencies. Each block is a standalone
   IIFE that exits early when its page lacks the elements it needs.
═══════════════════════════════════════════════════════ */

// ── Loader ──
// Oculta la pantalla de precarga (#loader) cuando la página termina de cargar.
// Hides the preload screen (#loader) once the page has finished loading.
(function () {
  const loader = document.getElementById('loader');
  if (!loader) return;
  // Añade la clase .hide, que hace el fundido de salida en CSS.
  // Adds the .hide class, which runs the CSS fade-out.
  const hideLoader = () => loader.classList.add('hide');
  // Plan B: se oculta a los 1,5 s pase lo que pase.
  // Fallback: hide after 1.5s no matter what.
  setTimeout(hideLoader, 1500);
  // Si la página ya cargó (o cuando lo haga), se oculta antes: 600 ms después del evento load.
  // If the page has already loaded (or once it does), hide it sooner: 600 ms after the load event.
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 600);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 600));
  }
})();

// ── Nav scroll ──
// Barra de navegación: transparente sobre el hero y opaca (.scrolled) al bajar más de 80 px.
// Las páginas sin data-transparent="true" la muestran siempre opaca (.solid).
// Navigation bar: transparent over the hero and solid (.scrolled) after scrolling past 80 px.
// Pages without data-transparent="true" always show it solid (.solid).
(function () {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const isTransparent = nav.dataset.transparent === 'true';
  // Activa o quita .scrolled según la posición del scroll.
  // Toggles .scrolled based on the scroll position.
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
// Accessible mobile menu: keeps aria-expanded/aria-label in sync, moves focus on open,
// traps focus inside (cyclic Tab/Shift+Tab), closes on Escape and restores focus.
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  // Botón de cierre interno (creado por JS).
  // Inner close button (created by JS).
  const closeBtn = document.createElement('button');
  closeBtn.className = 'mobile-menu-close';
  closeBtn.setAttribute('aria-label', 'Cerrar menú');
  closeBtn.innerHTML = '&#10005;';
  mobileMenu.prepend(closeBtn);

  // Devuelve los elementos enfocables actuales dentro del menú (cierre + enlaces).
  // Returns the current focusable elements inside the menu (close button + links).
  const getFocusables = () =>
    mobileMenu.querySelectorAll('a[href], button:not([disabled])');

  // Atrapa el foco dentro del menú mientras está abierto (foco cíclico).
  // Traps focus inside the menu while it is open (cyclic focus).
  const trapFocus = (e) => {
    if (e.key !== 'Tab') return;
    const items = getFocusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      // Del primero salta al último.
      // From the first item, jump to the last one.
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      // Del último vuelve al primero.
      // From the last item, wrap back to the first one.
      e.preventDefault();
      first.focus();
    }
  };

  // Abre el menú: estado ARIA, foco al primer enlace y activación del trap.
  // Opens the menu: ARIA state, focus on the first link and focus trap on.
  const openMenu = () => {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Cerrar menú');
    // Movemos el foco al primer enlace del menú (saltando el botón de cierre).
    // Move focus to the first menu link (skipping the close button).
    const firstLink = mobileMenu.querySelector('a[href]');
    (firstLink || closeBtn).focus();
    document.addEventListener('keydown', trapFocus);
  };

  // Cierra el menú: estado ARIA, libera el trap y devuelve el foco a la hamburguesa.
  // Closes the menu: ARIA state, releases the trap and returns focus to the hamburger.
  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menú');
    document.removeEventListener('keydown', trapFocus);
    // Devolvemos el foco al disparador.
    // Return focus to the trigger.
    hamburger.focus();
  };

  // Alterna abrir/cerrar según el estado actual.
  // Toggles open/closed based on the current state.
  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) closeMenu();
    else openMenu();
  });
  // El botón de cierre y cualquier enlace del menú lo cierran.
  // The close button and any menu link close it.
  closeBtn.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Cierre con la tecla Escape mientras el menú está abierto.
  // Close with the Escape key while the menu is open.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });
})();

// ── Reveal on scroll ──
// Anima la entrada de los elementos .reveal cuando asoman en pantalla (10 % visibles).
// Cada elemento se anima una sola vez y deja de observarse.
// Animates .reveal elements in as they come into view (10% visible).
// Each element animates only once and is then unobserved.
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
// ── Cookie consent + Plausible ──
// Handles the cookie banner and the conditional loading of Plausible analytics.
// Plausible is only injected once the visitor has ACCEPTED (legal/AEPD requirement).
(function () {
  // Clave en localStorage donde se guarda la decisión.
  // localStorage key where the choice is stored.
  const CONSENT_KEY = 'novera_cookie_consent';
  const banner = document.getElementById('cookieBanner');

  // Inyecta dinámicamente el script de Plausible en el <head>.
  // Solo se llama cuando el consentimiento es 'accepted'. Evita duplicados.
  // Dynamically injects the Plausible script into <head>.
  // Only called when consent is 'accepted'. Avoids duplicates.
  const cargarPlausible = () => {
    // Si ya está cargado, no hacemos nada.
    // Already loaded: do nothing.
    if (document.getElementById('plausible-analytics')) return;
    const s = document.createElement('script');
    s.id = 'plausible-analytics';
    s.defer = true;
    s.setAttribute('data-domain', 'ejemplo.danimefle.com');
    s.src = 'https://analytics.danimefle.com/js/script.js';
    document.head.appendChild(s);
  };

  // Al cargar, si en una visita anterior se ACEPTÓ, cargamos la analítica directamente.
  // On load, if the visitor ACCEPTED on a previous visit, load analytics right away.
  if (localStorage.getItem(CONSENT_KEY) === 'accepted') cargarPlausible();

  // Si no hay banner en esta página, no seguimos (Plausible ya se gestionó arriba).
  // No banner on this page: stop here (Plausible was already handled above).
  if (!banner) return;

  // Muestra el banner de forma fiable: doble requestAnimationFrame para que el
  // navegador aplique el estado inicial antes de la transición de entrada.
  // Shows the banner reliably: a double requestAnimationFrame lets the browser
  // apply the initial state before the entry transition.
  const mostrarBanner = () => {
    banner.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('show')));
  };

  // Oculta el banner con la transición de salida. SOLO se llama cuando el usuario
  // decide (Aceptar/Rechazar): nunca se cierra solo.
  // Hides the banner with the exit transition. ONLY called once the visitor
  // decides (Accept/Reject): it never closes on its own.
  const ocultarBanner = () => {
    banner.classList.remove('show');
    // Espera al fin de la transición (600 ms) antes de retirarlo con [hidden].
    // Wait for the transition to end (600 ms) before removing it with [hidden].
    setTimeout(() => { banner.hidden = true; }, 600);
  };

  // Reabre el banner para cambiar preferencias (botón en la política de cookies).
  // Reopens the banner to change preferences (button on the cookie policy page).
  const reabrirBanner = () => { localStorage.removeItem(CONSENT_KEY); mostrarBanner(); };

  // Si todavía NO hay decisión guardada, mostramos el banner y lo dejamos hasta que el usuario pulse.
  // If there is NO saved choice yet, show the banner and keep it until the visitor clicks.
  if (!localStorage.getItem(CONSENT_KEY)) mostrarBanner();

  // Clic en Aceptar / Rechazar: guarda la decisión ('accepted' | 'rejected') y oculta.
  // Solo se carga Plausible si acepta.
  // Accept / Reject click: saves the choice ('accepted' | 'rejected') and hides the banner.
  // Plausible is only loaded on accept.
  banner.querySelectorAll('[data-cookie-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const accion = btn.dataset.cookieAction;
      localStorage.setItem(CONSENT_KEY, accion);
      if (accion === 'accepted') cargarPlausible();
      ocultarBanner();
    });
  });

  // Cualquier elemento con [data-cookie-reopen] (p. ej. en la política de cookies)
  // vuelve a mostrar el banner para cambiar el consentimiento.
  // Any element with [data-cookie-reopen] (e.g. on the cookie policy page)
  // shows the banner again so consent can be changed.
  document.querySelectorAll('[data-cookie-reopen]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); reabrirBanner(); });
  });
})();

// ── Portfolio filters ──
// Filtros del portfolio: muestra solo los .masonry-item cuya data-category incluye
// la categoría del botón pulsado ('all' los muestra todos).
// Portfolio filters: shows only the .masonry-item elements whose data-category includes
// the clicked button's category ('all' shows every item).
(function () {
  const filters = document.querySelectorAll('.portfolio-filter');
  const items = document.querySelectorAll('.masonry-item');
  if (!filters.length || !items.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      // Marca el botón activo.
      // Mark the active button.
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      // Un elemento puede tener varias categorías separadas por espacios.
      // An item can have several space-separated categories.
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
// Hero carousel at 6000 ms. Honors prefers-reduced-motion (no auto-rotation) and
// supports a pause/play button (.hero-slider-pause) with its ARIA state.
(function () {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-slider-dot');
  const label = document.querySelector('.hero-slide-label');
  const pauseBtn = document.querySelector('.hero-slider-pause');
  if (slides.length <= 1) return;

  // Milisegundos entre diapositivas (antes 1200, mareante).
  // Milliseconds between slides (used to be 1200, which was dizzying).
  const INTERVALO = 6000;
  // ¿El usuario prefiere menos movimiento? Si es así, no auto-rotamos.
  // Does the user prefer reduced motion? If so, don't auto-rotate.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Índice de la diapositiva actual, referencia del setInterval activo y estado de pausa
  // (arranca pausado si se prefiere menos movimiento).
  // Current slide index, active setInterval handle and pause state
  // (starts paused when reduced motion is preferred).
  let current = 0;
  let timer = null;
  let pausado = reduceMotion;

  // Muestra la diapositiva i y sincroniza dots y etiqueta (con un fundido corto del texto).
  // Shows slide i and syncs the dots and label (with a short text fade).
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
  // Starts auto-rotation (only when not paused and reduced motion is not preferred).
  const iniciar = () => {
    if (pausado || reduceMotion) return;
    clearInterval(timer);
    timer = setInterval(() => activate((current + 1) % slides.length), INTERVALO);
  };
  // Detiene la auto-rotación.
  // Stops auto-rotation.
  const detener = () => clearInterval(timer);

  // Navegación manual por los dots.
  // Manual navigation through the dots.
  dots.forEach((dot, i) => dot.addEventListener('click', () => activate(i)));

  // Botón de pausa/play: alterna el estado y actualiza ARIA.
  // Pause/play button: toggles the state and updates ARIA.
  if (pauseBtn) {
    // Refleja el estado en aria-pressed/aria-label (importante si arranca pausado por reduce-motion).
    // Mirrors the state in aria-pressed/aria-label (matters when it starts paused due to reduced motion).
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
  // Pauses on mouse hover and resumes on mouse leave (unless paused manually).
  slider.addEventListener('mouseenter', detener);
  slider.addEventListener('mouseleave', iniciar);

  // Arranque.
  // Start.
  iniciar();
})();

// ── Lightbox para Portfolio ──
// Visor a pantalla completa para las imágenes del portfolio: se abre al pulsar un
// elemento con imagen de fondo, navega con flechas (botones o teclado) y cierra con Escape.
// ── Portfolio lightbox ──
// Full-screen viewer for portfolio images: opens when an element with a background
// image is clicked, navigates with arrows (buttons or keyboard) and closes on Escape.
(function () {
  const items = document.querySelectorAll('.portfolio-item, .masonry-item, [data-lightbox]');
  if (!items.length) return;

  // Crea el marcado del lightbox y lo añade al final del <body>.
  // Builds the lightbox markup and appends it to the end of <body>.
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

  // Extrae de cada elemento la URL de su background-image (propia o del hijo .img),
  // su título (h3, o h4 si alguna variante lo usa) y su etiqueta (span). Descarta los que no tienen imagen.
  // Extracts each element's background-image URL (its own or from its .img child),
  // its title (h3, or h4 if a variant uses it) and its tag (span). Items without an image are dropped.
  const images = [...items].map(el => {
    const bg = el.style.backgroundImage || '';
    const innerBg = el.querySelector('.img')?.style.backgroundImage || '';
    const style = innerBg || bg;
    const m = style.match(/url\(['"]?([^'"]+)['"]?\)/);
    const title = el.querySelector('h3, h4')?.textContent?.trim();
    const tag = el.querySelector('span')?.textContent?.trim();
    return { src: m ? m[1] : null, title, tag };
  }).filter(x => x.src);

  let currentIdx = 0;
  // Elemento que abrió el lightbox (para devolverle el foco al cerrar).
  // Element that opened the lightbox (to return focus to it on close).
  let lastTrigger = null;

  // Muestra la imagen i (con vuelta circular) y abre el lightbox.
  // Si la imagen es de Unsplash, pide una versión grande (?w=1800&q=90).
  // Shows image i (wrapping around) and opens the lightbox.
  // Unsplash images are requested in a larger size (?w=1800&q=90).
  const show = (i) => {
    currentIdx = (i + images.length) % images.length;
    const big = images[currentIdx].src.replace(/[?&]w=\d+/, '').replace(/\?q=\d+/, '') + (images[currentIdx].src.includes('unsplash.com') ? '?w=1800&q=90' : '');
    img.src = big;
    // alt descriptivo con el título del proyecto (nunca vacío) por accesibilidad.
    // Descriptive alt text built from the project title (never empty) for accessibility.
    const titulo = [images[currentIdx].title, images[currentIdx].tag].filter(Boolean).join(' · ');
    img.alt = titulo || 'Imagen del proyecto';
    caption.textContent = titulo;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Movemos el foco dentro del modal (botón cerrar).
    // Move focus inside the modal (close button).
    close.focus();
  };

  // Cierra el lightbox y restaura el scroll de la página.
  // Closes the lightbox and restores page scrolling.
  const hide = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    // Devolvemos el foco al elemento que abrió el lightbox.
    // Return focus to the element that opened the lightbox.
    if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
  };

  // Abre el lightbox al pulsar un elemento, salvo que sea un enlace a otra página
  // (href distinto de "#"), que navega con normalidad.
  // Opens the lightbox on click, unless the element is a link to another page
  // (href other than "#"), which navigates normally.
  items.forEach((el, i) => {
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href') !== '#') return;
      e.preventDefault();
      // Recordamos el disparador.
      // Remember the trigger.
      lastTrigger = el;
      show(i);
    });
  });

  // Controles: cerrar, anterior, siguiente, clic en el fondo y teclado (Escape, ←, →).
  // Controls: close, previous, next, backdrop click and keyboard (Escape, ←, →).
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
// Accessible modal: manages aria-hidden, moves focus inside on open,
// returns it to the trigger on close and closes on Escape.
(function () {
  const modal = document.getElementById('florecillaModal');
  if (!modal) return;
  const openers = document.querySelectorAll('[data-open-florecilla]');
  const closers = modal.querySelectorAll('[data-close-florecilla]');
  // Elemento que abrió el modal.
  // Element that opened the modal.
  let lastTrigger = null;

  // Abre el modal, bloquea el scroll de la página y enfoca su primer control.
  // Opens the modal, locks page scrolling and focuses its first control.
  const open = (e) => {
    e?.preventDefault();
    lastTrigger = e?.currentTarget || null;
    modal.classList.add('open');
    // Visible para lectores de pantalla.
    // Visible to screen readers.
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Movemos el foco al primer elemento enfocable del modal (normalmente el botón cerrar).
    // Move focus to the modal's first focusable element (usually the close button).
    const focusable = modal.querySelector('a[href], button:not([disabled])');
    if (focusable) focusable.focus();
  };

  // Cierra el modal, restaura el scroll y devuelve el foco.
  // Closes the modal, restores scrolling and returns focus.
  const close = () => {
    modal.classList.remove('open');
    // Oculto para lectores de pantalla.
    // Hidden from screen readers.
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Devolvemos el foco al disparador.
    // Return focus to the trigger.
    if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
  };

  // Disparadores de apertura/cierre, clic en el fondo y tecla Escape.
  // Open/close triggers, backdrop click and Escape key.
  openers.forEach(btn => btn.addEventListener('click', open));
  closers.forEach(btn => btn.addEventListener('click', close));
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
})();

// ── Active nav link ──
// Marca el enlace de la página actual con la clase .active y aria-current="page".
// Marks the current page's link with the .active class and aria-current="page".
(function () {
  // Nombre del fichero actual ("" en la raíz cuenta como index.html).
  // Current file name ("" at the site root counts as index.html).
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
      // Accesibilidad: enlace activo.
      // Accessibility: active link.
      a.setAttribute('aria-current', 'page');
    }
  });
})();

// ── Formularios (demo) ──
// Intercepta el envío de los formularios de contacto/moda: evita la recarga,
// resetea los campos y muestra un mensaje accesible en el contenedor .form-status
// (role="status" aria-live="polite"). No hay backend: comportamiento de demostración.
// ── Forms (demo) ──
// Intercepts contact/fashion form submissions: prevents the reload, resets the
// fields and shows an accessible message in the .form-status container
// (role="status" aria-live="polite"). There is no backend: demo behavior only.
(function () {
  const forms = document.querySelectorAll('.contact-form, .contact-form-simple, form[data-demo]');
  if (!forms.length) return;

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      // Sin backend, evitamos la recarga y limpiamos los campos.
      // No backend: prevent the reload and clear the fields.
      e.preventDefault();
      form.reset();

      // Buscamos el contenedor de estado: dentro del form o como hermano cercano.
      // Look for the status container: inside the form or as a nearby sibling.
      const status = form.querySelector('.form-status') ||
                     form.parentElement?.querySelector('.form-status');
      if (status) {
        // Escribimos el mensaje de confirmación en la zona aria-live.
        // Write the confirmation message into the aria-live region.
        status.textContent = 'Gracias por tu mensaje. Te responderemos lo antes posible.';
        status.classList.add('visible');
      } else {
        // Si no existe el contenedor, mantenemos el fallback de demo sin fallar.
        // If the container is missing, keep the demo fallback without failing.
        alert('Gracias por tu mensaje. Te responderemos lo antes posible.');
      }
    });
  });
})();
