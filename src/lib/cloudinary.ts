import { v2 as cloudinary } from 'cloudinary';

// Parse CLOUDINARY_URL if available, otherwise use individual env vars
if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
} else {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Extract cloud name from CLOUDINARY_URL for client-side use
export const cloudName = process.env.CLOUDINARY_URL
  ? process.env.CLOUDINARY_URL.split('@')[1]
  : process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

// Helper function to extract public_id from Cloudinary URL
export function getPublicIdFromUrl(url: string) {
  try {
    // Parse the URL to get the pathname
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Match the pattern: /v{version}/{folder}/{filename}
    const matches = pathname.match(/\/v\d+\/([^/]+\/[^/]+)\./);

    if (!matches) {
      console.error('Invalid Cloudinary URL format:', url);
      return null;
    }

    // Return the public ID (folder + filename without extension)
    return matches[1];
  } catch (error) {
    console.error('Error parsing Cloudinary URL:', error);
    return null;
  }
}
