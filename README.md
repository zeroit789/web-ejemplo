# Web Ejemplo — NÓVERA

Plantilla de **web corporativa de diseño** (estudio creativo multidisciplinar) construida con **HTML, CSS y JavaScript puro**, sin frameworks ni dependencias. Pensada como demo y punto de partida: rápida, accesible, optimizada para SEO y fácil de personalizar.

> ⚠️ **NÓVERA es una marca ficticia.** Todos los textos, datos de contacto e identidad son de ejemplo. Úsalos como base y sustitúyelos por los tuyos.

🔗 **Demo en vivo:** https://ejemplo.danimefle.com

![NÓVERA — captura](docs/preview.png)

---

## ✨ Características

- **100% estática** — solo HTML/CSS/JS. Se sirve en cualquier hosting (Nginx, Caddy, Netlify, GitHub Pages, Cloudflare Pages…).
- **11 páginas** — inicio, sobre nosotros, servicios y 6 páginas de servicio, portfolio y contacto.
- **Responsive** — diseño fluido de móvil a escritorio, con menú móvil propio.
- **SEO listo** — `<title>`/`description` por página, Open Graph + Twitter Cards, datos estructurados JSON-LD (`Organization`/`WebSite`/`LocalBusiness`), `sitemap.xml` y `robots.txt`.
- **Accesibilidad (a11y)** — HTML semántico, textos alternativos en imágenes, roles ARIA, navegación por teclado y enlace «saltar al contenido».
- **Analítica sin cookies** — integrado con [Plausible](https://plausible.io) (RGPD-friendly, sin banner de cookies).
- **Interacciones** — slider de portada, galería con lightbox, animaciones al hacer scroll, filtros de portfolio.

---

## 🚀 Cómo usarla

No necesita compilación. Tienes dos opciones:

**Opción A — abrir directamente**
Abre `index.html` en el navegador. (Algunas funciones se ven mejor servidas por HTTP, ver opción B.)

**Opción B — servidor local de previsualización** (requiere [Node.js](https://nodejs.org))
```bash
node server.js
# -> http://localhost:8080
```

---

## 🎨 Personalización (lo que vas a querer tocar)

| Qué cambiar | Dónde |
|---|---|
| **Nombre de marca** (`NÓVERA`) | Busca y reemplaza `NÓVERA` en todos los `.html` (logo, títulos, footer) |
| **Colores y tipografía** | `assets/style.css` — variables CSS al inicio del archivo (`:root`) |
| **Textos y secciones** | Cada `.html` está comentado por bloques (hero, servicios, footer…) |
| **Imágenes** | `assets/img/` — sustituye los `.jpg` por los tuyos manteniendo los nombres |
| **Datos de contacto** | Email, teléfono y dirección en el footer y en `contacto.html` |
| **SEO por página** | `<head>` de cada `.html` (title, description, Open Graph, JSON-LD) |
| **Dominio** | Reemplaza `ejemplo.danimefle.com` en `.html`, `sitemap.xml` y `robots.txt` |
| **Analítica** | Cambia `data-domain` del script de Plausible en cada `<head>`, o elimínalo |

---

## 📁 Estructura

```
web-ejemplo/
├── index.html              Inicio
├── sobre-nosotros.html
├── servicios.html
├── moda.html  branding.html  event-producer.html
├── interiorismo.html  asistencia-ejecutiva.html  arquitectura.html
├── portfolio.html
├── contacto.html
├── assets/
│   ├── style.css           Todos los estilos (variables editables en :root)
│   ├── script.js           Slider, lightbox, menú móvil, animaciones
│   ├── favicon.svg
│   └── img/                Imágenes (moda, branding, eventos…)
├── sitemap.xml
├── robots.txt
└── server.js               Servidor estático opcional para previsualizar
```

---

## 🌐 Despliegue

Al ser estática, sube la carpeta a cualquier sitio:
- **Hosting estático:** Netlify, Vercel, Cloudflare Pages, GitHub Pages.
- **Servidor propio:** copia los archivos a la raíz web de Nginx/Caddy/Apache.

Recuerda actualizar el dominio en `sitemap.xml`, `robots.txt` y las etiquetas `canonical`/`og:url` de cada página.

---

## 📄 Licencia

MIT — úsala, modifícala y publícala libremente. Las imágenes de ejemplo se incluyen solo con fines demostrativos; sustitúyelas por material propio o con licencia para uso comercial.

Autor: **Daniel Castaños Mefle**

---

<details>
<summary><b>English version</b></summary>

# Web Example — NÓVERA

A **design agency website template** (multidisciplinary creative studio) built with **vanilla HTML, CSS and JavaScript** — no frameworks, no build step. Fast, accessible, SEO-ready and easy to customize.

> ⚠️ **NÓVERA is a fictional brand.** All copy and contact data are placeholders — replace them with your own.

🔗 **Live demo:** https://ejemplo.danimefle.com

### Features
- 100% static (HTML/CSS/JS) — deploy anywhere.
- 11 pages, fully responsive with custom mobile menu.
- SEO ready: per-page meta, Open Graph, Twitter Cards, JSON-LD, sitemap, robots.
- Accessibility: semantic HTML, image alt text, ARIA roles, keyboard nav, skip link.
- Cookieless analytics via Plausible (GDPR-friendly).
- Slider, lightbox gallery, scroll animations, portfolio filters.

### Usage
Open `index.html`, or run a local preview server:
```bash
node server.js   # -> http://localhost:8080
```

### Customization
Brand name: find & replace `NÓVERA` in the `.html` files. Colors & fonts: CSS variables in `:root` (`assets/style.css`). Images: `assets/img/`. Domain: replace `ejemplo.danimefle.com` across `.html`, `sitemap.xml`, `robots.txt`.

### License
MIT. Demo images are for demonstration only — replace them with your own or commercially-licensed assets.

Author: **Daniel Castaños Mefle**

</details>
