import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { getSeoData } from '../config/seoData';
import { isDocumentFormat } from '../utils/formatClassifier';

interface HeroProps {
  format?: string;
}

export function Hero({ format }: HeroProps) {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();

  const seoContent = getSeoData(lang || i18n.language, format);
  const isDocument = isDocumentFormat(format);
  const subtitleKey = isDocument ? 'hero.subtitle_doc' : 'hero.subtitle';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        {seoContent.h1}
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
        {t(subtitleKey)}
      </p>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <span className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200">
          {t('badges.clientSide')}
        </span>
        <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
          {t('badges.noUpload')}
        </span>
        <span className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-full border border-red-200">
          {t('badges.swissPrivacy')}
        </span>
      </div>
    </section>
  );
}
