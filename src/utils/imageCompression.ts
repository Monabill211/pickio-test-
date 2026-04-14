import imageCompression, { type Options } from 'browser-image-compression';

/** 100KB in bytes */
export const TARGET_SIZE_BYTES = 100 * 1024;

/** 100KB in MB (for browser-image-compression) */
const MAX_SIZE_MB = 0.1;

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxSizeMB?: number;
  initialQuality?: number;
}

/**
 * Compress image using browser-image-compression package.
 * Aggressively reduces file size (target 100KB) while maintaining reasonable quality.
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  _quality?: number,
  maxSizeMB: number = MAX_SIZE_MB
): Promise<File> => {
  if (file.size <= TARGET_SIZE_BYTES) {
    return file;
  }

  const options: Options = {
    maxSizeMB,
    maxWidthOrHeight: Math.max(maxWidth, maxHeight),
    useWebWorker: true,
    initialQuality: 0.6,
    fileType: 'image/jpeg',
    preserveExif: false,
    alwaysKeepResolution: false,
  };

  try {
    const compressed = await imageCompression(file, options);

    if (compressed.size > TARGET_SIZE_BYTES && maxWidth > 600) {
      return compressImage(
        file,
        Math.floor(maxWidth * 0.7),
        Math.floor(maxHeight * 0.7),
        0.5,
        maxSizeMB
      );
    }

    return compressed;
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : 'Image compression failed'
    );
  }
};

/**
 * Get file size in KB for display.
 */
export const getFileSizeKB = (bytes: number): number =>
  Math.round(bytes / 1024);
