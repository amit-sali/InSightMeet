import React from "react";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Trash2,
  ExternalLink,
} from "lucide-react";

const Card = (props) => {

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {props.notes.map((note) => (
          <div
            key={note.id}
            className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-[#1DB954]/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#1DB954]/10 rounded-2xl flex items-center justify-center text-[#1DB954]">
                <FileText size={24} />
              </div>
              <button className="text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>

            <h3 className="font-bold text-lg text-black mb-1 truncate group-hover:text-[#1DB954] transition-colors">
              {note.title}
            </h3>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Calendar size={14} />
                <span>{note.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Clock size={14} />
                <span>Recording: {note.duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex-1 bg-black text-white text-xs font-bold py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                <ExternalLink size={14} />
                View
              </button>
              <button className="w-12 h-12 bg-[#1DB954] text-white rounded-full flex items-center justify-center hover:bg-[#1ed760] transition-all shadow-lg shadow-[#1DB954]/20">
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Card;
