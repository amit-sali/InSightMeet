import handleAsyncError from '../middleware/handleAsyncError.js';
import Note from '../models/noteModel.js';
import HandleError from '../utils/handleError.js';

// Create a new note (will be used after PDF generation)
export const createNote = handleAsyncError(async (req, res, next) => {
  const {
    title,
    sourceType,
    originalFilename,
    pdfUrl,
    pdfPublicId,
    fileSize,
    duration,
    wordCount,
    aiModel
  } = req.body;

  // Validate required fields
  if (!title || !sourceType || !originalFilename || !pdfUrl || !pdfPublicId) {
    return next(new HandleError('Missing required fields', 400));
  }

  try {
    // Create note linked to authenticated user
    const note = await Note.create({
      userId: req.user._id, // From auth middleware
      title,
      sourceType,
      originalFilename,
      pdfUrl,
      pdfPublicId,
      fileSize,
      duration,
      wordCount,
      aiModel,
      status: 'completed'
    });

    res.status(201).json({
      success: true,
      message: 'Note saved successfully',
      data: note
    });

  } catch (error) {
    console.error('Create note error:', error);
    return next(new HandleError('Failed to save note', 500));
  }
});

// Get all notes for the authenticated user
export const getMyNotes = handleAsyncError(async (req, res, next) => {
  try {
    // Find notes for current user, sorted by newest first
    const notes = await Note.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v'); // Exclude version field

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });

  } catch (error) {
    console.error('Get notes error:', error);
    return next(new HandleError('Failed to fetch notes', 500));
  }
});

// Get a single note by ID (only if user owns it)
export const getNoteById = handleAsyncError(async (req, res, next) => {
  const { id } = req.params;

  try {
    const note = await Note.findOne({
      _id: id,
      userId: req.user._id // Ensure user owns this note
    });

    if (!note) {
      return next(new HandleError('Note not found', 404));
    }

    res.status(200).json({
      success: true,
      data: note
    });

  } catch (error) {
    console.error('Get note by ID error:', error);
    return next(new HandleError('Failed to fetch note', 500));
  }
});

// Delete a note (only if user owns it)
export const deleteNote = handleAsyncError(async (req, res, next) => {
  const { id } = req.params;

  try {
    const note = await Note.findOneAndDelete({
      _id: id,
      userId: req.user._id // Ensure user owns this note
    });

    if (!note) {
      return next(new HandleError('Note not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete note error:', error);
    return next(new HandleError('Failed to delete note', 500));
  }
});