/* ===========================================================
   NÓVERA — Servidor estático de previsualización local
   NÓVERA — Local static preview server
   -----------------------------------------------------------
   Sirve la web en http://localhost:8080 sin dependencias.
   Es solo para verla en local: en producción la sirve un
   servidor web normal (Nginx, Caddy, Apache, hosting estático...).
   Serves the site at http://localhost:8080 with no dependencies.
   It is only meant for local previews: in production the site is
   served by a regular web server (Nginx, Caddy, Apache, static hosting...).
   Uso / Usage:  node server.js
   =========================================================== */

// Módulos nativos de Node: servidor HTTP, lectura de ficheros y manejo de rutas.
// Built-in Node modules: HTTP server, file reading and path handling.
const http = require('http');
const fs   = require('fs');
const path = require('path');

// Puerto local, carpeta raíz (la del proyecto) y su ruta absoluta canónica
// (se usa para la comprobación de path traversal).
// Local port, root folder (the project folder) and its canonical absolute path
// (used for the path traversal check).
const PORT    = 8080;
const DIR     = __dirname;
const SAFE    = path.resolve(DIR);

// Tabla de tipos MIME por extensión, para que el navegador
// interprete bien cada fichero (html, css, imágenes, fuentes...).
// MIME type table by extension, so the browser interprets
// each file correctly (html, css, images, fonts...).
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.xml':  'application/xml',
  '.txt':  'text/plain; charset=utf-8',
  '.woff2':'font/woff2',
};

// Manejador de cada petición: resuelve el fichero pedido y lo devuelve.
// Request handler: resolves the requested file and sends it back.
http.createServer((req, res) => {
  // "/" -> index.html; el resto, el fichero pedido tal cual.
  // Quitamos la query string (?w=...) para localizar el fichero.
  // "/" -> index.html; anything else maps to the requested file as is.
  // The query string (?w=...) is stripped to locate the file.
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const filePath = path.join(DIR, urlPath === '/' ? 'index.html' : urlPath);

  // Protección path traversal: resolver la ruta y verificar que sigue
  // dentro del directorio raíz del proyecto (evita /../../../etc/passwd).
  // Path traversal protection: resolve the path and check that it stays
  // inside the project root (blocks /../../../etc/passwd).
  const resolved = path.resolve(filePath);
  if (resolved !== SAFE && !resolved.startsWith(SAFE + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>403 — Acceso denegado</h1>');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Si no existe el fichero, devolvemos un 404 sencillo.
      // If the file does not exist, return a simple 404.
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 — Página no encontrada</h1>');
      return;
    }
    // Fichero encontrado: lo enviamos con su tipo MIME.
    // File found: send it with its MIME type.
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
// Arranca el servidor en el puerto indicado y avisa por consola.
// Starts the server on the given port and logs the URL to the console.
}).listen(PORT, () => console.log(`NÓVERA en marcha -> http://localhost:${PORT}`));
