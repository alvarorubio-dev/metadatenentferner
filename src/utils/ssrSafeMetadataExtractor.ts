import type { ExtractedMetadata } from './metadataExtractor';

export async function extractMetadata(file: File): Promise<ExtractedMetadata> {
  if (typeof window === 'undefined') {
    return {
      hasGPS: false,
      totalFields: 0,
      allFields: [],
    };
  }

  const { extractMetadata: clientExtractMetadata } = await import('./metadataExtractor');
  return clientExtractMetadata(file);
}

export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
