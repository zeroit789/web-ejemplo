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
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'mobile-menu-close';
  closeBtn.setAttribute('aria-label', 'Cerrar menú');
  closeBtn.innerHTML = '&#10005;';
  mobileMenu.prepend(closeBtn);

  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  closeBtn.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
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

// ── Cookie Banner ──
(function () {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  const choice = localStorage.getItem('novera_cookies');
  if (!choice) {
    setTimeout(() => banner.classList.add('show'), 1800);
  }
  document.querySelectorAll('[data-cookie-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('novera_cookies', btn.dataset.cookieAction);
      banner.classList.remove('show');
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
(function () {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-slider-dot');
  const label = document.querySelector('.hero-slide-label');
  if (slides.length <= 1) return;

  let current = 0;
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

  dots.forEach((dot, i) => dot.addEventListener('click', () => activate(i)));

  let timer = setInterval(() => activate((current + 1) % slides.length), 1200);
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', () => { timer = setInterval(() => activate((current + 1) % slides.length), 1200); });
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

  const show = (i) => {
    currentIdx = (i + images.length) % images.length;
    const big = images[currentIdx].src.replace(/[?&]w=\d+/, '').replace(/\?q=\d+/, '') + (images[currentIdx].src.includes('unsplash.com') ? '?w=1800&q=90' : '');
    img.src = big;
    caption.textContent = [images[currentIdx].title, images[currentIdx].tag].filter(Boolean).join(' · ');
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const hide = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  };

  items.forEach((el, i) => {
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href') !== '#') return;
      e.preventDefault();
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
(function () {
  const modal = document.getElementById('florecillaModal');
  if (!modal) return;
  const openers = document.querySelectorAll('[data-open-florecilla]');
  const closers = modal.querySelectorAll('[data-close-florecilla]');
  const open = (e) => { e?.preventDefault(); modal.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
  openers.forEach(btn => btn.addEventListener('click', open));
  closers.forEach(btn => btn.addEventListener('click', close));
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
})();

// ── Active nav link ──
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();
