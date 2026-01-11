import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Debug environment variables
console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('All ASSEMBLYAI keys:', Object.keys(process.env).filter(key => key.includes('ASSEMBLYAI')));
console.log('Raw ASSEMBLYAI_API_KEY:', process.env.ASSEMBLYAI_API_KEY);

// Temporary hardcoded API key for testing
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY || '67a0dbc2d2d440d3934553d9493a5cc8';
const ASSEMBLYAI_URL = 'https://api.assemblyai.com/v2';

// Upload audio file to AssemblyAI
const uploadAudio = async (audioPath) => {
  console.log('API Key:', ASSEMBLYAI_API_KEY ? 'Present' : 'Missing');
  console.log('API Key length:', ASSEMBLYAI_API_KEY?.length);
  
  const data = fs.readFileSync(audioPath);
  
  const response = await fetch(`${ASSEMBLYAI_URL}/upload`, {
    method: 'POST',
    headers: {
      'authorization': ASSEMBLYAI_API_KEY,
      'content-type': 'application/octet-stream'
    },
    body: data
  });

  console.log('Upload response status:', response.status);
  const responseText = await response.text();
  console.log('Upload response:', responseText);
  
  try {
    const result = JSON.parse(responseText);
    return result.upload_url;
  } catch (error) {
    throw new Error('Upload failed: ' + responseText);
  }
};

// Start transcription job
const startTranscription = async (audioUrl) => {
  const response = await fetch(`${ASSEMBLYAI_URL}/transcript`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${ASSEMBLYAI_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      language_code: 'en'
    })
  });

  const result = await response.json();
  return result.id;
};

// Check transcription status
const checkTranscription = async (transcriptId) => {
  const response = await fetch(`${ASSEMBLYAI_URL}/transcript/${transcriptId}`, {
    headers: {
      'authorization': `Bearer ${ASSEMBLYAI_API_KEY}`
    }
  });

  return await response.json();
};

// Main transcription function
export const transcribeAudioFile = async (audioPath) => {
  try {
    console.log('Starting AssemblyAI transcription for:', audioPath);

    // Step 1: Upload audio file
    const audioUrl = await uploadAudio(audioPath);
    console.log('Audio uploaded, URL:', audioUrl);

    // Step 2: Start transcription
    const transcriptId = await startTranscription(audioUrl);
    console.log('Transcription started, ID:', transcriptId);

    // Step 3: Poll for completion
    let transcript;
    while (true) {
      transcript = await checkTranscription(transcriptId);
      
      if (transcript.status === 'completed') {
        console.log('Transcription completed successfully');
        break;
      } else if (transcript.status === 'error') {
        throw new Error('Transcription failed: ' + transcript.error);
      }
      
      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Transcription status:', transcript.status);
    }

    return {
      text: transcript.text,
      confidence: transcript.confidence,
      duration: transcript.audio_duration,
      language: 'en',
      words: transcript.words || []
    };

  } catch (error) {
    console.error('AssemblyAI transcription error:', error);
    throw new Error('Failed to transcribe audio: ' + error.message);
  }
};