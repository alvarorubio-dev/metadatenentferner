import { Shield } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export function Header() {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'de';

  const getHomeAriaLabel = () => {
    switch (currentLang) {
      case 'fr':
        return "Retour à l'accueil";
      case 'it':
        return 'Torna alla home';
      default:
        return 'Zurück zur Startseite';
    }
  };

  const getLanguageAriaLabel = (targetLang: string) => {
    const labels = {
      de: {
        de: 'Auf Deutsch wechseln',
        fr: 'Passer au français',
        it: 'Cambia in italiano'
      },
      fr: {
        de: 'Switch to German',
        fr: 'Switch to French',
        it: 'Switch to Italian'
      },
      it: {
        de: 'Switch to German',
        fr: 'Switch to French',
        it: 'Switch to Italian'
      }
    };
    return labels[currentLang as keyof typeof labels]?.[targetLang as keyof typeof labels.de] || `Switch to ${targetLang.toUpperCase()}`;
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link
            to={`/${currentLang}/`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label={getHomeAriaLabel()}
          >
            <Shield className="w-8 h-8 text-red-800" strokeWidth={2} />
            <h1 className="text-2xl font-bold text-gray-900">MetadatenEntferner</h1>
          </Link>

          <nav className="flex items-center space-x-2 text-sm font-medium" aria-label="Language selector">
            <Link
              to="/de/"
              hrefLang="de-CH"
              aria-label={getLanguageAriaLabel('de')}
              className={`px-2 py-1 transition-colors ${
                currentLang === 'de'
                  ? 'font-bold text-red-800'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              DE
            </Link>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <Link
              to="/fr/"
              hrefLang="fr-CH"
              aria-label={getLanguageAriaLabel('fr')}
              className={`px-2 py-1 transition-colors ${
                currentLang === 'fr'
                  ? 'font-bold text-red-800'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              FR
            </Link>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <Link
              to="/it/"
              hrefLang="it-CH"
              aria-label={getLanguageAriaLabel('it')}
              className={`px-2 py-1 transition-colors ${
                currentLang === 'it'
                  ? 'font-bold text-red-800'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              IT
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
