import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link,useNavigate } from "react-router-dom";


const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu size={24} className="text-black" />
          </button>

          <div className="text-2xl font-bold tracking-tighter text-black">
            <Link to="/">
              InSightMeet
              <span className="text-[#1DB954]">.</span>
            </Link>
          </div>
        </div>

        <div>
          <button className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-2 px-6 md:py-3 md:px-8 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 uppercase tracking-wider text-xs md:text-sm"
           onClick={()=> navigate('/login')}>
             Log in
          </button>
        </div>
      </nav>

      {/* --- SIDEBAR OVERLAY --- */}
      {/* Change: Added a transition for opacity and ensured 
          pointer-events are disabled when closed 
      */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      />

      {/* --- SIDEBAR DRAWER --- */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <span className="font-bold text-xl">Menu</span>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-5">

            <Link
              to="/"
              className="text-lg font-medium hover:text-[#1DB954] transition-colors"
            >
              Home
            </Link>

            <Link
              to="/dashboard"
              className="text-lg font-medium hover:text-[#1DB954] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/notes-generator"
              className="text-lg font-medium hover:text-[#1DB954] transition-colors"
            >
              Generate Notes
            </Link>

            <Link
              to="/mynotes"
              className="text-lg font-medium hover:text-[#1DB954] transition-colors"
            >
              My Notes
            </Link>
            <a
              href="#"
              className="text-lg font-medium hover:text-[#1DB954] transition-colors"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-lg font-medium hover:text-[#1DB954] transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">© 2026 InSightMeet</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
