import React from "react";
import Card from "./Card";
import Newnote from "./Newnote";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Trash2,
  ExternalLink,
} from "lucide-react";



const MyNotes = () => {
  // Mock data - in a real app, this would come from your Firebase/MongoDB
  const notes = [
    {
      id: 1,
      title: "Neural Networks Lecture 01",
      date: "Jan 05, 2026",
      duration: "45:20",
      size: "1.2 MB",
    },
    {
      id: 2,
      title: "Operating Systems - Process Sync",
      date: "Jan 03, 2026",
      duration: "32:15",
      size: "850 KB",
    },
    {
      id: 3,
      title: "Database Management Systems",
      date: "Dec 28, 2025",
      duration: "58:40",
      size: "2.1 MB",
    },
    {
      id: 4,
      title: "Full Stack Development Intro",
      date: "Dec 20, 2025",
      duration: "1:12:05",
      size: "3.4 MB",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tighter text-black">
              My Notes<span className="text-[#1DB954]">.</span>
            </h1>
            <p className="text-gray-500 text-sm">
              Access and download all your generated lecture notes.
            </p>
          </div>

          <div className="flex gap-2">
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-4 py-2 rounded-full">
              Total: {notes.length} Notes
            </span>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card notes={notes} />

          {/* Empty State / Add New Card */}
          <Newnote />
        </div>
      </div>
    </div>
  );
};

export default MyNotes;
