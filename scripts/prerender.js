// Genera HTML estatico por ruta a partir del build de Vite ya generado en dist/.
// Usa un navegador headless para esperar a que React (Helmet, i18n, JSON-LD) termine
// de renderizar cada ruta y guarda el DOM resultante como archivo estatico.
// Esto permite que crawlers sin ejecucion de JS reciban el contenido final,
// mientras los usuarios reales siguen hidratando el mismo bundle normalmente.
import { chromium } from 'playwright';
import { preview } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const LANGUAGES = ['de', 'fr', 'it'];
const FORMATS = ['pdf', 'jpg', 'png', 'heic', 'docx', 'xlsx'];

function buildRoutes() {
  const routes = [];
  for (const lang of LANGUAGES) {
    routes.push({ urlPath: `/${lang}/`, outPath: path.join(distDir, lang, 'index.html') });
    for (const format of FORMATS) {
      routes.push({ urlPath: `/${lang}/${format}`, outPath: path.join(distDir, lang, format, 'index.html') });
    }
  }
  return routes;
}

async function prerenderRoute(context, baseUrl, route) {
  const page = await context.newPage();
  try {
    await page.goto(`${baseUrl}${route.urlPath}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => {
      const h1 = document.querySelector('h1');
      return Boolean(document.title) && Boolean(h1) && h1.textContent.trim().length > 0;
    }, { timeout: 15000 });

    const html = `<!doctype html>\n${await page.content()}`;
    await mkdir(path.dirname(route.outPath), { recursive: true });
    await writeFile(route.outPath, html, 'utf8');
    console.log(`  OK  ${route.urlPath} -> ${path.relative(distDir, route.outPath)}`);
  } finally {
    await page.close();
  }
}

async function main() {
  const routes = buildRoutes();
  console.log(`Prerenderizando ${routes.length} rutas estaticas...`);

  const previewServer = await preview({
    root: rootDir,
    preview: { port: 4173, strictPort: false },
    logLevel: 'silent',
  });
  const baseUrl = previewServer.resolvedUrls.local[0].replace(/\/$/, '');

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    for (const route of routes) {
      await prerenderRoute(context, baseUrl, route);
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => previewServer.httpServer.close(resolve));
  }

  console.log('Prerender completado.');
}

main().catch((err) => {
  console.error('[prerender] No se pudo prerenderizar; se mantiene el fallback CSR (SPA) para todas las rutas.');
  console.error(err?.stack || err);
  process.exitCode = 0;
});
