import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getSeoData } from '../config/seoData';

interface SeoManagerProps {
  lang: string;
  format?: string;
}

const BASE_URL = 'https://metadatenentferner.ch';

const IMAGE_FORMATS = ['jpg', 'png', 'heic', 'webp'];
const DOCUMENT_FORMATS = ['docx', 'xlsx'];

export function SeoManager({ lang, format }: SeoManagerProps) {
  const seoContent = getSeoData(lang, format);
  const validFormat = format && [...IMAGE_FORMATS, ...DOCUMENT_FORMATS, 'pdf'].includes(format) ? format : undefined;

  // Cada ruta tiene título/H1/descripción propios (seoData.ts) y está listada en el
  // sitemap, por lo que el canonical debe ser autorreferencial: canonicalizar hacia
  // otra ruta le indica a Google que ignore el contenido único de esta página.
  const pathSuffix = validFormat ? `/${validFormat}` : '/';

  const canonicalUrl = `${BASE_URL}/${lang}${pathSuffix}`;
  
  const ogImage = `${BASE_URL}/og-image.jpg`;
  const htmlLang = lang === 'de' ? 'de-CH' : lang === 'fr' ? 'fr-CH' : 'it-CH';

  useEffect(() => {
    document.documentElement.lang = htmlLang;
  }, [htmlLang]);

  // NUEVO: Diccionario para los nombres traducidos de la aplicación en el Schema
  const appNames = {
    de: 'MetadatenEntferner Schweiz',
    fr: 'Suppression Métadonnées Suisse',
    it: 'Rimozione Metadati Svizzera',
  };

  const appName = appNames[lang as keyof typeof appNames] || appNames.de;

  // Breadcrumb solo tiene sentido con 2+ niveles (Google exige minimo 2 ListItem).
  // La pagina default (sin formato) ES el nivel raiz, no lleva breadcrumb propio.
  const homeLabels = {
    de: 'Start',
    fr: 'Accueil',
    it: 'Home',
  };
  const homeLabel = homeLabels[lang as keyof typeof homeLabels] || homeLabels.de;

  const breadcrumbData = validFormat
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": homeLabel,
            "item": `${BASE_URL}/${lang}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": seoContent.h1,
            "item": canonicalUrl
          }
        ]
      }
    : null;

  // FIX: Unificamos los datos estructurados (Schema) en un solo bloque
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": appName, // Usando el nombre traducido
    "alternateName": format ? `${format.toUpperCase()} Metadaten Entferner` : undefined,
    "url": canonicalUrl,
    "description": seoContent.description,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CHF"
    },
    "featureList": [
      "100% Client-Side Processing",
      "No Data Upload",
      "EXIF & Metadata Removal",
      "Privacy Protection",
      "Swiss Data Protection Compliant"
    ],
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "screenshot": ogImage,
    "inLanguage": [htmlLang],
    "availableOnDevice": ["Desktop", "Mobile"],
    "softwareVersion": "1.0",
    "author": {
      "@type": "Organization",
      "name": "Sormenak"
    },
    "potentialAction": {
      "@type": "UseAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": BASE_URL,
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      }
    }
  };

  return (
    <Helmet>
      <title>{seoContent.title}</title>
      <meta name="description" content={seoContent.description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={seoContent.title} />
      <meta property="og:description" content={seoContent.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={htmlLang} />
      <meta property="og:site_name" content="Metadaten Entferner" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={seoContent.title} />
      <meta name="twitter:description" content={seoContent.description} />
      <meta name="twitter:image" content={ogImage} />

      {/* hreflang ahora coincide perfectamente con el sitemap (con barra final) */}
      <link rel="alternate" hrefLang="de-CH" href={`${BASE_URL}/de${pathSuffix}`} />
      <link rel="alternate" hrefLang="fr-CH" href={`${BASE_URL}/fr${pathSuffix}`} />
      <link rel="alternate" hrefLang="it-CH" href={`${BASE_URL}/it${pathSuffix}`} />
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/de${pathSuffix}`} />

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {breadcrumbData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      )}
    </Helmet>
  );
}