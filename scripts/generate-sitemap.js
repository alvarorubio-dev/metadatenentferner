import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://metadatenentferner.ch';
const LANGUAGES = ['de', 'fr', 'it'];
const FORMATS = ['pdf', 'jpg', 'png', 'heic', 'docx', 'xlsx'];
const DEFAULT_LANG = 'de';

function pagePath(lang, format) {
  return format ? `${BASE_URL}/${lang}/${format}` : `${BASE_URL}/${lang}/`;
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function generateSitemap() {
  const pages = [];

  for (const lang of LANGUAGES) {
    pages.push({ lang, format: undefined, priority: '1.0' });
    for (const format of FORMATS) {
      pages.push({ lang, format, priority: '0.8' });
    }
  }

  const lastmod = today();

  const urls = pages.map(({ lang, format, priority }) => {
    const loc = pagePath(lang, format);

    const alternates = LANGUAGES.map(
      (altLang) =>
        `    <xhtml:link rel="alternate" hreflang="${altLang}-CH" href="${pagePath(altLang, format)}" />`
    ).join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${pagePath(DEFAULT_LANG, format)}" />`;

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
${alternates}
${xDefault}
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

  const publicDir = path.join(__dirname, '..', 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');

  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('Sitemap generado en:', sitemapPath);
  console.log(`Total URLs: ${pages.length} (${LANGUAGES.length} paginas por defecto + ${LANGUAGES.length * FORMATS.length} paginas de formato)`);
}

generateSitemap();
