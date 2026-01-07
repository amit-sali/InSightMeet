import React from 'react';
import { Upload, FileText, Zap } from 'lucide-react';
import {Link} from 'react-router-dom'
const Hero = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#1DB954] opacity-[0.03] rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#1DB954]/10 border border-[#1DB954]/20 text-[#1DB954] px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Zap size={14} fill="currentColor" />
            <span>AI-Powered Transcription</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-black mb-6">
            From Lectures to <br />
            <span className="text-[#1DB954]">Perfect Notes.</span>
          </h1>

          {/* Subtext */}
          <p className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl leading-relaxed mb-10">
            Stop pausing and rewinding. Upload your audio or video lectures and 
            let <span className="font-bold text-black">InSightMeet</span> generate structured, 
            textual notes in seconds.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-4 px-10 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-[#1DB954]/20 uppercase tracking-wider">
             <Link to="/signup"> Start Converting Free</Link>
            </button>
            <button className="w-full sm:w-auto bg-transparent border-2 border-gray-200 hover:border-black text-black font-bold py-4 px-10 rounded-full transition-all duration-200">
              Watch Demo
            </button>
          </div>

          {/* Feature Grid / Social Proof */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 pt-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                <Upload className="text-[#1DB954]" />
              </div>
              <h3 className="font-bold text-lg mb-1">Upload</h3>
              <p className="text-gray-500 text-sm">Drop your MP4, MP3, or WAV files.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                <Zap className="text-[#1DB954]" />
              </div>
              <h3 className="font-bold text-lg mb-1">AI Process</h3>
              <p className="text-gray-500 text-sm">Whisper-level accuracy in minutes.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                <FileText className="text-[#1DB954]" />
              </div>
              <h3 className="font-bold text-lg mb-1">Get Notes</h3>
              <p className="text-gray-500 text-sm">Download as PDF, MD, or Notion docs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;