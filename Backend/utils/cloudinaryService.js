import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Debug environment variables
console.log('Cloudinary Environment Check:');
console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Present' : 'Missing');
console.log('API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing');
console.log('API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing');

// Configure Cloudinary with fallback values
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dzdilrw2w',
  api_key: process.env.CLOUDINARY_API_KEY || '921457537123986',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Db91GUbJ3guS__SW6Opz3UDDbQw'
});

// Upload PDF to Cloudinary (with fallback to local storage)
export const uploadPDFToCloudinary = async (localPdfPath, originalFilename) => {
  try {
    console.log('Checking Cloudinary configuration...');
    
    // Check if Cloudinary is properly configured
    const config = cloudinary.config();
    if (!config.api_key) {
      console.log('Cloudinary not configured, using local storage fallback');
      
      // Return local file info as fallback
      const stats = fs.statSync(localPdfPath);
      return {
        url: `/api/v1/media/download/${path.basename(localPdfPath)}`,
        publicId: `local-${Date.now()}`,
        size: stats.size,
        format: 'pdf',
        uploadedAt: new Date(),
        isLocal: true
      };
    }

    console.log('Uploading PDF to Cloudinary:', localPdfPath);

    // Generate unique public ID for the PDF
    const timestamp = Date.now();
    const publicId = `ai-notes/${timestamp}-${originalFilename.replace(/\.[^/.]+$/, "")}`;

    // Upload PDF to Cloudinary
    const result = await cloudinary.uploader.upload(localPdfPath, {
      resource_type: 'raw', // For non-image files like PDFs
      public_id: publicId,
      folder: 'ai-notes', // Organize PDFs in a folder
      use_filename: true,
      unique_filename: false,
      overwrite: false
    });

    console.log('PDF uploaded successfully to Cloudinary');

    // Delete local file after successful upload (only if uploaded to cloud)
    if (!result.isLocal) {
      try {
        fs.unlinkSync(localPdfPath);
        console.log('Local PDF file deleted:', localPdfPath);
      } catch (deleteError) {
        console.warn('Failed to delete local PDF file:', deleteError.message);
      }
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      format: result.format,
      uploadedAt: new Date()
    };

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload PDF to Cloudinary: ' + error.message);
  }
};

// Delete PDF from Cloudinary
export const deletePDFFromCloudinary = async (publicId) => {
  try {
    console.log('Deleting PDF from Cloudinary:', publicId);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'
    });

    console.log('PDF deleted from Cloudinary:', result);
    return result;

  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete PDF from Cloudinary: ' + error.message);
  }
};

// Get PDF info from Cloudinary
export const getPDFInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'raw'
    });

    return {
      url: result.secure_url,
      size: result.bytes,
      format: result.format,
      createdAt: result.created_at
    };

  } catch (error) {
    console.error('Cloudinary info error:', error);
    throw new Error('Failed to get PDF info from Cloudinary: ' + error.message);
  }
};