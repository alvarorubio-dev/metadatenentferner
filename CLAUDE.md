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
- Para que los crawlers vean contenido real (Google, etc.), `npm run build` ejecuta `scripts/prerender.js` tras `vite build`: levanta el bundle con `vite preview`, visita las 21 rutas conocidas con Chromium headless (Playwright) y guarda el DOM ya hidratado como HTML estático por ruta. Esto es *prerendering*, no SSR — no confundirlo ni intentar "mejorarlo" con un framework SSR sin acordarlo antes.
- Evita dependencias nuevas si algo se resuelve con lo que ya está instalado.
- Código listo para producción: sin `console.log` residual (aparte de los intencionales en la limpieza de Service Worker de `src/main.tsx`), sin TODOs sin ticket, sin tipos `any`.
- Explica siempre qué cambia si modificas código existente; no reescribas sin avisar.

## Estructura de carpetas

- `src/components/` — todos los componentes, sin separación `ui/` vs feature-specific (estructura plana)
- `src/config/seoData.ts` — title/h1/description por combinación idioma+formato, consumido por `SeoManager.tsx`
- `src/contexts/LanguageContext.tsx`
- `src/locales/{de,fr,it}.json` — recursos reales de i18next (fuente de verdad de las traducciones de UI)
- `src/translations/index.ts` — define tipos de traducción pero **no tiene ningún import activo en el resto del código** (parece legacy/código muerto); confirmar antes de asumir que se usa o de borrarlo
- `src/types/` — tipos compartidos
- `src/utils/` — helpers de procesamiento de archivos (EXIF, imágenes, PDF)
- `scripts/generate-sitemap.js` y `scripts/prerender.js` — se ejecutan como parte de `npm run build`, no son scripts sueltos de mantenimiento manual

## SEO técnico (obligatorio al añadir una ruta o combinación idioma/formato nueva)

- Añadir la entrada en `src/config/seoData.ts` (title ≤60 caracteres, description entre 140-160 caracteres, h1).
- No crear un mecanismo de metadata paralelo: `SeoManager.tsx` ya inyecta title, description, canonical, hreflang (`de-CH`/`fr-CH`/`it-CH`/`x-default`), Open Graph, Twitter Card y JSON-LD (`WebApplication`) a partir de `seoData.ts`.
- El canonical y el hreflang de cada ruta deben ser siempre **autorreferenciales** — nunca hacer que una página con contenido único (title/h1/description propios) canonicalice hacia otra ruta; eso le indica a Google que ignore esa página.
- Añadir la combinación a `LANGUAGES`/`FORMATS` en `scripts/generate-sitemap.js` (sitemap) y a la lista de rutas en `scripts/prerender.js` (HTML estático para crawlers).
- Enlazar la página nueva desde `Footer.tsx` para no dejar páginas huérfanas.
- Antes de dar por cerrado el cambio, correr `npm run build` y revisar `dist/<lang>/<formato>/index.html` para confirmar que el title, el h1 y el JSON-LD son los esperados.

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
- `vite.config.ts` ya define `manualChunks` por librería (react, i18n, icons, router, exif, heic2any).
- `npm run build` tarda más de lo habitual por el paso de prerender (Playwright visita 21 rutas); es esperado, no un error.

## Comandos habituales

- `npm run dev` — desarrollo local
- `npm run build` — genera el sitemap, corre `vite build` y luego prerenderiza las 21 rutas (tarda ~1-2 min adicionales)
- `npm run preview` — sirve `dist/` localmente
- `npm run typecheck` / `npm run lint` — antes de cualquier commit
- No existe `npm run test` ni `npx playwright test` en este proyecto todavía

## Git

- Este directorio **no tiene un repositorio git inicializado** (no hay `.git`). Antes de correr cualquier comando `git`, confirma con el usuario si quiere inicializar el repo.
- Cuando exista un repo: commits descriptivos en español, un commit por sección/feature completada, nunca force-push a `main`, PRs pequeños explicando el "por qué".

## Cuando algo es ambiguo

- Si falta contexto de negocio o de diseño, pregunta antes de asumir.
- Este proyecto es una SPA de Vite deliberada (la privacidad depende de que el procesamiento sea 100% client-side). No propongas migrar a Next.js, SSR real, o subir archivos a un backend como solución "por defecto" — son cambios de arquitectura que requieren acuerdo explícito primero.
