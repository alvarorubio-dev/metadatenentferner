import { useTranslation } from 'react-i18next';
import { isDocumentFormat } from '../utils/formatClassifier';

interface SEOContentProps {
  format?: string;
}

export function SEOContent({ format }: SEOContentProps) {
  const { t } = useTranslation();
  const isDocument = isDocumentFormat(format);

  const suffix = isDocument ? '_doc' : '';

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">{t(`seo.whyTitle${suffix}`)}</h2>
        <p className="text-gray-700 leading-relaxed text-lg">{t(`seo.whyText${suffix}`)}</p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-lg">
          <li>
            <strong>{t(`seo.gpsLocation${suffix}`)}</strong> {t(`seo.gpsLocationDesc${suffix}`)}
          </li>
          <li>
            <strong>{t(`seo.deviceFingerprint${suffix}`)}</strong> {t(`seo.deviceFingerprintDesc${suffix}`)}
          </li>
          <li>
            <strong>{t(`seo.timestamp${suffix}`)}</strong> {t(`seo.timestampDesc${suffix}`)}
          </li>
        </ul>

        <p className="text-gray-700 leading-relaxed text-lg pt-4">{t(`seo.importantFor${suffix}`)}</p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-lg">
          <li>
            <strong>{t(`seo.marketplaces${suffix}`)}</strong> {t(`seo.marketplacesDesc${suffix}`)}
          </li>
          <li>
            <strong>{t(`seo.dating${suffix}`)}</strong> {t(`seo.datingDesc${suffix}`)}
          </li>
          <li>
            <strong>{t(`seo.professional${suffix}`)}</strong> {t(`seo.professionalDesc${suffix}`)}
          </li>
        </ul>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">{t(`seo.comparisonTitle${suffix}`)}</h2>
        <p className="text-gray-700 leading-relaxed text-lg">{t(`seo.comparisonText${suffix}`)}</p>

        <div className="overflow-x-auto my-8 rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-200">
                <th className="p-4 font-bold text-gray-700 text-base">
                  {t('seo.tableHeaders.feature')}
                </th>
                <th className="p-4 font-bold text-green-700 bg-green-50 text-base">
                  {t('seo.tableHeaders.ourSolution')}
                </th>
                <th className="p-4 font-bold text-gray-700 text-base">
                  {t('seo.tableHeaders.otherTools')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-medium text-gray-700">
                  {t('seo.tableRows.storage.label')}
                </td>
                <td className="p-4 bg-green-50 font-bold text-green-700">
                  {t('seo.tableRows.storage.ours')}
                </td>
                <td className="p-4 text-gray-600">{t('seo.tableRows.storage.others')}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-gray-700">
                  {t('seo.tableRows.privacy.label')}
                </td>
                <td className="p-4 bg-green-50 font-bold text-green-700">
                  {t('seo.tableRows.privacy.ours')}
                </td>
                <td className="p-4 text-gray-600">{t('seo.tableRows.privacy.others')}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-gray-700">
                  {t('seo.tableRows.speed.label')}
                </td>
                <td className="p-4 bg-green-50 text-gray-800">
                  {t('seo.tableRows.speed.ours')}
                </td>
                <td className="p-4 text-gray-600">{t('seo.tableRows.speed.others')}</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium text-gray-700">
                  {isDocument ? t('seo.tableRows.quality.label_doc') : t('seo.tableRows.quality.label')}
                </td>
                <td className="p-4 bg-green-50 text-gray-800">
                  {t('seo.tableRows.quality.ours')}
                </td>
                <td className="p-4 text-gray-600">{t('seo.tableRows.quality.others')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">{t(`seo.howTitle${suffix}`)}</h2>
        <p className="text-gray-700 leading-relaxed text-lg">{t(`seo.howText${suffix}`)}</p>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-lg">
          <li>{t(`seo.howSteps.local${suffix}`)}</li>
          <li>{t(`seo.howSteps.secure${suffix}`)}</li>
          <li>{t(`seo.howSteps.fast${suffix}`)}</li>
        </ol>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">{t(`seo.faqTitle${suffix}`)}</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t(`seo.faq.nuclear${suffix}.q`)}</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{t(`seo.faq.nuclear${suffix}.a`)}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t(`seo.faq.malware${suffix}.q`)}</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{t(`seo.faq.malware${suffix}.a`)}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t(`seo.faq.quality${suffix}.q`)}</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{t(`seo.faq.quality${suffix}.a`)}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('seo.faq.fileSize.q')}</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{t('seo.faq.fileSize.a')}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('seo.faq.compliance.q')}</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{t('seo.faq.compliance.a')}</p>
          </div>

          {!isDocument && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('seo.faq.heic.q')}</h3>
              <p className="text-gray-700 leading-relaxed text-lg">{t('seo.faq.heic.a')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
