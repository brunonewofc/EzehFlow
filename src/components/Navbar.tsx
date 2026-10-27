import React from 'react';

interface NavbarProps {
  onInstallClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onInstallClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="text-lg font-bold tracking-tight text-white hover:text-red-400 transition-colors whitespace-nowrap shrink-0">
          EzehFlow
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
          <a href="#modos" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Modos
          </a>
          <a href="#modelos" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Modelos
          </a>
          <a href="#simulador" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Simulador
          </a>
          <a href="#formateador" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Formateador
          </a>
          <a href="#faq" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Preguntas
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://drive.google.com/file/d/1w-sM6ZEZqDZ5iMzE9gtjBqF2nNz37uwn/view"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 active:scale-95 rounded-lg transition-all shadow-lg shadow-red-600/25 whitespace-nowrap shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="21.17" y1="8" x2="12" y2="8" />
              <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
              <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
            </svg>
            <span>Descargar Extensión</span>
          </a>
        </div>
      </div>
    </header>
  );
};
