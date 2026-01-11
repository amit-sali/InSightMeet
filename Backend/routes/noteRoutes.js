import express from 'express';
import { verifyUserAuth } from '../middleware/userAuth.js';
import {
  createNote,
  getMyNotes,
  getNoteById,
  deleteNote
} from '../controller/noteController.js';

const router = express.Router();

// All routes require authentication
router.use(verifyUserAuth);

// POST /api/v1/notes - Create a new note
router.post('/', createNote);

// GET /api/v1/notes/my-notes - Get all notes for authenticated user
router.get('/my-notes', getMyNotes);

// GET /api/v1/notes/:id - Get single note by ID
router.get('/:id', getNoteById);

// DELETE /api/v1/notes/:id - Delete note by ID
router.delete('/:id', deleteNote);

export default router;