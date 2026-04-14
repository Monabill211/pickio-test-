import { CLOUDINARY_UPLOAD_URL, cloudinaryConfig } from '@/lib/cloudinary';
import { compressImage } from '@/utils/imageCompression';

/**
 * Upload an image file to Cloudinary (with compression)
 */
// Image upload constants
const MAX_FILE_SIZE_BEFORE_COMPRESSION = 5 * 1024 * 1024; // 5MB - reject files larger than this
const MAX_FILE_SIZE_AFTER_COMPRESSION = 100 * 1024; // 100KB - target size after compression
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export const uploadImage = async (
  file: File,
  folder: string = 'categories'
): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/') || !ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      throw new Error('File must be a valid image (JPEG, PNG, WebP, or GIF)');
    }

    // Validate file size before compression (reject files larger than 5MB)
    if (file.size > MAX_FILE_SIZE_BEFORE_COMPRESSION) {
      throw new Error(`Image size must be less than ${MAX_FILE_SIZE_BEFORE_COMPRESSION / (1024 * 1024)}MB`);
    }

    // Compress image before upload (aggressive compression for 100KB target)
    let fileToUpload = file;
    try {
      fileToUpload = await compressImage(file, 1200, 1200, 0.6, 0.1); // Max 100KB, 60% quality, smaller dimensions
    } catch (compressionError) {
      // If compression fails, check if original is acceptable
      if (file.size > MAX_FILE_SIZE_AFTER_COMPRESSION) {
        throw new Error('Image is too large and compression failed. Please use a smaller image (max 100KB).');
      }
      fileToUpload = file;
    }

    // Final size check after compression
    if (fileToUpload.size > MAX_FILE_SIZE_AFTER_COMPRESSION) {
      throw new Error(`Image size must be less than ${MAX_FILE_SIZE_AFTER_COMPRESSION / 1024}KB after compression. Please use a smaller image.`);
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('folder', folder);
    
    // Use upload preset - REQUIRED for unsigned uploads
    const uploadPreset = cloudinaryConfig.uploadPreset || 'dar_home_upload';
    
    if (!uploadPreset) {
      throw new Error(
        'Upload preset not configured. Please create an unsigned upload preset in Cloudinary Dashboard and add it to .env file as VITE_CLOUDINARY_UPLOAD_PRESET'
      );
    }
    
    formData.append('upload_preset', uploadPreset);

    // Add timestamp for unique filenames
    const timestamp = Date.now();
    const fileName = fileToUpload.name.replace(/\.[^/.]+$/, ''); // Remove extension
    formData.append('public_id', `${folder}/${timestamp}_${fileName}`);
    
    // Add quality and format optimization to Cloudinary
    formData.append('quality', 'auto:good');
    formData.append('fetch_format', 'auto');

    // Upload to Cloudinary
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Upload failed: ${response.statusText}`;
      
      // Provide helpful error message for missing preset
      if (errorMessage.includes('preset') || errorMessage.includes('Upload preset')) {
        throw new Error(
          'Upload preset not found. Please create an unsigned upload preset named "dar_home_upload" in Cloudinary Dashboard. See CREATE_UPLOAD_PRESET.md for instructions.'
        );
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.secure_url) {
      throw new Error('Upload succeeded but no URL returned');
    }

    return data.secure_url;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Delete an image from Cloudinary
 * Note: Requires server-side implementation with API secret
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
    if (!imageUrl.includes('cloudinary.com')) {
      return; // Not a Cloudinary URL
    }

    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      return;
    }
    
    // Get the path after 'upload/v{version}/'
    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
    // Remove file extension
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
    
    if (publicId) {
      // Note: Deletion requires server-side API call with API secret
      // TODO: Implement server-side deletion endpoint if needed
    }
  } catch (error) {
    // Don't throw - image deletion is not critical
  }
};

/**
 * Get Cloudinary image URL with transformations
 */
export const getCloudinaryUrl = (
  imageUrl: string,
  transformations?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  }
): string => {
  if (!imageUrl.includes('cloudinary.com')) {
    return imageUrl; // Not a Cloudinary URL, return as-is
  }

  // Extract public_id from URL
  const urlParts = imageUrl.split('/');
  const uploadIndex = urlParts.findIndex(part => part === 'upload');
  
  if (uploadIndex === -1) {
    return imageUrl;
  }

  // Build transformation string
  const transforms: string[] = [];
  if (transformations?.width) transforms.push(`w_${transformations.width}`);
  if (transformations?.height) transforms.push(`h_${transformations.height}`);
  if (transformations?.crop) transforms.push(`c_${transformations.crop}`);
  if (transformations?.quality) transforms.push(`q_${transformations.quality}`);

  const transformString = transforms.length > 0 ? transforms.join(',') + '/' : '';
  
  // Reconstruct URL with transformations
  const baseUrl = urlParts.slice(0, uploadIndex + 1).join('/');
  const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
  
  return `${baseUrl}/${transformString}${pathAfterUpload}`;
};
