// Genera HTML estatico por ruta a partir del build de Vite ya generado en dist/,
// y lo guarda en public/ para que quede versionado en el repo.
//
// IMPORTANTE: este script requiere Playwright + Chromium, que Vercel no soporta
// en su entorno de build. Por eso NO forma parte de `npm run build` (el que corre
// Vercel) y se ejecuta a mano en la maquina del desarrollador con
// `npm run prerender:local` cada vez que cambia contenido SEO relevante
// (seoData.ts, traducciones, Hero/SEOContent/Footer). Los archivos generados en
// public/<lang>/[<formato>/]index.html quedan commiteados, y cualquier build
// posterior (incluido el de Vercel) los copia tal cual dentro de dist/.
//
// Esto solo funciona porque vite.config.ts fija nombres de archivo SIN hash de
// contenido (`assets/[name].js`) — si los nombres tuvieran hash, cambiarian en
// cada build de Vercel y las referencias <script>/<link> de estos snapshots
// quedarian rotas.
import { chromium } from 'playwright';
import { preview } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const LANGUAGES = ['de', 'fr', 'it'];
const FORMATS = ['pdf', 'jpg', 'png', 'heic', 'docx', 'xlsx'];

function buildRoutes() {
  const routes = [];
  for (const lang of LANGUAGES) {
    routes.push({ urlPath: `/${lang}/`, outPath: path.join(publicDir, lang, 'index.html') });
    for (const format of FORMATS) {
      routes.push({ urlPath: `/${lang}/${format}`, outPath: path.join(publicDir, lang, format, 'index.html') });
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
    console.log(`  OK  ${route.urlPath} -> public/${path.relative(publicDir, route.outPath)}`);
  } finally {
    await page.close();
  }
}

async function main() {
  const routes = buildRoutes();
  console.log(`Prerenderizando ${routes.length} rutas estaticas en public/...`);

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

  console.log('Prerender completado. Revisa el diff en public/ y commitea los cambios.');
}

main().catch((err) => {
  console.error('[prerender] Fallo la generacion de snapshots estaticos.');
  console.error(err?.stack || err);
  process.exitCode = 1;
});
