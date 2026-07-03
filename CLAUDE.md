# CLAUDE.md

## Stack del proyecto

- Vite 5 + React 18 (SPA client-side, sin SSR real)
- React Router v7 (`react-router-dom`) para routing — rutas `/:lang/` y `/:lang/:format`
- TypeScript estricto (`strict: true`, `noUnusedLocals`, `noUnusedParameters`, sin `any`)
- Tailwind CSS 3 (utility-first, sin CSS-in-JS)
- react-i18next + i18next-browser-languagedetector para i18n (idiomas: `de`, `fr`, `it` — no hay `en`)
- react-helmet-async para gestionar `<head>` por ruta (title, meta, OG, canonical, hreflang, JSON-LD)
- Node 22, npm 10, Windows
- Deploy: Vercel como sitio estático (`vercel.json` gestiona redirects, rewrite SPA fallback y headers)
- `@supabase/supabase-js` está en `package.json` pero **no se usa en ningún componente actualmente** — es una dependencia sin cablear, no asumir que hay backend/DB salvo que se conecte de verdad
- **No es Next.js.** No hay App Router, Server Components ni Server Actions. Si se necesita ese modelo, es una migración de framework a proponer y acordar explícitamente, no algo que ya exista aquí

## Principios generales

- Toda la app es client-rendered por diseño: el procesamiento de archivos (EXIF, PDF, DOCX, XLSX, HEIC) ocurre 100% en el navegador del usuario y nunca se sube a un servidor — esa es la propuesta de valor de privacidad del producto. No introducir un flujo que suba archivos a un backend sin que se pida explícitamente.
- Para que los crawlers vean contenido real (Google, etc.), existe `scripts/prerender.js`: levanta el bundle con `vite preview`, visita las 21 rutas conocidas con Chromium headless (Playwright) y guarda el DOM ya hidratado como HTML estático directamente en `public/<lang>/[<formato>/]index.html`. **Esto NO corre en el build de Vercel** (Vercel no soporta Chromium/Playwright en su sandbox de build; se probó y rompía el deploy) — se ejecuta a mano con `npm run prerender:local` y los archivos generados se commitean. Ver la sección "Prerender estático" más abajo antes de tocar este flujo.
- Evita dependencias nuevas si algo se resuelve con lo que ya está instalado.
- Código listo para producción: sin `console.log` residual (aparte de los intencionales en la limpieza de Service Worker de `src/main.tsx`), sin TODOs sin ticket, sin tipos `any`.
- Explica siempre qué cambia si modificas código existente; no reescribas sin avisar.

## Prerender estático (leer antes de tocar vite.config.ts, prerender.js o los headers de cache)

- `vite.config.ts` fija los nombres de archivo de salida **sin hash de contenido** (`assets/[name].js`, entryFileNames/chunkFileNames/assetFileNames) a propósito. Verificado empíricamente que Rollup sigue evitando colisiones de nombre (p. ej. dos chunks "index" se resuelven como `index.js`/`index2.js`) de forma determinista entre builds independientes (confirmado con `diff -rq` sobre dos builds separados: bytes idénticos).
- Esto es lo que permite que un snapshot de `public/<lang>/<formato>/index.html`, generado una vez en tu máquina, siga funcionando después de que Vercel corra su propio `vite build` independiente — porque los nombres de archivo no cambian entre builds mientras el código fuente no cambie.
- **Flujo real:**
  1. `npm run build` (lo que corre Vercel) = `generate:sitemap && vite build`. No usa Playwright. Solo copia `public/*` (incluidos los snapshots ya commiteados) dentro de `dist/`.
  2. `npm run prerender:local` (manual, en tu máquina) = build completo + Playwright, y escribe los 21 HTML directamente en `public/<lang>/[<formato>/]index.html`.
  3. Después de correrlo, revisar `git diff public/` y commitear los cambios.
