// Cloudinary configuration for client-side uploads
export const cloudinaryConfig = {
  cloudName: 'dlkayagta',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || 'snKrIHy2oC7CbRtMQ8Hs99ElgQA',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'dar_home_upload',
};

// Cloudinary upload URL
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
