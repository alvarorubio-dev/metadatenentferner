// Dynamic import for ExifReader to reduce initial bundle size

interface ExifTag {
  description?: string;
  value?: unknown;
}

export interface MetadataField {
  key: string;
  value: string;
  category: 'gps' | 'camera' | 'settings' | 'datetime' | 'other';
}

export interface ExtractedMetadata {
  hasGPS: boolean;
  latitude?: number;
  longitude?: number;
  camera?: string;
  make?: string;
  model?: string;
  dateTime?: string;
  software?: string;
  lens?: string;
  aperture?: string;
  iso?: string;
  focalLength?: string;
  totalFields: number;
  allFields: MetadataField[];
}

const GPS_FIELDS = ['GPS', 'GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'GPSSpeed', 'GPSImgDirection', 'GPSDestBearing', 'GPSTimeStamp', 'GPSDateStamp'];
const CAMERA_FIELDS = ['Make', 'Model', 'LensModel', 'LensMake', 'LensSerialNumber', 'SerialNumber', 'InternalSerialNumber'];
const SETTINGS_FIELDS = ['FNumber', 'ISOSpeedRatings', 'ISO', 'ExposureTime', 'ShutterSpeedValue', 'FocalLength', 'Flash', 'WhiteBalance', 'MeteringMode', 'ExposureProgram', 'ExposureMode'];
const DATETIME_FIELDS = ['DateTime', 'DateTimeOriginal', 'DateTimeDigitized', 'CreateDate', 'ModifyDate'];

function categorizeField(key: string): 'gps' | 'camera' | 'settings' | 'datetime' | 'other' {
  const keyUpper = key.toUpperCase();

  if (GPS_FIELDS.some(field => keyUpper.includes(field.toUpperCase()))) {
    return 'gps';
  }
  if (CAMERA_FIELDS.some(field => keyUpper.includes(field.toUpperCase()))) {
    return 'camera';
  }
  if (SETTINGS_FIELDS.some(field => keyUpper.includes(field.toUpperCase()))) {
    return 'settings';
  }
  if (DATETIME_FIELDS.some(field => keyUpper.includes(field.toUpperCase()))) {
    return 'datetime';
  }
  return 'other';
}

export async function extractMetadata(file: File): Promise<ExtractedMetadata> {
  try {
    const ExifReader = (await import('exifreader')).default;
    const tags = await ExifReader.load(file);

    const latitude = tags.GPSLatitude?.description;
    const longitude = tags.GPSLongitude?.description;

    const allFields: MetadataField[] = [];

    for (const [key, value] of Object.entries(tags)) {
      if (value && typeof value === 'object' && 'description' in value) {
        const tag = value as ExifTag;
        if (tag.description && tag.description !== 'undefined') {
          allFields.push({
            key,
            value: String(tag.description),
            category: categorizeField(key),
          });
        }
      }
    }

    const metadata: ExtractedMetadata = {
      hasGPS: !!(latitude && longitude),
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      camera: tags.Model?.description,
      make: tags.Make?.description,
      model: tags.Model?.description,
      dateTime: tags.DateTimeOriginal?.description || tags.DateTime?.description,
      software: tags.Software?.description,
      lens: tags.LensModel?.description,
      aperture: tags.FNumber?.description,
      iso: tags.ISOSpeedRatings?.description,
      focalLength: tags.FocalLength?.description,
      totalFields: allFields.length,
      allFields,
    };

    return metadata;
  } catch {
    return {
      hasGPS: false,
      totalFields: 0,
      allFields: [],
    };
  }
}

export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
