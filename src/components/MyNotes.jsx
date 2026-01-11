import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Trash2, Calendar, Clock, FileAudio, FileVideo, RefreshCw, LogOut, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // Fetch user's notes on component mount
  useEffect(() => {
    fetchMyNotes();
  }, []);

  const fetchMyNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/v1/notes/my-notes', {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setNotes(result.data);
      } else {
        setError(result.message || 'Failed to fetch notes');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMyNotes();
    setRefreshing(false);
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/notes/${noteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setNotes(notes.filter(note => note._id !== noteId));
      } else {
        setError(result.message || 'Failed to delete note');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading your notes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 p-4 md:p-10">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tighter text-black">
              My Notes<span className="text-[#1DB954]">.</span>
            </h1>
            <p className="text-gray-500 text-sm">
              {notes.length} AI-generated notes • Total insights from your lectures
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] hover:bg-[#1DB954]/90 text-white rounded-full transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button 
              onClick={() => navigate('/notes-generator')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
            >
              <Plus size={16} />
              New Note
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Empty State */}
        {notes.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-[#1DB954]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="text-[#1DB954]" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No notes yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Upload your first audio or video file to generate AI-powered notes and start building your knowledge library.
            </p>
            <button
              onClick={() => navigate('/notes-generator')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1DB954] hover:bg-[#1DB954]/90 text-white rounded-full font-medium transition-colors"
            >
              <Plus size={20} />
              Create Your First Note
            </button>
          </div>
        ) : (
          /* Notes Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div key={note._id} className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Card Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {note.sourceType === 'video' ? (
                        <FileVideo className="text-purple-500" size={18} />
                      ) : (
                        <FileAudio className="text-[#1DB954]" size={18} />
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        note.sourceType === 'video' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-[#1DB954]/10 text-[#1DB954]'
                      }`}>
                        {note.sourceType.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                    {note.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <FileText size={14} />
                      <span>{note.originalFilename}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>{note.duration}s • {note.wordCount} words</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <a
                      href={note.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1DB954] hover:bg-[#1DB954]/90 text-white text-sm rounded-xl font-medium transition-colors"
                    >
                      <Eye size={16} />
                      View
                    </a>
                    <a
                      href={note.pdfUrl}
                      download={`${note.title}.pdf`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-xl font-medium transition-colors"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                </div>

                {/* File Size Badge */}
                <div className="px-6 pb-4">
                  <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full inline-block">
                    {(note.fileSize / 1024).toFixed(1)} KB • {note.aiModel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNotes;