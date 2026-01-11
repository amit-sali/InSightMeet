import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { verifyUserAuth } from '../middleware/userAuth.js';
import { uploadMedia } from '../controller/mediaController.js';
import { transcribeMedia } from '../controller/transcriptionController.js';
import { generateNotes } from '../controller/notesController.js';
import { createPDF, downloadPDF } from '../controller/pdfController.js';

const router = express.Router();

// POST /api/v1/media/upload - Upload audio/video file
router.post('/upload', upload.single('mediaFile'), uploadMedia);

// POST /api/v1/media/transcribe - Transcribe audio to text
router.post('/transcribe', transcribeMedia);

// POST /api/v1/media/generate-notes - Generate structured notes from transcript
router.post('/generate-notes', generateNotes);

// POST /api/v1/media/create-pdf - Generate PDF from structured notes (Protected)
router.post('/create-pdf', verifyUserAuth, createPDF);

// GET /api/v1/media/download/:filename - Download generated PDF
router.get('/download/:filename', downloadPDF);

export default router;