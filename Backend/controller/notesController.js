import handleAsyncError from '../middleware/handleAsyncError.js';
import { generateStructuredNotes } from '../utils/aiNotesService.js';

// Generate AI notes from transcript
export const generateNotes = handleAsyncError(async (req, res, next) => {
  const { transcript } = req.body;

  // Validate transcript
  if (!transcript || transcript.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Transcript is required'
    });
  }

  try {
    console.log('Generating AI notes for transcript...');
    
    // Call AI notes generation service
    const notesResult = await generateStructuredNotes(transcript);

    // Return structured notes
    res.status(200).json({
      success: true,
      message: 'Structured notes generated successfully',
      data: {
        structuredNotes: notesResult.structuredNotes,
        originalTranscript: notesResult.originalTranscript,
        wordCount: notesResult.wordCount,
        model: notesResult.model,
        processedAt: notesResult.processedAt
      }
    });

  } catch (error) {
    console.error('Notes generation controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Notes generation failed'
    });
  }
});