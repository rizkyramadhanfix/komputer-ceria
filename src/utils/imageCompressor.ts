/**
 * Utility to compress and resize images on the client side using HTML5 Canvas.
 * Prevents Firestore 1MB document size limit errors and LocalStorage quota errors.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

export function compressImageFile(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 600,
    maxHeight = 600,
    quality = 0.8,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error('Gagal membaca file gambar.'));
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio scaling
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw src
          resolve(src);
          return;
        }

        // Fill background white for JPEG transparent backgrounds
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        // Fallback to original
        resolve(src);
      };

      img.src = src;
    };

    reader.onerror = () => {
      reject(new Error('Gagal memuat berkas gambar.'));
    };

    reader.readAsDataURL(file);
  });
}

export function compressDataUrl(
  dataUrl: string,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 600,
    maxHeight = 600,
    quality = 0.8,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      resolve(dataUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL(mimeType, quality));
    };

    img.onerror = () => {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}
