export interface CleaningReport {
  originalSize: number;
  cleanedSize: number;
  removedTags: string[];
  remainingTags: string[];
  cleanedBlob: Blob;
  originalFileName: string;
}
