import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

// Set FFmpeg path explicitly (Windows fix)
ffmpeg.setFfmpegPath('C:\\ffmpeg\\bin\\ffmpeg.exe');

// Extract audio from video file
export const extractAudio = (videoPath, outputDir = './uploads/audio') => {
  return new Promise((resolve, reject) => {
    // Create audio directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate output filename
    const inputFileName = path.basename(videoPath, path.extname(videoPath));
    const outputPath = path.join(outputDir, `${inputFileName}.wav`);

    // Use FFmpeg to extract audio
    ffmpeg(videoPath)
      .toFormat('wav') // Convert to WAV format (good for speech-to-text)
      .audioCodec('pcm_s16le') // Standard audio codec
      .audioChannels(1) // Mono audio (reduces file size)
      .audioFrequency(16000) // 16kHz sample rate (optimal for speech)
      .on('start', (commandLine) => {
        console.log('FFmpeg started:', commandLine);
      })
      .on('progress', (progress) => {
        console.log('Processing: ' + progress.percent + '% done');
      })
      .on('end', () => {
        console.log('Audio extraction completed');
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        reject(err);
      })
      .save(outputPath);
  });
};

// Check if file is video
export const isVideoFile = (mimetype) => {
  return mimetype.startsWith('video/');
};

// Check if file is audio
export const isAudioFile = (mimetype) => {
  return mimetype.startsWith('audio/');
};