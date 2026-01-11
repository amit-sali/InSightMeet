// Mock transcription service for learning purposes
export const transcribeAudioFile = async (audioPath) => {
  try {
    console.log('Mock transcription for:', audioPath);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return mock transcription based on filename
    const filename = audioPath.split(/[\\\/]/).pop();
    
    const mockTranscripts = {
      default: "Hello, this is a sample transcription of your audio file. In this recording, we discuss the importance of artificial intelligence in modern technology. AI has revolutionized many industries including healthcare, finance, and education. Machine learning algorithms can now process vast amounts of data to provide insights that were previously impossible to obtain. This technology continues to evolve rapidly, offering new opportunities for innovation and growth."
    };
    
    const transcript = mockTranscripts.default;
    
    console.log('Mock transcription completed');
    
    return {
      text: transcript,
      confidence: 0.95,
      duration: 45.2,
      language: 'en',
      words: transcript.split(' ').map((word, index) => ({
        text: word,
        start: index * 0.5,
        end: (index + 1) * 0.5,
        confidence: 0.95
      }))
    };

  } catch (error) {
    console.error('Mock transcription error:', error);
    throw new Error('Failed to transcribe audio: ' + error.message);
  }
};