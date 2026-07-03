export function isDocumentFormat(format?: string): boolean {
  if (!format) return false;
  const documentFormats = ['pdf', 'docx', 'xlsx'];
  return documentFormats.includes(format.toLowerCase());
}

export function isImageFormat(format?: string): boolean {
  if (!format) return true;
  const imageFormats = ['jpg', 'jpeg', 'png', 'heic', 'webp'];
  return imageFormats.includes(format.toLowerCase());
}
