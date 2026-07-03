import { useTranslation } from 'react-i18next';

export function DatenschutzContent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {t('datenschutz.section1Title')}
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {t('datenschutz.section1Text')}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {t('datenschutz.section2Title')}
        </h3>
        <p className="text-gray-700 leading-relaxed mb-3">
          {t('datenschutz.section2Intro')}
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          {['bullet1', 'bullet2', 'bullet3', 'bullet4'].map((key, index) => {
            const bullet = t(`datenschutz.section2Bullets.${key}`);
            if (!bullet || bullet.trim() === '') return null;
            const parts = bullet.split('**');
            return (
              <li key={index}>
                {parts.length > 1 ? (
                  <>
                    {parts[0]}
                    <strong>{parts[1]}</strong>
                    {parts[2]}
                  </>
                ) : (
                  bullet
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {t('datenschutz.section3Title')}
        </h3>
        <p className="text-gray-700 leading-relaxed mb-3">
          {t('datenschutz.section3Intro')}
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          {['bullet1', 'bullet2', 'bullet3', 'bullet4', 'bullet5'].map((key, index) => (
            <li key={index}>{t(`datenschutz.section3Bullets.${key}`)}</li>
          ))}
        </ul>
        <p className="text-gray-700 leading-relaxed mt-3">
          {t('datenschutz.section3Footer')}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {t('datenschutz.section4Title')}
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {t('datenschutz.section4Text')}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{t('datenschutz.section5Title')}</h3>
        <p className="text-gray-700 leading-relaxed">
          {t('datenschutz.section5Text')}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-gray-700 leading-relaxed">
          <strong>{t('datenschutz.contactLabel')}</strong><br />
          <a href="mailto:info@sormenak.com" className="text-red-800 hover:text-red-900 underline">
            info@sormenak.com
          </a>
        </p>
      </div>
    </div>
  );
}
