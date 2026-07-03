import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { Modal } from './Modal';
import { ImpressumContent } from './ImpressumContent';
import { DatenschutzContent } from './DatenschutzContent';

const formatLinks = {
  de: {
    title: 'Werkzeuge',
    formats: [
      { path: 'pdf', label: 'PDF Metadaten entfernen' },
      { path: 'jpg', label: 'JPG EXIF löschen' },
      { path: 'png', label: 'PNG bereinigen' },
      { path: 'heic', label: 'HEIC säubern' },
      { path: 'docx', label: 'Word Metadaten' },
      { path: 'xlsx', label: 'Excel bereinigen' }
    ]
  },
  fr: {
    title: 'Outils',
    formats: [
      { path: 'pdf', label: 'Supprimer métadonnées PDF' },
      { path: 'jpg', label: 'Effacer EXIF JPG' },
      { path: 'png', label: 'Nettoyer PNG' },
      { path: 'heic', label: 'Nettoyer HEIC' },
      { path: 'docx', label: 'Métadonnées Word' },
      { path: 'xlsx', label: 'Nettoyer Excel' }
    ]
  },
  it: {
    title: 'Strumenti',
    formats: [
      { path: 'pdf', label: 'Rimuovere metadati PDF' },
      { path: 'jpg', label: 'Eliminare EXIF JPG' },
      { path: 'png', label: 'Pulire PNG' },
      { path: 'heic', label: 'Pulire HEIC' },
      { path: 'docx', label: 'Metadati Word' },
      { path: 'xlsx', label: 'Pulire Excel' }
    ]
  }
};

export function Footer() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const [isImpressumOpen, setIsImpressumOpen] = useState(false);
  const [isDatenschutzOpen, setIsDatenschutzOpen] = useState(false);

  const currentLang = (lang || i18n.language || 'de') as keyof typeof formatLinks;
  const links = formatLinks[currentLang] || formatLinks.de;

  return (
    <>
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center max-w-4xl">
              <h3 className="text-gray-600 text-sm font-semibold mb-3">
                {links.title}
              </h3>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
                {links.formats.map((format, index) => (
                  <span key={format.path}>
                    <Link
                      to={`/${currentLang}/${format.path}`}
                      className="text-gray-600 hover:text-red-800 transition-colors"
                    >
                      {format.label}
                    </Link>
                    {index < links.formats.length - 1 && (
                      <span className="text-gray-400 ml-4">•</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm mb-2">
                {t('footer.promise')}
              </p>
              <p className="text-gray-700 text-sm font-medium">
                © 2026{' '}
                <a
                  href="https://sormenak.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-900 underline hover:no-underline transition-colors"
                  aria-label="Sormenak - Besuchen Sie unsere Website"
                >
                  Sormenak
                </a>
                {' '}| {t('footer.rights')}
              </p>
            </div>

            <div className="flex gap-6">
              <button
                onClick={() => setIsImpressumOpen(true)}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors cursor-pointer"
              >
                {t('footer.impressum')}
              </button>
              <button
                onClick={() => setIsDatenschutzOpen(true)}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors cursor-pointer"
              >
                {t('footer.datenschutz')}
              </button>
            </div>
          </div>
        </div>
      </footer>

      <Modal
        isOpen={isImpressumOpen}
        onClose={() => setIsImpressumOpen(false)}
        title={t('footer.impressum')}
      >
        <ImpressumContent />
      </Modal>

      <Modal
        isOpen={isDatenschutzOpen}
        onClose={() => setIsDatenschutzOpen(false)}
        title={t('footer.datenschutz')}
      >
        <DatenschutzContent />
      </Modal>
    </>
  );
}
