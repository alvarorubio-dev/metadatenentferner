import type { ProcessedImage } from './imageProcessor';

export async function removeMetadata(file: File): Promise<ProcessedImage> {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client side');
  }

  const { removeMetadata: clientRemoveMetadata } = await import('./imageProcessor');
  return clientRemoveMetadata(file);
}

export function formatFileSize(bytes: number): string {
  if (typeof window === 'undefined') {
    return '0 Bytes';
  }

  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function downloadFile(blob: Blob, filename: string) {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client side');
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
