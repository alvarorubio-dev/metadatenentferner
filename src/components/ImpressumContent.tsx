import { useTranslation } from 'react-i18next';

export function ImpressumContent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{t('impressum.contactTitle')}</h3>
        <p className="text-gray-700 leading-relaxed">
          Sormenak<br />
          Chemin des Mines 2<br />
          1202 Genève<br />
          Schweiz (Switzerland)
        </p>
      </div>

      <div>
        <p className="text-gray-700 leading-relaxed">
          <strong>{t('impressum.email')}:</strong>{' '}
          <a href="mailto:info@sormenak.com" className="text-red-800 hover:text-red-900 underline">
            info@sormenak.com
          </a>
          <br />
          <strong>{t('impressum.website')}:</strong>{' '}
          <a
            href="https://sormenak.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-800 hover:text-red-900 underline"
          >
            sormenak.com
          </a>
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{t('impressum.representativeTitle')}</h3>
        <p className="text-gray-700 leading-relaxed">
          {t('impressum.representativeText')}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{t('impressum.disclaimerTitle')}</h3>
        <p className="text-gray-700 leading-relaxed">
          {t('impressum.disclaimerText')}
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          {t('impressum.disclaimerText2')}
        </p>
      </div>
    </div>
  );
}
