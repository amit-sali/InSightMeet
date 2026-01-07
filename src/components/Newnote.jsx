import React from 'react'

const Newnote = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <button className="border-2 border-dashed border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:border-[#1DB954] hover:bg-gray-50 transition-all text-gray-400 hover:text-[#1DB954]">
            <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center">
              <span className="text-2xl font-light">+</span>
            </div>
            <span className="font-bold text-sm">New Lecture</span>
          </button>
    </div>
  )
}

export default Newnote