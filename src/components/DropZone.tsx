import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { isDocumentFormat } from '../utils/formatClassifier';

interface DropZoneProps {
  onFileDrop: (file: File) => void;
  isProcessing: boolean;
}

export function DropZone({ onFileDrop, isProcessing }: DropZoneProps) {
  const { t } = useTranslation();
  const { format } = useParams<{ format?: string }>();

  const isDocument = isDocumentFormat(format);
  const suffix = isDocument ? '_doc' : '';

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileDrop(acceptedFiles[0]);
      }
    },
    [onFileDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" translate="no">
      <div
        {...getRootProps()}
        className={`
          relative border-4 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer
          ${isDragActive
            ? 'border-red-600 bg-red-50'
            : 'border-gray-300 hover:border-gray-400 bg-white'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        translate="no"
      >
        <input {...getInputProps()} aria-label={t(`dropZone.ariaLabel${suffix}`)} />

        <div className="flex flex-col items-center">
          <Upload className="w-16 h-16 text-gray-400 mb-6" strokeWidth={1.5} aria-hidden="true" />

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 px-4">
            {t(`dropZone.dragDrop${suffix}`)}
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md px-4">
            {t(`dropZone.formats${suffix}`)}
          </p>

          <div className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white font-bold text-sm sm:text-base rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors touch-manipulation">
            <Upload className="w-5 h-5 mr-2" aria-hidden="true" />
            {t(`dropZone.button${suffix}`)}
          </div>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-900 font-medium">{t('dropZone.processing')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
