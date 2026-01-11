import React, { useState } from 'react';
import BrowserTranscription from './BrowserTranscription';

const MediaUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState(null);
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [notesResult, setNotesResult] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfResult, setPdfResult] = useState(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setError(null);
    setUploadResult(null);
  };

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    if (!notesResult?.structuredNotes) {
      setError('No structured notes available for PDF generation');
      return;
    }

    setGeneratingPDF(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/media/create-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          structuredNotes: notesResult.structuredNotes,
          originalFilename: selectedFile?.name || 'audio',
          duration: transcriptionResult?.duration || 0,
          wordCount: notesResult.wordCount || 0,
          sourceType: selectedFile?.type?.startsWith('video/') ? 'video' : 'audio'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPdfResult(result.data);
      } else {
        setError(result.message || 'PDF generation failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setGeneratingPDF(false);
    }
  };
  const handleGenerateNotes = async () => {
    if (!transcriptionResult?.transcript) {
      setError('No transcript available for notes generation');
      return;
    }

    setGeneratingNotes(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/media/generate-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcriptionResult.transcript
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNotesResult(result.data);
      } else {
        setError(result.message || 'Notes generation failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setGeneratingNotes(false);
    }
  };
  const handleTranscribeAudio = async () => {
    if (!uploadResult?.audioPath) {
      setError('No audio file to transcribe');
      return;
    }

    setTranscribing(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/media/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioPath: uploadResult.audioPath
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTranscriptionResult(result.data);
      } else {
        setError(result.message || 'Transcription failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setTranscribing(false);
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Create FormData to send file
      const formData = new FormData();
      formData.append('mediaFile', selectedFile);

      // Send to backend
      const response = await fetch('http://localhost:8000/api/v1/media/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadResult(result.data);
        setSelectedFile(null);
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Media File</h2>
      
      {/* File Input */}
      <div className="mb-4">
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileSelect}
          className="w-full p-2 border border-gray-300 rounded"
          disabled={uploading}
        />
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <p><strong>File:</strong> {selectedFile.name}</p>
          <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <p><strong>Type:</strong> {selectedFile.type}</p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className={`w-full py-2 px-4 rounded font-medium ${
          !selectedFile || uploading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Success Message & Transcribe Button */}
      {uploadResult && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p><strong>Upload Successful!</strong></p>
          <p>File: {uploadResult.originalName}</p>
          <p>Size: {(uploadResult.size / 1024 / 1024).toFixed(2)} MB</p>
          
          <button
            onClick={handleTranscribeAudio}
            disabled={transcribing}
            className={`mt-3 px-4 py-2 rounded font-medium ${
              transcribing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {transcribing ? 'Transcribing...' : 'Extract Text from Audio'}
          </button>
        </div>
      )}

      {/* Transcription Result */}
      {transcriptionResult && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold mb-2">Audio Transcription Complete!</h3>
          <div className="bg-white p-3 rounded border mb-3">
            <p className="text-sm mb-2"><strong>Extracted Text:</strong></p>
            <p className="text-gray-800 text-sm max-h-32 overflow-y-auto">{transcriptionResult.transcript}</p>
          </div>
          <div className="mb-3 text-sm text-gray-600">
            <p><strong>Duration:</strong> {transcriptionResult.duration}s</p>
            <p><strong>Word Count:</strong> {transcriptionResult.wordCount}</p>
            <p><strong>Language:</strong> {transcriptionResult.language}</p>
          </div>
          
          <button
            onClick={handleGenerateNotes}
            disabled={generatingNotes}
            className={`px-4 py-2 rounded font-medium ${
              generatingNotes
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {generatingNotes ? 'Generating AI Notes...' : 'Generate Structured Notes'}
          </button>
        </div>
      )}

      {/* AI Notes Result */}
      {notesResult && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold mb-2">AI Structured Notes Generated!</h3>
          <div className="bg-white p-4 rounded border mb-3">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm max-h-40 overflow-y-auto">{notesResult.structuredNotes}</pre>
            </div>
          </div>
          <div className="mb-3 text-sm text-gray-600">
            <p><strong>Word Count:</strong> {notesResult.wordCount}</p>
            <p><strong>Model:</strong> {notesResult.model}</p>
            <p><strong>Generated:</strong> {new Date(notesResult.processedAt).toLocaleString()}</p>
          </div>
          
          <button
            onClick={handleGeneratePDF}
            disabled={generatingPDF}
            className={`px-4 py-2 rounded font-medium ${
              generatingPDF
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {generatingPDF ? 'Generating PDF...' : 'Create PDF Document'}
          </button>
        </div>
      )}

      {/* PDF Result */}
      {pdfResult && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="font-semibold mb-2">PDF Generated & Saved Successfully!</h3>
          <div className="mb-3 text-sm text-gray-600">
            <p><strong>Note ID:</strong> {pdfResult.noteId}</p>
            <p><strong>Title:</strong> {pdfResult.title}</p>
            <p><strong>Size:</strong> {(pdfResult.size / 1024).toFixed(2)} KB</p>
            <p><strong>Generated:</strong> {new Date(pdfResult.generatedAt).toLocaleString()}</p>
          </div>
          
          <div className="flex gap-2">
            <a
              href={pdfResult.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium"
            >
              View PDF
            </a>
            <a
              href={pdfResult.pdfUrl}
              download
              className="inline-block px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-medium"
            >
              Download PDF
            </a>
          </div>
          
          <p className="mt-2 text-xs text-gray-500">
            💾 Note saved to your dashboard - access it anytime from "My Notes"
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;