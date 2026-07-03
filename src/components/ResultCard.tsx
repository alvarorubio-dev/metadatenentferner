import { Download, Trash2, CheckCircle } from 'lucide-react';
import { formatFileSize, downloadFile } from '../utils/imageProcessor';
import { useTranslation } from 'react-i18next';

interface ResultCardProps {
  originalFile: File;
  cleanedBlob: Blob;
  originalSize: number;
  cleanedSize: number;
  metadataCount: number;
  onReset: () => void;
}

export function ResultCard({
  originalFile,
  cleanedBlob,
  originalSize,
  cleanedSize,
  metadataCount,
  onReset,
}: ResultCardProps) {
  const { t, i18n } = useTranslation();

  const handleDownload = () => {
    const cleanedFilename = originalFile.name.replace(
      /(\.[^.]+)$/,
      '_cleaned$1'
    );
    downloadFile(cleanedBlob, cleanedFilename);
  };

  const savedBytes = originalSize - cleanedSize;
  const savedPercentage = ((savedBytes / originalSize) * 100).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white border-2 border-green-500 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" aria-hidden="true" />
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full mb-2">
              <CheckCircle className="w-4 h-4" aria-hidden="true" />
              {t('result.success')}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t('result.successMessage')}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('result.originalSize')}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatFileSize(originalSize)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('result.cleanedSize')}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatFileSize(cleanedSize)}
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('result.metadataRemoved')}</p>
            <p className="text-xl sm:text-2xl font-bold text-red-800">{metadataCount}</p>
          </div>
        </div>

        {savedBytes > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-center">
              <span className="font-bold">{formatFileSize(savedBytes)}</span>{' '}
              {i18n.language === 'de' ? 'gespart' : 'économisé'} ({savedPercentage}%{' '}
              {i18n.language === 'de' ? 'kleiner' : 'plus petit'})
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-red-600 text-white font-bold text-sm sm:text-base rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors touch-manipulation"
          >
            <Download className="w-5 h-5" aria-hidden="true" />
            {t('result.download')}
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gray-200 text-gray-900 font-bold text-sm sm:text-base rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors touch-manipulation"
          >
            <Trash2 className="w-5 h-5" aria-hidden="true" />
            {t('result.processAnother')}
          </button>
        </div>
      </div>
    </div>
  );
}
