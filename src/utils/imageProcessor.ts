// Dynamic imports for heavy dependencies to reduce initial bundle size

export interface ExifMetadata {
  [key: string]: string | number | Date | undefined;
}

export interface ProcessedImage {
  cleanedBlob: Blob;
  originalSize: number;
  cleanedSize: number;
  metadataCount: number;
  metadata: ExifMetadata;
}

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];

async function removePdfMetadata(file: File): Promise<ProcessedImage> {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');

    const cleanedBytes = await pdfDoc.save();
    const cleanedBlob = new Blob([cleanedBytes], { type: 'application/pdf' });

    return {
      cleanedBlob,
      originalSize: file.size,
      cleanedSize: cleanedBlob.size,
      metadataCount: 6,
      metadata: {},
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '';

    if (errorMessage.includes('password') || errorMessage.includes('encrypted') || errorMessage.includes('Encrypted')) {
      throw new Error('PDF_PASSWORD_PROTECTED');
    }

    console.error('PDF processing error:', error);
    throw new Error('PDF_PROCESSING_ERROR');
  }
}

async function removeOfficeMetadata(file: File): Promise<ProcessedImage> {
  try {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const arrayBuffer = await file.arrayBuffer();
    await zip.loadAsync(arrayBuffer);

    const corePropsPath = 'docProps/core.xml';
    const appPropsPath = 'docProps/app.xml';

    if (zip.file(corePropsPath)) {
      const emptyCoreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title></dc:title>
  <dc:subject></dc:subject>
  <dc:creator></dc:creator>
  <cp:keywords></cp:keywords>
  <dc:description></dc:description>
  <cp:lastModifiedBy></cp:lastModifiedBy>
  <cp:revision>1</cp:revision>
  <dcterms:created xsi:type="dcterms:W3CDTF"></dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF"></dcterms:modified>
</cp:coreProperties>`;
      zip.file(corePropsPath, emptyCoreXml);
    }

    if (zip.file(appPropsPath)) {
      const emptyAppXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application></Application>
  <Company></Company>
  <Manager></Manager>
</Properties>`;
      zip.file(appPropsPath, emptyAppXml);
    }

    const cleanedArrayBuffer = await zip.generateAsync({ type: 'arraybuffer' });
    const cleanedBlob = new Blob([cleanedArrayBuffer], { type: file.type });

    return {
      cleanedBlob,
      originalSize: file.size,
      cleanedSize: cleanedBlob.size,
      metadataCount: 10,
      metadata: {},
    };
  } catch (error) {
    console.error('Office file processing error:', error);
    throw new Error('OFFICE_PROCESSING_ERROR');
  }
}

