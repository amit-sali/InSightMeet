import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Loader2, Download, Eye, FileVideo, Music, Mic, Brain, FileDown } from 'lucide-react';

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
    setTranscriptionResult(null);
    setNotesResult(null);
    setPdfResult(null);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('mediaFile', selectedFile);

      const response = await fetch('http://localhost:8000/api/v1/media/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadResult(result.data);
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle transcription
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

  // Handle AI notes generation
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
        credentials: 'include',
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* LEFT: UPLOAD & PROCESSING SECTION */}
      <div className="space-y-6">
        {/* File Upload Area */}
        <div 
          className={`relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center bg-white 
            ${selectedFile ? 'border-[#1DB954] bg-[#1DB954]/5' : 'border-gray-200 hover:border-[#1DB954]'}`}
        >
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleFileSelect}
            accept="video/*,audio/*"
          />
          
          <div className="w-16 h-16 bg-[#1DB954]/10 rounded-full flex items-center justify-center mb-4">
            {selectedFile ? (
              selectedFile.type.startsWith('video/') ? 
                <FileVideo className="text-[#1DB954]" size={32} /> :
                <Music className="text-[#1DB954]" size={32} />
            ) : (
              <Upload className="text-[#1DB954]" size={32} />
            )}
          </div>
          
          <h3 className="text-lg font-bold text-black mb-1">
            {selectedFile ? selectedFile.name : "Click or drag media file"}
          </h3>
          <p className="text-gray-400 text-sm text-center">
            Supports MP4, MOV, MP3, WAV and other media files
          </p>
          
          {selectedFile && (
            <div className="mt-4 text-sm text-gray-600 bg-white/80 px-3 py-2 rounded-full">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
            </div>
          )}
        </div>

        {/* Upload Button */}
        {selectedFile && !uploadResult && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full py-3 px-6 rounded-2xl font-medium transition-all ${
              uploading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#1DB954] hover:bg-[#1DB954]/90 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Uploading...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Upload size={20} />
                Upload File
              </div>
            )}
          </button>
        )}

        {/* Processing Steps */}
        {uploadResult && (
          <div className="space-y-4">
            {/* Step 1: Transcription */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transcriptionResult ? 'bg-[#1DB954] text-white' : 'bg-gray-100'
                  }`}>
                    {transcribing ? <Loader2 className="animate-spin" size={16} /> : <Mic size={16} />}
                  </div>
                  <span className="font-medium">Speech to Text</span>
                </div>
                {!transcriptionResult && !transcribing && (
                  <button
                    onClick={handleTranscribeAudio}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium"
                  >
                    Start
                  </button>
                )}
              </div>
              {transcribing && (
                <p className="text-sm text-gray-600">Converting audio to text...</p>
              )}
              {transcriptionResult && (
                <div className="text-sm text-gray-600">
                  ✅ Transcription complete • {transcriptionResult.wordCount} words
                </div>
              )}
            </div>

            {/* Step 2: AI Notes */}
            {transcriptionResult && (
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notesResult ? 'bg-[#1DB954] text-white' : 'bg-gray-100'
                    }`}>
                      {generatingNotes ? <Loader2 className="animate-spin" size={16} /> : <Brain size={16} />}
                    </div>
                    <span className="font-medium">AI Notes Generation</span>
                  </div>
                  {!notesResult && !generatingNotes && (
                    <button
                      onClick={handleGenerateNotes}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-medium"
                    >
                      Generate
                    </button>
                  )}
                </div>
                {generatingNotes && (
                  <p className="text-sm text-gray-600">AI is creating structured notes...</p>
                )}
                {notesResult && (
                  <div className="text-sm text-gray-600">
                    ✅ Notes generated • {notesResult.wordCount} words • {notesResult.model}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: PDF Generation */}
            {notesResult && (
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      pdfResult ? 'bg-[#1DB954] text-white' : 'bg-gray-100'
                    }`}>
                      {generatingPDF ? <Loader2 className="animate-spin" size={16} /> : <FileDown size={16} />}
                    </div>
                    <span className="font-medium">PDF Generation</span>
                  </div>
                  {!pdfResult && !generatingPDF && (
                    <button
                      onClick={handleGeneratePDF}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium"
                    >
                      Create PDF
                    </button>
                  )}
                </div>
                {generatingPDF && (
                  <p className="text-sm text-gray-600">Creating PDF document...</p>
                )}
                {pdfResult && (
                  <div className="text-sm text-gray-600">
                    ✅ PDF created • {(pdfResult.size / 1024).toFixed(1)} KB • Saved to your notes
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: RESULT AREA */}
      <div className="flex flex-col">
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex-1 min-h-[500px] flex flex-col">
          {/* Toolbar */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="text-gray-400" size={18} />
              <span className="text-sm font-bold uppercase tracking-widest text-gray-500">
                {pdfResult ? 'Generated PDF' : notesResult ? 'AI Notes Preview' : transcriptionResult ? 'Transcript' : 'Results'}
              </span>
            </div>
            {pdfResult && (
              <div className="flex gap-2">
                <a
                  href={pdfResult.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1DB954] hover:bg-[#1DB954]/10 p-2 rounded-full transition-colors"
                >
                  <Eye size={20} />
                </a>
                <a
                  href={pdfResult.pdfUrl}
                  download
                  className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors"
                >
                  <Download size={20} />
                </a>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center overflow-y-auto">
            {!transcriptionResult && !transcribing && !uploading && (
              <div className="text-gray-300">
                <FileText size={64} className="mx-auto mb-4 opacity-20" />
                <p>Upload a file to start the AI processing</p>
              </div>
            )}

            {(uploading || transcribing || generatingNotes || generatingPDF) && (
              <div className="space-y-4 w-full max-w-md">
                <div className="h-4 bg-gray-100 rounded-full w-3/4 animate-pulse mx-auto"></div>
                <div className="h-4 bg-gray-100 rounded-full w-full animate-pulse mx-auto"></div>
                <div className="h-4 bg-gray-100 rounded-full w-5/6 animate-pulse mx-auto"></div>
                <p className="text-sm text-gray-500 mt-4">
                  {uploading && 'Uploading file...'}
                  {transcribing && 'Converting speech to text...'}
                  {generatingNotes && 'AI is analyzing and creating notes...'}
                  {generatingPDF && 'Generating PDF document...'}
                </p>
              </div>
            )}

            {transcriptionResult && !notesResult && (
              <div className="w-full h-full text-left">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 h-full overflow-y-auto">
                  <div className="flex items-center gap-2 text-blue-500 mb-4">
                    <CheckCircle2 size={18} />
                    <span className="text-xs font-bold uppercase">Transcription Complete</span>
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {transcriptionResult.transcript}
                  </div>
                  <div className="mt-4 text-xs text-gray-400">
                    Duration: {transcriptionResult.duration}s • Words: {transcriptionResult.wordCount}
                  </div>
                </div>
              </div>
            )}

            {notesResult && !pdfResult && (
              <div className="w-full h-full text-left">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 h-full overflow-y-auto">
                  <div className="flex items-center gap-2 text-purple-500 mb-4">
                    <CheckCircle2 size={18} />
                    <span className="text-xs font-bold uppercase">AI Notes Generated</span>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {notesResult.structuredNotes}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {pdfResult && (
              <div className="w-full">
                <div className="bg-[#1DB954]/5 border border-[#1DB954]/20 rounded-xl p-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-[#1DB954] mb-4">
                    <CheckCircle2 size={24} />
                    <span className="text-lg font-bold">Success!</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pdfResult.title}</h3>
                  <p className="text-gray-600 mb-6">
                    Your AI-generated notes have been created and saved to your dashboard.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <a
                      href={pdfResult.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-[#1DB954] hover:bg-[#1DB954]/90 text-white rounded-xl font-medium transition-colors"
                    >
                      <Eye size={20} />
                      View PDF
                    </a>
                    <a
                      href={pdfResult.pdfUrl}
                      download
                      className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                    >
                      <Download size={20} />
                      Download
                    </a>
                  </div>
                  <p className="mt-4 text-xs text-gray-500">
                    📚 Access this note anytime from "My Notes" dashboard
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;