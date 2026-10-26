import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-zinc-900 py-12 text-zinc-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-red-600 text-white font-black text-xs">
              EF
            </div>
            <span className="font-bold text-sm text-white tracking-tight">EzehFlow</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">Automatización de Google Flow</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a href="#modos" className="hover:text-white transition-colors">
              Modos
            </a>
            <a href="#modelos" className="hover:text-white transition-colors">
              Modelos
            </a>
            <a href="#simulador" className="hover:text-white transition-colors">
              Simulador
            </a>
            <a href="#formateador" className="hover:text-white transition-colors">
              Formateador
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              Preguntas
            </a>
          </div>

          {/* Legal */}
          <div className="text-zinc-500 text-[11px] font-mono">
            © {new Date().getFullYear()} EzehFlow. Compatible con labs.google & flow.google.com.
          </div>
        </div>
      </div>
    </footer>
  );
};
