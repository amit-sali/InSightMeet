import handleAsyncError from '../middleware/handleAsyncError.js';
import { generatePDF } from '../utils/pdfService.js';
import Note from '../models/noteModel.js';
import fs from 'fs';
import path from 'path';

// Generate PDF from structured notes (Protected Route)
export const createPDF = handleAsyncError(async (req, res, next) => {
  const { structuredNotes, originalFilename, duration, wordCount, sourceType } = req.body;

  // Validate input
  if (!structuredNotes || structuredNotes.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Structured notes are required'
    });
  }

  // Ensure user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  try {
    console.log('Creating PDF from structured notes for user:', req.user._id);
    
    // Generate PDF and upload to Cloudinary
    const pdfResult = await generatePDF(structuredNotes, originalFilename || 'audio');

    // Generate note title from filename or timestamp
    const noteTitle = originalFilename 
      ? `Notes - ${originalFilename.replace(/\.[^/.]+$/, '')}` 
      : `AI Notes - ${new Date().toLocaleDateString()}`;

    // Save note metadata to database
    const savedNote = await Note.create({
      userId: req.user._id,
      title: noteTitle,
      sourceType: sourceType || 'audio',
      originalFilename: originalFilename || 'audio',
      pdfUrl: pdfResult.cloudinaryUrl,
      pdfPublicId: pdfResult.cloudinaryPublicId,
      fileSize: pdfResult.size,
      duration: duration || 0,
      wordCount: wordCount || structuredNotes.split(' ').length,
      aiModel: 'gpt-4o-mini',
      status: 'completed'
    });

    console.log('Note saved to database:', savedNote._id);

    // Return PDF info with note ID
    res.status(200).json({
      success: true,
      message: 'PDF generated and note saved successfully',
      data: {
        noteId: savedNote._id,
        title: savedNote.title,
        pdfUrl: pdfResult.cloudinaryUrl,
        pdfPublicId: pdfResult.cloudinaryPublicId,
        size: pdfResult.size,
        generatedAt: pdfResult.generatedAt
      }
    });

  } catch (error) {
    console.error('PDF creation controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'PDF generation failed'
    });
  }
});

// Download PDF file
export const downloadPDF = handleAsyncError(async (req, res, next) => {
  const { filename } = req.params;

  try {
    const pdfPath = path.join('./uploads/pdfs', filename);

    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found'
      });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream file to response
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download PDF'
    });
  }
});