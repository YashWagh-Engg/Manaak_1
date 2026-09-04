/**
 * Image Optimizer for Mobile & Web Camera Scans
 * Compresses large mobile camera photos (often 10MB-25MB) into lightweight,
 * high-clarity JPEGs (150KB-300KB) with optimal resolution for OCR & vision analysis.
 */

export async function optimizeImageForAnalysis(
  source: string | File,
  maxDimension: number = 1280,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If source is a File
    if (source instanceof File) {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.onload = () => {
        processDataUrl(reader.result as string, maxDimension, quality, resolve, reject);
      };
      reader.readAsDataURL(source);
    } else {
      processDataUrl(source, maxDimension, quality, resolve, reject);
    }
  });
}

function processDataUrl(
  dataUrl: string,
  maxDimension: number,
  quality: number,
  resolve: (res: string) => void,
  reject: (err: any) => void
) {
  // If already a tiny SVG or dummy image, return as-is
  if (dataUrl.startsWith('data:image/svg+xml') || dataUrl.length < 5000) {
    return resolve(dataUrl);
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onerror = () => {
    // If image loading fails, resolve original as fallback
    resolve(dataUrl);
  };
  img.onload = () => {
    try {
      let { width, height } = img;

      // Calculate scaled dimensions preserving aspect ratio
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(width, 100);
      canvas.height = Math.max(height, 100);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(dataUrl);
      }

      // High quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw and compress to JPEG
      ctx.drawImage(img, 0, 0, width, height);
      const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);

      resolve(optimizedDataUrl);
    } catch (err) {
      console.warn('Canvas image compression failed, using original:', err);
      resolve(dataUrl);
    }
  };

  img.src = dataUrl;
}
