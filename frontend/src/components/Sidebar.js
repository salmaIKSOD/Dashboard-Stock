import { useState } from 'react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton hamburger pour mobile/tablette */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar avec overlay sur mobile */}
      <div className={`
        fixed md:relative z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        w-64 md:w-48
        bg-gray-800 text-white h-screen
        flex flex-col gap-4
      `}>
        {/* Espace pour le bouton sur mobile */}
        <div className="h-16 md:hidden"></div>
        
        <h1 className="text-base md:text-lg font-bold border-b border-gray-600 pb-2 px-4 md:px-0">
          imrasoft SAGE
        </h1>
        <nav className="flex flex-col gap-2 text-xs md:text-sm px-4 md:px-0">
          <a href="#" className="bg-gray-700 rounded px-3 py-2 hover:bg-gray-600 transition-colors">
            📊 Tableau de bord
          </a>
        </nav>
      </div>

      {/* Overlay pour fermer la sidebar sur mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}