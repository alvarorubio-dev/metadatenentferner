import { AlertTriangle, Shield, Camera, ExternalLink, X, Download, Loader2, MapPin, Settings, Clock, FileText, CheckCircle2, Trash2, FileCheck, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ExtractedMetadata, MetadataField } from '../utils/metadataExtractor';
import { getGoogleMapsUrl } from '../utils/metadataExtractor';
import type { CleaningReport } from '../types';

interface MetadataInspectorModalProps {
  metadata: ExtractedMetadata | null;
  isAnalyzing: boolean;
  isProcessing: boolean;
  cleaningReport: CleaningReport | null;
  uploadedFile: File | null;
  onClose: () => void;
  onCleanAndDownload: () => void;
  onDownloadCleaned: () => void;
}

export function MetadataInspectorModal({
  metadata,
  isAnalyzing,
  isProcessing,
  cleaningReport,
  uploadedFile,
  onClose,
  onCleanAndDownload,
  onDownloadCleaned,
}: MetadataInspectorModalProps) {
  const { t } = useTranslation();

  const hasData = metadata && metadata.totalFields > 0;
  const hasGPS = metadata?.hasGPS && metadata?.latitude && metadata?.longitude;

  const isDocument = uploadedFile && (
    uploadedFile.type === 'application/pdf' ||
    uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    uploadedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    uploadedFile.name.toLowerCase().endsWith('.pdf') ||
    uploadedFile.name.toLowerCase().endsWith('.docx') ||
    uploadedFile.name.toLowerCase().endsWith('.xlsx')
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const calculateSavings = (original: number, cleaned: number): string => {
    const saved = Math.max(0, original - cleaned); // Never show negative
    const percentage = original > 0 ? ((saved / original) * 100).toFixed(1) : '0.0';
    return `${formatFileSize(saved)} (${percentage}%)`;
  };

  const renderFieldCategory = (
    fields: MetadataField[],
    category: string,
    title: string,
    Icon: LucideIcon,
    color: 'red' | 'blue' | 'purple' | 'green' | 'gray'
  ) => {
    if (fields.length === 0) return null;

    const colorClasses = {
      red: 'bg-red-50 border-red-200 text-red-900',
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      gray: 'bg-gray-50 border-gray-200 text-gray-900',
    };

    const iconColorClasses = {
      red: 'text-red-800',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      gray: 'text-gray-600',
    };

    return (
      <div className={`rounded-xl border-2 p-4 ${colorClasses[color]}`}>
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-5 h-5 ${iconColorClasses[color]}`} aria-hidden="true" />
          <h3 className="font-bold text-base">{title}</h3>
          <span className={`ml-auto px-2 py-1 rounded-full text-xs font-bold ${iconColorClasses[color]} bg-white`}>
            {fields.length}
          </span>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={`${category}-${index}`}
              className="bg-white rounded-lg p-3 border border-gray-200"
            >
              <p className="text-xs text-gray-600 font-medium mb-1">{field.key}</p>
              <p className="text-sm font-mono text-gray-900 break-all">{field.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4" translate="no">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" translate="no">
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 sm:p-6 border-b-2 ${
            cleaningReport
              ? 'bg-green-50 border-green-500'
              : hasGPS
              ? 'bg-red-50 border-red-500'
              : hasData
              ? 'bg-yellow-50 border-yellow-500'
              : 'bg-green-50 border-green-500'
          }`}
        >
          <div className="flex items-center gap-3">
            {cleaningReport ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" aria-hidden="true" />
            ) : hasGPS ? (
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" aria-hidden="true" />
            ) : hasData ? (
              <Camera className="w-6 h-6 text-yellow-600 flex-shrink-0" aria-hidden="true" />
            ) : (
              <Shield className="w-6 h-6 text-green-600 flex-shrink-0" aria-hidden="true" />
            )}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {cleaningReport ? t('inspector.reportTitle') : t('inspector.title')}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {!isAnalyzing && !cleaningReport && (
              <button
                onClick={onCleanAndDownload}
                disabled={isProcessing}
                aria-label={t('inspector.ariaCleanAndDownload')}
                className={`flex items-center gap-2 px-4 py-2 text-white font-bold text-sm rounded-lg transition-colors ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : hasGPS
                    ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                    : hasData
                    ? 'bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800'
                    : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    {t('inspector.cleaning')}
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" aria-hidden="true" />
                    {t('inspector.btnClean')}
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              disabled={isProcessing}
              aria-label={t('inspector.ariaClose')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {cleaningReport ? (
            <div className="space-y-6">
              {(() => {
                const spaceSaved = Math.max(0, cleaningReport.originalSize - cleaningReport.cleanedSize);
                const hasSavings = spaceSaved > 0;

                return (
                  <>
                    <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <h3 className="text-xl font-bold text-green-900">{t('inspector.reportSuccess')}</h3>
                          <p className="text-green-700 text-sm mt-1">
                            {t('inspector.reportSuccessDesc')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FileCheck className="w-6 h-6 text-blue-600" aria-hidden="true" />
                        <h3 className="text-lg font-bold text-blue-900">{t('inspector.fileSizeComparison')}</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-blue-200">
                          <span className="text-gray-700 font-medium">{t('inspector.originalSize')}</span>
                          <span className="text-gray-900 font-bold">{formatFileSize(cleaningReport.originalSize)}</span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-blue-200">
                          <span className="text-gray-700 font-medium">{t('inspector.cleanedSize')}</span>
                          <span className="text-green-600 font-bold">{formatFileSize(cleaningReport.cleanedSize)}</span>
                        </div>
                        {hasSavings ? (
                          <div className="flex items-center justify-between bg-green-100 rounded-lg p-4 border-2 border-green-500">
                            <span className="text-green-800 font-bold">{t('inspector.spaceSaved')}</span>
                            <span className="text-green-900 font-bold text-lg">
                              -{calculateSavings(cleaningReport.originalSize, cleaningReport.cleanedSize)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 bg-green-50 rounded-lg p-4 border-2 border-green-500">
                            <Shield className="w-5 h-5 text-green-600 flex-shrink-0" aria-hidden="true" />
                            <span className="text-green-800 font-bold text-center">
                              {t('inspector.fileRestructured')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}

              {cleaningReport.removedTags.length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Trash2 className="w-6 h-6 text-red-600" aria-hidden="true" />
                    <h3 className="text-lg font-bold text-red-900">
                      {t('inspector.removedMetadata')} ({cleaningReport.removedTags.length} {t('inspector.removedTags')})
                    </h3>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-200 max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cleaningReport.removedTags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded px-3 py-2"
                        >
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                          <span className="font-mono truncate">{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {cleaningReport.remainingTags.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-gray-600" aria-hidden="true" />
                    <h3 className="text-base font-bold text-gray-900">
                      {t('inspector.preservedTechnical')} ({cleaningReport.remainingTags.length} {t('inspector.removedTags')})
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {t('inspector.preservedDesc')}
                  </p>
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 list-none flex items-center gap-2">
                      <span className="group-open:rotate-90 transition-transform">▶</span>
                      {t('inspector.viewPreservedTags')}
                    </summary>
                    <div className="mt-3 bg-white rounded-lg p-4 border border-gray-200 max-h-48 overflow-y-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cleaningReport.remainingTags.map((tag, index) => (
                          <div
                            key={index}
                            className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1 font-mono truncate"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                </div>
              )}

              <button
                onClick={onDownloadCleaned}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-lg rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                <Download className="w-6 h-6" aria-hidden="true" />
                {t('inspector.downloadCleanImage')}
              </button>
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-blue-900 font-medium text-lg">{t('inspector.analyzing')}</p>
            </div>
          ) : (
            <>
              {metadata && metadata.totalFields > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-6">
                  {t('inspector.totalFields')}: <span className="font-bold">{metadata.totalFields}</span>
                </div>
              )}

              {hasGPS && (
                <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 sm:p-6 mb-6 animate-pulse">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" aria-hidden="true" />
                    <div className="flex-1">
                      <p className="text-red-900 font-bold text-base sm:text-lg mb-2">
                        {t('inspector.alertGPS')}
                      </p>
                      <p className="text-red-800 text-sm sm:text-base mb-3 font-mono">
                        GPS: {metadata!.latitude?.toFixed(6)}, {metadata!.longitude?.toFixed(6)}
                      </p>
                      <a
                        href={getGoogleMapsUrl(metadata!.latitude!, metadata!.longitude!)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        {t('inspector.viewMap')}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {!hasData ? (
                isDocument ? (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <FileText className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" aria-hidden="true" />
                      <div>
                        <p className="text-blue-900 font-bold text-lg mb-2">
                          {t('inspector.labelNoData')}
                        </p>
                        <p className="text-blue-800 text-base leading-relaxed">
                          {t('inspector.documentMetadataInfo')}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-green-600 flex-shrink-0" aria-hidden="true" />
                      <p className="text-green-800 font-bold text-lg">{t('inspector.labelNoData')}</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  {renderFieldCategory(metadata!.allFields.filter(f => f.category === 'gps'), 'gps', t('inspector.categoryGPS'), MapPin, 'red')}
                  {renderFieldCategory(metadata!.allFields.filter(f => f.category === 'camera'), 'camera', t('inspector.categoryCamera'), Camera, 'blue')}
                  {renderFieldCategory(metadata!.allFields.filter(f => f.category === 'datetime'), 'datetime', t('inspector.categoryDateTime'), Clock, 'purple')}
                  {renderFieldCategory(metadata!.allFields.filter(f => f.category === 'settings'), 'settings', t('inspector.categorySettings'), Settings, 'green')}
                  {renderFieldCategory(metadata!.allFields.filter(f => f.category === 'other'), 'other', t('inspector.categoryOther'), FileText, 'gray')}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