- **Hay que volver a correr `npm run prerender:local` y commitear** cada vez que cambie algo que afecte el HTML servido a crawlers: `seoData.ts`, `src/locales/*.json`, o el JSX de `Hero.tsx`/`SEOContent.tsx`/`Footer.tsx`/`Header.tsx`. Si te olvidás, el snapshot queda desactualizado (la app interactiva real sigue funcionando bien, solo el HTML que ve el crawler queda viejo).
- Por lo mismo, los headers de cache de `/assets/*`, `*.js` y `*.css` en `vercel.json` y `public/_headers` están en `public, max-age=0, must-revalidate` (no `immutable`) — si los nombres de archivo no cambian entre deploys, cachear "para siempre" impediría que los usuarios reciban el JS actualizado después de un deploy. No revertir esto a `immutable` sin volver a introducir hashes de contenido en los nombres de archivo.

## Estructura de carpetas

- `src/components/` — todos los componentes, sin separación `ui/` vs feature-specific (estructura plana)
- `src/config/seoData.ts` — title/h1/description por combinación idioma+formato, consumido por `SeoManager.tsx`
- `src/contexts/LanguageContext.tsx`
- `src/locales/{de,fr,it}.json` — recursos reales de i18next (fuente de verdad de las traducciones de UI)
- `src/translations/index.ts` — define tipos de traducción pero **no tiene ningún import activo en el resto del código** (parece legacy/código muerto); confirmar antes de asumir que se usa o de borrarlo
- `src/types/` — tipos compartidos
- `src/utils/` — helpers de procesamiento de archivos (EXIF, imágenes, PDF)
- `scripts/generate-sitemap.js` — corre dentro de `npm run build` (Node puro, sin browser, funciona en Vercel)
- `scripts/prerender.js` — **no** corre en `npm run build`; requiere Playwright/Chromium y se ejecuta a mano vía `npm run prerender:local` (ver sección "Prerender estático")

## SEO técnico (obligatorio al añadir una ruta o combinación idioma/formato nueva)

- Añadir la entrada en `src/config/seoData.ts` (title ≤60 caracteres, description entre 140-160 caracteres, h1).
- No crear un mecanismo de metadata paralelo: `SeoManager.tsx` ya inyecta title, description, canonical, hreflang (`de-CH`/`fr-CH`/`it-CH`/`x-default`), Open Graph, Twitter Card y JSON-LD (`WebApplication`) a partir de `seoData.ts`.
- El canonical y el hreflang de cada ruta deben ser siempre **autorreferenciales** — nunca hacer que una página con contenido único (title/h1/description propios) canonicalice hacia otra ruta; eso le indica a Google que ignore esa página.
- Añadir la combinación a `LANGUAGES`/`FORMATS` en `scripts/generate-sitemap.js` (sitemap) y en `scripts/prerender.js` (HTML estático para crawlers).
- Enlazar la página nueva desde `Footer.tsx` para no dejar páginas huérfanas.
- Antes de dar por cerrado el cambio, correr `npm run prerender:local` (no solo `npm run build`) y revisar `public/<lang>/<formato>/index.html` para confirmar que el title, el h1 y el JSON-LD son los esperados — y commitear ese HTML actualizado.

## Accesibilidad

- HTML semántico primero (`<nav>`, `<main>`, `<button>` real, no `<div onClick>`).
- Todo elemento interactivo navegable por teclado y con foco visible.
- Contraste AA mínimo en textos sobre fondos de marca.
- Nota conocida: `Header.tsx` usa un `<h1>` para el logo y `Hero.tsx` usa otro `<h1>` para el contenido de la página — hay dos `<h1>` por página. Si tocas cualquiera de los dos componentes, evalúa corregirlo (idealmente el logo debería ir en un elemento no-heading).

## Seguridad

