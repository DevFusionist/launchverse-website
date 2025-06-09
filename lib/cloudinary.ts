import { v2 as cloudinary } from "cloudinary";

// Configure cloudinary (using environment variables CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryInstance = cloudinary;

/**
 * Uploads an image (provided as a base64 string) to cloudinary and returns the secure url.
 * (This function is intended for server-side use.)
 */
export async function uploadImage(
  base64Image: string,
  folder: string = "company_logos"
): Promise<string> {
  const uploadResponse = await cloudinary.uploader.upload(base64Image, {
    folder,
  });
  return uploadResponse.secure_url;
}
