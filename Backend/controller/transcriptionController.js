import handleAsyncError from '../middleware/handleAsyncError.js';
import { transcribeAudioFile } from '../utils/assemblyAIService.js';

// Transcribe uploaded audio file
export const transcribeMedia = handleAsyncError(async (req, res, next) => {
  const { audioPath } = req.body;

  // Validate audio path
  if (!audioPath) {
    return res.status(400).json({
      success: false,
      message: 'Audio path is required'
    });
  }

  try {
    console.log('Transcribing audio file:', audioPath);
    
    // Call AssemblyAI transcription service
    const transcriptionResult = await transcribeAudioFile(audioPath);

    // Return transcription result
    res.status(200).json({
      success: true,
      message: 'Transcription completed successfully',
      data: {
        transcript: transcriptionResult.text,
        duration: transcriptionResult.duration,
        language: transcriptionResult.language,
        wordCount: transcriptionResult.text.split(' ').length,
        segments: transcriptionResult.segments,
        processedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Transcription controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Transcription failed'
    });
  }
});