- El procesamiento de archivos (`exifr`, `exifreader`, `pdf-lib`, `heic2any`, `jszip`) debe permanecer client-side siempre — es el núcleo de la propuesta de privacidad, no un detalle de implementación.
- Si en algún momento se conecta Supabase de verdad: nunca loguear ni exponer `SUPABASE_SERVICE_ROLE_KEY` en cliente, y activar Row Level Security en cualquier tabla expuesta.
- Los headers de seguridad ya están fijados en `vercel.json` y `public/_headers` (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, etc.) — mantenerlos si tocas esos archivos.

## Estilo de código

- Componentes en PascalCase, hooks en camelCase con prefijo `use`.
- Props tipadas con `interface`, no `type` suelto salvo unions/utility types.
- Iconos con `lucide-react`, no SVGs inline sueltos.
- Tailwind con clases utilitarias directas. **No hay CVA, Radix UI ni shadcn/ui en este proyecto** — los componentes de UI (p. ej. `Modal.tsx`) son propios y sin librería. Si se necesita un primitivo complejo, evalúa primero si se resuelve con lo ya usado antes de introducir una dependencia nueva.
- Prettier no está configurado actualmente (no hay `.prettierrc`); ESLint (`eslint.config.js`) sí.

## Testing

- **No hay ningún framework de test configurado actualmente** (sin Vitest, sin Playwright test runner), pese a que `playwright` está en `devDependencies` — su único uso hoy es `scripts/prerender.js` para generar HTML estático, no para tests.
- Si se decide añadir tests, coméntalo primero: no asumas que Vitest o Playwright test ya están disponibles para usarlos directamente.

## Manejo de errores

- `ErrorBoundary.tsx` envuelve toda la app en `src/main.tsx` (no hay `app/error.tsx` porque no es Next.js).
- No hay página 404 dedicada; cualquier `:lang` no soportado redirige a `/de/` en `App.tsx`.
- Nunca mostrar stack traces al usuario en producción (el `ErrorBoundary` ya oculta el detalle técnico tras un `<details>`).

## Estados de carga

- `Suspense` + `lazy()` ya se usan en `App.tsx` para `PdfToolClient` y `SEOContent`.
- `heic2any` se importa con `import()` dinámico dentro de `imageProcessor.ts`, fuera del bundle principal.

## Performance

- `heic2any` pesa ~1.3MB minificado; queda fuera del bundle inicial por el dynamic import, pero sigue siendo el chunk más pesado del proyecto — si tocas ese flujo, evalúa alternativas más livianas.
- `vite.config.ts` ya define `manualChunks` por librería (react, i18n, icons, router, exif, heic2any) y nombres de salida sin hash (ver sección "Prerender estático" — no es un descuido, es deliberado).

## Comandos habituales

- `npm run dev` — desarrollo local
- `npm run build` — lo que corre Vercel: genera el sitemap y hace `vite build`. No prerenderiza (sin Playwright).
- `npm run prerender:local` — build completo + prerender con Playwright; escribe en `public/` y hay que commitear el resultado a mano (ver sección "Prerender estático")
- `npm run preview` — sirve `dist/` localmente
- `npm run typecheck` / `npm run lint` — antes de cualquier commit
- No existe `npm run test` ni `npx playwright test` en este proyecto todavía (aunque `playwright` esté instalado, es solo para `prerender.js`)

## Git

- Repo: `https://github.com/alvarorubio-dev/metadatenentferner.git`, rama `main`.
- Commits descriptivos en español, un commit por sección/feature completada, nunca force-push a `main`, PRs pequeños explicando el "por qué".
- El deploy real corre en Vercel a partir de esta rama — no asumas que Vercel puede ejecutar pasos con Playwright/Chromium en su build (ver "Prerender estático").

## Cuando algo es ambiguo

- Si falta contexto de negocio o de diseño, pregunta antes de asumir.
- Este proyecto es una SPA de Vite deliberada (la privacidad depende de que el procesamiento sea 100% client-side). No propongas migrar a Next.js, SSR real, o subir archivos a un backend como solución "por defecto" — son cambios de arquitectura que requieren acuerdo explícito primero.