async function removeImageMetadata(file: File): Promise<ProcessedImage> {
  let fileType = file.type.toLowerCase();
  let processFile = file;

  // Special handling for HEIC - convert to JPEG first
  if (fileType === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
    try {
      const heic2any = (await import('heic2any')).default;
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.95,
      });

      // heic2any can return Blob or Blob[], handle both cases
      const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      processFile = new File([resultBlob], file.name.replace(/\.heic$/i, '.jpg'), {
        type: 'image/jpeg',
      });
      fileType = 'image/jpeg';
    } catch (error) {
      console.error('HEIC conversion error:', error);
      throw new Error('HEIC_CONVERSION_ERROR');
    }
  }

  // Check if file type is supported
  if (!SUPPORTED_IMAGE_TYPES.includes(fileType) && !file.type.startsWith('image/')) {
    throw new Error('IMAGE_FORMAT_ERROR');
  }

  // ===================================================================
  // NUCLEAR OPTION: Extract EXIF metadata AND orientation before nuking
  // ===================================================================
  let metadata: ExifMetadata = {};
  let metadataCount = 0;
  let orientation = 1; // Default: no rotation needed

  try {
    const exifr = await import('exifr');
    const exifData = await exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true,
      xmp: true,
      iptc: true,
      icc: true,
    });

    if (exifData && typeof exifData === 'object') {
      metadata = exifData as ExifMetadata;
      metadataCount = Object.keys(exifData).length;

      // Extract orientation tag (EXIF 0x0112) to preserve rotation
      if (exifData.Orientation && typeof exifData.Orientation === 'number') {
        orientation = exifData.Orientation;
      }
    }
  } catch {
    // No EXIF data found - this is normal for some images
  }

  // ===================================================================
  // CANVAS RE-RENDERING: The Nuclear Metadata Annihilation
  // ===================================================================
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(processFile);

    img.onload = () => {
      try {
        // Clean up object URL immediately
        URL.revokeObjectURL(objectUrl);

        // Calculate canvas dimensions based on EXIF orientation
        let canvasWidth = img.width;
        let canvasHeight = img.height;

        // For orientations 5-8, width and height are swapped
        if (orientation >= 5 && orientation <= 8) {
          canvasWidth = img.height;
          canvasHeight = img.width;
        }

        // Create off-screen canvas with correct dimensions
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const ctx = canvas.getContext('2d', {
          alpha: true,
          willReadFrequently: false,
          desynchronized: false,
        });

        if (!ctx) {
          reject(new Error('CANVAS_CONTEXT_ERROR'));
          return;
        }

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Apply EXIF orientation transformation
        // This ensures the output image appears correctly rotated
        applyOrientation(ctx, orientation, canvasWidth, canvasHeight);

        // CRITICAL: Draw image to canvas - this extracts ONLY RGBA pixel data
        // All metadata (EXIF, GPS, XMP, IPTC, ICC, MakerNotes) is intentionally dropped
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Determine output format and quality
        let outputType = 'image/jpeg';
        let quality = 0.95; // Very High quality

        if (fileType === 'image/png') {
          outputType = 'image/png';
          quality = 1.0; // PNG is lossless, but still strips metadata
        } else if (fileType === 'image/webp') {
          outputType = 'image/webp';
          quality = 0.95;
        }

        // THE CLEAN BIRTH: Export canvas as a completely new file
        // This creates a fresh file structure with zero metadata
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('BLOB_CREATION_ERROR'));
              return;
            }

            resolve({
              cleanedBlob: blob,
              originalSize: file.size,
              cleanedSize: blob.size,
              metadataCount,
              metadata,
            });
          },
          outputType,
          quality
        );
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        console.error('Image canvas processing error:', error);
        reject(new Error('IMAGE_PROCESSING_ERROR'));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('IMAGE_LOADING_ERROR'));
    };

    // CORS-enabled for external images (though we're using local files)
    img.crossOrigin = 'anonymous';
    img.src = objectUrl;
  });
}

export async function removeMetadata(file: File): Promise<ProcessedImage> {
  const fileExtension = file.name.toLowerCase().split('.').pop() || '';
  const fileType = file.type.toLowerCase();

  if (fileType === 'application/pdf' || fileExtension === 'pdf') {
    return removePdfMetadata(file);
  }

  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileExtension === 'docx'
  ) {
    return removeOfficeMetadata(file);
  }

  if (
    fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    fileExtension === 'xlsx'
  ) {
    return removeOfficeMetadata(file);
  }

  return removeImageMetadata(file);
}

/**
 * Apply EXIF Orientation transformation to canvas context
 * This prevents images from appearing rotated after metadata removal
 *
 * EXIF Orientation values:
 * 1 = Normal (0°)
 * 2 = Flip horizontal
 * 3 = Rotate 180°
 * 4 = Flip vertical
 * 5 = Rotate 90° CW + Flip horizontal
 * 6 = Rotate 90° CW
 * 7 = Rotate 90° CCW + Flip horizontal
 * 8 = Rotate 90° CCW
 */
function applyOrientation(
  ctx: CanvasRenderingContext2D,
  orientation: number,
  width: number,
  height: number
): void {
  switch (orientation) {
    case 2:
      // Horizontal flip
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3:
      // 180° rotation
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4:
      // Vertical flip
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5:
      // 90° CW + horizontal flip
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      // 90° CW
      ctx.transform(0, 1, -1, 0, height, 0);
      break;
    case 7:
      // 90° CCW + horizontal flip
      ctx.transform(0, -1, -1, 0, height, width);
      break;
    case 8:
      // 90° CCW
      ctx.transform(0, -1, 1, 0, 0, width);
      break;
    case 1:
    default:
      // No transformation needed
      break;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
