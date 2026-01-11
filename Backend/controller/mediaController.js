import handleAsyncError from '../middleware/handleAsyncError.js';
import { extractAudio, isVideoFile, isAudioFile } from '../utils/audioExtractor.js';
import path from 'path';

// Upload media file endpoint
export const uploadMedia = handleAsyncError(async (req, res, next) => {
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  let audioPath = req.file.path;
  let processedFile = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path,
    uploadedAt: new Date()
  };

  try {
    // If uploaded file is video, extract audio
    if (isVideoFile(req.file.mimetype)) {
      console.log('Video file detected, extracting audio...');
      audioPath = await extractAudio(req.file.path);
      
      // Update file info with audio details
      processedFile.audioPath = audioPath;
      processedFile.audioExtracted = true;
      processedFile.originalType = 'video';
    } else if (isAudioFile(req.file.mimetype)) {
      // Audio file - no extraction needed
      processedFile.audioPath = audioPath;
      processedFile.audioExtracted = false;
      processedFile.originalType = 'audio';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unsupported file type'
      });
    }

    // Return success response with file metadata
    res.status(200).json({
      success: true,
      message: 'File processed successfully',
      data: processedFile
    });

  } catch (error) {
    console.error('Audio extraction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process media file: ' + error.message
    });
  }
});