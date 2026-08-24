import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn('Warning: Cloudinary environment variables are not fully configured.');
}

cloudinary.config({
  cloud_name: cloudName || 'dummy',
  api_key: apiKey || 'dummy',
  api_secret: apiSecret || 'dummy',
  secure: true,
});

export default cloudinary;
