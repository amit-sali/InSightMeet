import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Loader2, Download, FileVideo, Music, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const navigate = useNavigate();
//Logout funtionality 917218
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        alert('Logged out successfully!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login'); // Redirect anyway
    }
  };

  // Simulate File Upload
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile();
    }
  };

  // Simulate Backend Processing
  const processFile = () => {
    setIsProcessing(true);
    setIsGenerated(false);
    setTimeout(() => {
      setIsProcessing(false);
      setIsGenerated(true);
    }, 3000); // 3-second simulation
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-10">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tighter text-black">
              My Lectures<span className="text-[#1DB954]">.</span>
            </h1>
            <p className="text-gray-500 text-sm">Upload audio or video to generate AI notes.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: UPLOAD SECTION */}
          <div className="space-y-6">
            <div 
              className={`relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center bg-white 
                ${file ? 'border-[#1DB954] bg-[#1DB954]/5' : 'border-gray-200 hover:border-[#1DB954]'}`}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileUpload}
                accept="video/*,audio/*"
              />
              
              <div className="w-16 h-16 bg-[#1DB954]/10 rounded-full flex items-center justify-center mb-4">
                <Upload className="text-[#1DB954]" size={32} />
              </div>
              
              <h3 className="text-lg font-bold text-black mb-1">
                {file ? file.name : "Click or drag lecture file"}
              </h3>
              <p className="text-gray-400 text-sm text-center">
                Supports MP4, MOV, MP3, and WAV files
              </p>
            </div>

            {/* Status Indicator */}
            {isProcessing && (
              <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <Loader2 className="text-[#1DB954] animate-spin" size={20} />
                <span className="text-sm font-medium">AI is analyzing your lecture...</span>
              </div>
            )}
          </div>

          {/* RIGHT: PDF RESULT AREA */}
          <div className="flex flex-col">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex-1 min-h-[400px] flex flex-col">
              {/* Toolbar */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="text-gray-400" size={18} />
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Generated Notes</span>
                </div>
                {isGenerated && (
                  <button className="text-[#1DB954] hover:bg-[#1DB954]/10 p-2 rounded-full transition-colors">
                    <Download size={20} />
                  </button>
                )}
              </div>

              {/* PDF Content Placeholder */}
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                {!isGenerated && !isProcessing && (
                  <div className="text-gray-300">
                    <FileText size={64} className="mx-auto mb-4 opacity-20" />
                    <p>Your generated PDF will appear here</p>
                  </div>
                )}

                {isProcessing && (
                  <div className="space-y-4 w-full">
                    <div className="h-4 bg-gray-100 rounded-full w-3/4 animate-pulse mx-auto"></div>
                    <div className="h-4 bg-gray-100 rounded-full w-full animate-pulse mx-auto"></div>
                    <div className="h-4 bg-gray-100 rounded-full w-5/6 animate-pulse mx-auto"></div>
                  </div>
                )}

                {isGenerated && (
                  <div className="w-full h-full">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-left h-full overflow-y-auto">
                       <div className="flex items-center gap-2 text-[#1DB954] mb-4">
                         <CheckCircle2 size={18} />
                         <span className="text-xs font-bold uppercase">Success: Transcription Complete</span>
                       </div>
                       <h2 className="text-xl font-bold mb-4 border-b pb-2">Lecture Summary</h2>
                       <p className="text-gray-600 text-sm leading-relaxed mb-4">
                         This is a preview of your generated notes. In a real application, 
                         you would embed an iframe here or use a library like <code>react-pdf</code> 
                         to render the actual blob from your backend.
                       </p>
                       <ul className="space-y-2 text-sm text-gray-600">
                         <li>• Key Concept 1: AI Data Processing</li>
                         <li>• Key Concept 2: Neural Network Architectures</li>
                         <li>• Key Concept 3: Backpropagation Techniques</li>
                       </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;