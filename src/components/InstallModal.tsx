import React, { useState } from 'react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [downloadTriggered, setDownloadTriggered] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadClick = () => {
    setDownloadTriggered(true);
    setTimeout(() => setDownloadTriggered(false), 5000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-5 right-5 text-zinc-400 hover:text-white text-sm p-1 rounded-lg hover:bg-zinc-900 transition-colors"
        >
          ✕
        </button>

        <div className="mb-4">
          <h3 id="modal-title" className="text-lg font-bold text-white">
            Descargar EzehFlow
          </h3>
          <p className="text-xs text-zinc-400">Extensión oficial para Google Chrome · v1.0.0</p>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 mb-6 leading-relaxed">
          Haz clic en el botón inferior para descargar el paquete <code className="text-red-400 font-mono">ezehflow-1.0.0.zip</code> e instálalo en tu navegador:
        </p>

        {/* Steps */}
        <div className="space-y-3.5 mb-6 text-xs sm:text-sm text-zinc-300">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="font-mono text-red-500 font-bold">1.</span>
            <div>
              <span className="font-semibold text-white block">Descarga y descomprime el archivo ZIP</span>
              <span className="text-zinc-400 text-xs">
                Descarga el archivo <code className="text-zinc-300 font-mono">ezehflow-1.0.0.zip</code> y extrae su contenido en una carpeta local.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="font-mono text-red-500 font-bold">2.</span>
            <div>
              <span className="font-semibold text-white block">Abre las extensiones de Chrome</span>
              <span className="text-zinc-400 text-xs">
                Accede a <code className="text-red-400 font-mono">chrome://extensions</code> y activa la casilla <strong>Modo de desarrollador</strong> arriba a la derecha.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="font-mono text-red-500 font-bold">3.</span>
            <div>
              <span className="font-semibold text-white block">Cargar descomprimida</span>
              <span className="text-zinc-400 text-xs">
                Pulsa en <strong>"Cargar descomprimida"</strong>, selecciona la carpeta extraída y abre <strong className="text-white">flow.google.com</strong> o <strong className="text-white">labs.google</strong>.
              </span>
            </div>
          </div>
        </div>

        {/* Action Button - Direct Native Download of the provided ZIP */}
        <div className="space-y-3">
          <a
            href="https://drive.google.com/file/d/1w-sM6ZEZqDZ5iMzE9gtjBqF2nNz37uwn/view"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-500 active:scale-95 transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Descargar desde Google Drive</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
