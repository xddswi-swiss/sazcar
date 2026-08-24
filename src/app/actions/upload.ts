'use server';

import cloudinary from '@/lib/cloudinary';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File | null;
    if (!file) {
      return { success: false, error: 'Keine Datei hochgeladen' };
    }

    // Validation: MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { success: false, error: 'Ungültiger Dateityp. Erlaubt: JPG, PNG, WEBP, HEIC' };
    }

    // Validation: File size
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'Datei ist zu gross. Maximal 5MB erlaubt' };
    }

    // Convert file to base64 data URI for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'autogarage',
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto',
    });

    return {
      success: true,
      url: result.secure_url,
    };
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    return {
      success: false,
      error: 'Fehler beim Hochladen der Datei auf Cloudinary',
    };
  }
}
