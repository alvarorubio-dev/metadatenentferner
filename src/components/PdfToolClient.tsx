import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { DropZone } from './DropZone';
import { TrustBadges } from './TrustBadges';
import { removeMetadata } from '../utils/imageProcessor';
import { extractMetadata, type ExtractedMetadata } from '../utils/metadataExtractor';
import type { CleaningReport } from '../types';

const MetadataInspectorModal = lazy(() => import('./MetadataInspectorModal').then(module => ({ default: module.MetadataInspectorModal })));

interface PdfToolClientProps {
  format?: string;
}

export function PdfToolClient({ format }: PdfToolClientProps) {
  const { t } = useTranslation();
  const isMountedRef = useRef(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedMetadata, setExtractedMetadata] = useState<ExtractedMetadata | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cleaningReport, setCleaningReport] = useState<CleaningReport | null>(null);

  const getAppState = (): string => {
    if (cleaningReport) return 'report';
    if (isProcessing) return 'processing';
    if (isAnalyzing) return 'analyzing';
    if (uploadedFile) return 'ready';
    return 'idle';
  };

  const translateError = (errorMessage: string): string => {
    const errorMap: Record<string, string> = {
      'PDF_PASSWORD_PROTECTED': t('errors.pdfPassword'),
      'PDF_PROCESSING_ERROR': t('errors.pdfProcessing'),
      'OFFICE_PROCESSING_ERROR': t('errors.officeProcessing'),
      'HEIC_CONVERSION_ERROR': t('errors.heicConversion'),
      'IMAGE_FORMAT_ERROR': t('errors.imageFormat'),
      'IMAGE_PROCESSING_ERROR': t('errors.imageProcessing'),
      'CANVAS_CONTEXT_ERROR': t('errors.canvasContext'),
      'BLOB_CREATION_ERROR': t('errors.blobCreation'),
      'IMAGE_LOADING_ERROR': t('errors.imageLoading'),
    };

    return errorMap[errorMessage] || t('errors.generic');
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleFileDrop = async (file: File) => {
    setError(null);
    setUploadedFile(file);
    setShowModal(true);
    setIsAnalyzing(true);

    try {
      const metadata = await extractMetadata(file);
      if (isMountedRef.current) {
        setExtractedMetadata(metadata);
      }
    } catch (err) {
      console.error('Metadata extraction error:', err);
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? translateError(err.message) : t('errors.generic');
        setError(errorMessage);
        setShowModal(false);
        setUploadedFile(null);
      }
    } finally {
      if (isMountedRef.current) {
        setIsAnalyzing(false);
      }
    }
  };

  const handleCleanAndDownload = async () => {
    if (!uploadedFile || !extractedMetadata) return;

    setError(null);
    setIsProcessing(true);

    try {
      const result = await removeMetadata(uploadedFile);

      const cleanedFile = new File([result.cleanedBlob], uploadedFile.name, { type: uploadedFile.type });
      const cleanedMetadata = await extractMetadata(cleanedFile);

      if (isMountedRef.current) {
        const originalKeys = new Set(extractedMetadata.allFields.map(f => f.key));
        const cleanedKeys = new Set(cleanedMetadata.allFields.map(f => f.key));

        const removedTags = Array.from(originalKeys).filter(key => !cleanedKeys.has(key));
        const remainingTags = Array.from(cleanedKeys);

        const report: CleaningReport = {
          originalSize: result.originalSize,
          cleanedSize: result.cleanedSize,
          removedTags,
          remainingTags,
          cleanedBlob: result.cleanedBlob,
          originalFileName: uploadedFile.name,
        };

        setCleaningReport(report);
      }
    } catch (err) {
      console.error('File cleaning error:', err);
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? translateError(err.message) : t('errors.generic');
        setError(errorMessage);
        setShowModal(false);
      }
    } finally {
      if (isMountedRef.current) {
        setIsProcessing(false);
      }
    }
  };

  const handleDownloadCleanedImage = () => {
    if (!cleaningReport) return;

    const url = URL.createObjectURL(cleaningReport.cleanedBlob);
    const a = document.createElement('a');
    a.href = url;

    const fileExtMatch = cleaningReport.originalFileName.match(/\.[^/.]+$/);
    const fileExt = fileExtMatch ? fileExtMatch[0] : '.jpg';
    const fileNameWithoutExt = cleaningReport.originalFileName.replace(/\.[^/.]+$/, '');

    a.download = `clean_${fileNameWithoutExt}${fileExt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowModal(false);
    setExtractedMetadata(null);
    setUploadedFile(null);
    setCleaningReport(null);
  };

  const handleCloseModal = () => {
    if (isProcessing) return;
    setShowModal(false);
    setExtractedMetadata(null);
    setUploadedFile(null);
    setError(null);
    setCleaningReport(null);
  };

  return (
    <>
      {error && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        </div>
      )}

      <div id="app-dropzone-area" key={`dropzone-${getAppState()}`} translate="no">
        <DropZone key={`dropzone-component-${getAppState()}`} onFileDrop={handleFileDrop} isProcessing={false} />
      </div>
      <TrustBadges />

      <div id="app-modal-portal" key={`modal-portal-${getAppState()}`} translate="no">
        {showModal && (
          <Suspense fallback={<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
            <MetadataInspectorModal
              key={`modal-content-${getAppState()}`}
              metadata={extractedMetadata}
              isAnalyzing={isAnalyzing}
              isProcessing={isProcessing}
              cleaningReport={cleaningReport}
              uploadedFile={uploadedFile}
              onClose={handleCloseModal}
              onCleanAndDownload={handleCleanAndDownload}
              onDownloadCleaned={handleDownloadCleanedImage}
            />
          </Suspense>
        )}
      </div>
    </>
  );
}
