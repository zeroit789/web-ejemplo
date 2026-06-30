/* ===========================================================
   NÓVERA — Servidor estático de previsualización local
   -----------------------------------------------------------
   Sirve la web en http://localhost:8080 sin dependencias.
   Es solo para verla en local: en producción la sirve un
   servidor web normal (Nginx, Caddy, Apache, hosting estático...).
   Uso:  node server.js
   =========================================================== */

const http = require('http');   // servidor HTTP nativo de Node
const fs   = require('fs');     // lectura de ficheros
const path = require('path');   // manejo de rutas

const PORT    = 8080;              // puerto local
const DIR     = __dirname;         // carpeta raíz = la del proyecto
const SAFE    = path.resolve(DIR); // ruta absoluta canónica (para path traversal check)

// Tabla de tipos MIME por extensión, para que el navegador
// interprete bien cada fichero (html, css, imágenes, fuentes...).
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

http.createServer((req, res) => {
  // "/" -> index.html; el resto, el fichero pedido tal cual.
  // Quitamos la query string (?w=...) para localizar el fichero.
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const filePath = path.join(DIR, urlPath === '/' ? 'index.html' : urlPath);

  // Protección path traversal: resolver la ruta y verificar que sigue
  // dentro del directorio raíz del proyecto (evita /../../../etc/passwd).
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
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 — Página no encontrada</h1>');
      return;
    }
    // Fichero encontrado: lo enviamos con su tipo MIME.
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`NÓVERA en marcha -> http://localhost:${PORT}`));
