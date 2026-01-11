import React from 'react';
import MediaUpload from '../components/MediaUploadNew';

const NotesGenerator = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          AI Notes Generator
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Upload your audio or video file to generate AI-powered notes
        </p>
        
        <MediaUpload />
      </div>
    </div>
  );
};

export default NotesGenerator;