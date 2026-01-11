import React, { useState } from 'react';

const BrowserTranscription = ({ audioFile, onTranscriptionComplete }) => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const startTranscription = () => {
    // Check if browser supports Speech Recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    setIsTranscribing(true);
    setError(null);
    setTranscript('');

    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';

    recognition.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onend = () => {
      setIsTranscribing(false);
      if (finalTranscript.trim()) {
        onTranscriptionComplete({
          text: finalTranscript.trim(),
          wordCount: finalTranscript.trim().split(' ').length,
          language: 'en-US',
          method: 'browser'
        });
      }
    };

    recognition.onerror = (event) => {
      setError('Speech recognition error: ' + event.error);
      setIsTranscribing(false);
    };

    // Start recognition
    recognition.start();
  };

  const stopTranscription = () => {
    setIsTranscribing(false);
  };

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Speech-to-Text (Browser)</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Click "Start Recording" and speak into your microphone
        </p>
        
        <button
          onClick={startTranscription}
          disabled={isTranscribing}
          className={`px-4 py-2 rounded mr-2 ${
            isTranscribing 
              ? 'bg-red-500 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isTranscribing ? 'Recording...' : 'Start Recording'}
        </button>

        {isTranscribing && (
          <button
            onClick={stopTranscription}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Stop Recording
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {transcript && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <h4 className="font-medium mb-2">Live Transcript:</h4>
          <p className="text-sm">{transcript}</p>
        </div>
      )}

      <div className="text-xs text-gray-500">
        Note: This uses your browser's speech recognition. Works best in Chrome/Edge.
      </div>
    </div>
  );
};

export default BrowserTranscription;