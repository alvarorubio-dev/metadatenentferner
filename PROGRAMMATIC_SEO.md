# Programmatic SEO Implementation

This document explains the Programmatic SEO strategy implemented for the metadata remover application.

## Overview

The application now supports format-specific landing pages for better SEO targeting across three languages (German, French, Italian) and six file formats (PDF, JPG, PNG, HEIC, DOCX, XLSX).

## URL Structure

### Previous Structure
- `/:lang` (e.g., `/de`, `/fr`, `/it`)

### New Structure
- `/:lang/` - Default/generic page (e.g., `/de/`, `/fr/`, `/it/`)
- `/:lang/:format` - Format-specific page (e.g., `/de/pdf`, `/fr/jpg`, `/it/heic`)

## Supported Formats

- `pdf` - PDF documents
- `jpg` - JPEG images
- `png` - PNG images
- `heic` - HEIC/iPhone photos
- `docx` - Word documents
- `xlsx` - Excel spreadsheets

## Implementation Details

### 1. SEO Configuration (`src/config/seoData.ts`)

Contains all SEO data for each language and format combination:

```typescript
export const seoData = {
  de: {
    default: { title, h1, description },
    pdf: { title, h1, description },
    // ... other formats
  },
  fr: { /* ... */ },
  it: { /* ... */ }
};
```

**Helper function:**
```typescript
getSeoData(lang: string, format?: string)
```
Returns the appropriate SEO data, falling back to 'default' if format is invalid or missing.

### 2. Routing (`src/App.tsx`)

Updated to handle optional format parameter:

```tsx
<Routes>
  <Route path="/" element={<Navigate to="/de/" replace />} />
  <Route path="/:lang/" element={<AppContent />} />
  <Route path="/:lang/:format" element={<AppContent />} />
</Routes>
```

### 3. Dynamic Head Tags (`src/components/SeoManager.tsx`)

Dynamically updates:
- `<title>` tag
- Meta description
- Open Graph tags (og:title, og:description)
- Twitter Card tags
- Canonical URL
- Hreflang links

The canonical URL changes based on format:
- No format: `https://metadatenentferner.ch/de/`
- With format: `https://metadatenentferner.ch/de/pdf`

### 4. Dynamic H1 (`src/components/Hero.tsx`)

The main heading now dynamically changes based on the URL format:

```tsx
const seoContent = getSeoData(lang, format);
<h1>{seoContent.h1}</h1>
```

### 5. Universal File Upload

**IMPORTANT:** The file dropzone accepts ALL file types regardless of URL format. This is by design - the format in the URL is purely for SEO/marketing purposes.

Example: Even on `/de/pdf`, users can still upload JPG, PNG, HEIC, and any other supported file type.

### 6. Internal Linking (Footer)

The Footer component now includes dynamic internal links to all format-specific pages, preventing orphan pages and improving internal SEO structure.

**Features:**
- Language-specific section titles:
  - German: "Werkzeuge"
  - French: "Outils"
  - Italian: "Strumenti"
- 6 format links per language (PDF, JPG, PNG, HEIC, DOCX, XLSX)
- Uses React Router `<Link>` for instant SPA navigation
- Subtle styling with hover effects (gray text → red hover)
- Responsive layout with proper spacing

**SEO Benefits:**
- Prevents orphan pages (all pages linked from footer)
- Distributes link equity across all landing pages
- Provides clear internal navigation structure for crawlers
- Increases crawl depth and page discovery

## Sitemap Generation

### Script Location
`scripts/generate-sitemap.js`

### Generated URLs
- **21 total URLs:**
  - 3 default language pages (priority: 1.0)
  - 18 format-specific pages (priority: 0.8)

### Running the Script

```bash
# Generate sitemap manually
npm run generate:sitemap

# Sitemap is automatically generated during build
npm run build
```

### Sitemap Output
Located at: `public/sitemap.xml`

Contains:
- All language/format combinations
- Proper change frequency (weekly)
- Priority weighting (1.0 for default, 0.8 for formats)

## SEO Examples

### German PDF Page (`/de/pdf`)
- **Title:** "PDF Metadaten Entfernen - Online & Kostenlos"
- **H1:** "PDF Metadaten & Autoreninfos löschen"
- **Description:** "Bereinigen Sie Ihre PDF-Dokumente vor dem Versenden..."

### French JPG Page (`/fr/jpg`)
- **Title:** "Supprimer EXIF JPG - Anonymiser vos photos"
- **H1:** "Supprimer les données EXIF (GPS) des JPG"
- **Description:** "Protégez votre vie privée. Effacez la localisation GPS..."

### Italian HEIC Page (`/it/heic`)
- **Title:** "Rimuovere Metadati HEIC (iPhone)"
- **H1:** "Pulire foto iPhone (HEIC)"
- **Description:** "Elimina i dati di geolocalizzazione e EXIF..."

## Search Engine Optimization Benefits

1. **Keyword Targeting:** Each page targets specific file format + metadata removal keywords
2. **Language Coverage:** Full coverage of Swiss market (German, French, Italian)
3. **Long-tail Keywords:** Captures format-specific searches (e.g., "PDF metadata remove")
4. **User Intent:** Matches user search intent more precisely
5. **Reduced Bounce Rate:** Users land on exactly what they're searching for
6. **Internal Linking:** Footer links prevent orphan pages and improve crawl depth
7. **Link Equity Distribution:** All pages receive internal link value from every other page

## Maintenance

### Adding New Formats
1. Add format data to `src/config/seoData.ts` for all languages
2. Sitemap will automatically include new format on next build
3. No routing changes needed

### Adding New Languages
1. Add language data to `seoData` object
2. Update language arrays in routing and sitemap script
3. Add hreflang configuration

## Technical Notes

- All SEO data is type-safe (TypeScript)
- Fallback to 'default' if invalid format provided
- Client-side rendering with dynamic head tag management
- No server-side rendering required
- Sitemap regenerates automatically on build

## Testing URLs

### German
- https://metadatenentferner.ch/de/ (default)
- https://metadatenentferner.ch/de/pdf
- https://metadatenentferner.ch/de/jpg
- https://metadatenentferner.ch/de/png
- https://metadatenentferner.ch/de/heic
- https://metadatenentferner.ch/de/docx
- https://metadatenentferner.ch/de/xlsx

### French
- https://metadatenentferner.ch/fr/ (default)
- https://metadatenentferner.ch/fr/pdf
- [etc...]

### Italian
- https://metadatenentferner.ch/it/ (default)
- https://metadatenentferner.ch/it/pdf
- [etc...]

## Performance Impact

- Minimal: SEO data lookup is O(1)
- No additional API calls
- No external dependencies required
- Bundle size increase: ~5KB (seoData.ts)
