import React, { useState } from 'react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [downloadTriggered, setDownloadTriggered] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadZip = () => {
    // Generate simulated zip/json bundle for EzehFlow extension
    const manifestContent = {
      name: 'EzehFlow — Automatización de Google Flow',
      version: '1.4.0',
      manifest_version: 3,
      description:
        'Automatiza la creación y descarga secuencial de imágenes y videos dentro de Google Flow (labs.google y flow.google.com).',
      side_panel: {
        default_path: 'sidepanel.html',
      },
      permissions: ['sidePanel', 'downloads', 'storage', 'activeTab'],
      host_permissions: ['https://labs.google/*', 'https://flow.google.com/*'],
    };

    const blob = new Blob([JSON.stringify(manifestContent, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ezehflow-extension-manifest.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadTriggered(true);
    setTimeout(() => setDownloadTriggered(false), 4000);
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

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white font-black text-sm">
            EF
          </div>
          <div>
            <h3 id="modal-title" className="text-lg font-bold text-white">
              Instalación de EzehFlow
            </h3>
            <p className="text-xs text-zinc-400">Extensión de panel lateral para Google Chrome</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 mb-6 leading-relaxed">
          Sigue estos sencillos pasos para activar EzehFlow en tu navegador y automatizar tus sesiones creativas en Google Flow:
        </p>

        {/* Steps */}
        <div className="space-y-3.5 mb-6 text-xs sm:text-sm text-zinc-300">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="font-mono text-red-500 font-bold">1.</span>
            <div>
              <span className="font-semibold text-white block">Descarga el paquete de la extensión</span>
              <span className="text-zinc-400 text-xs">
                Obtén el archivo de configuración y scripts listo para cargar.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="font-mono text-red-500 font-bold">2.</span>
            <div>
              <span className="font-semibold text-white block">Abre las extensiones de Chrome</span>
              <span className="text-zinc-400 text-xs">
                Dirígete a <code className="text-red-400 font-mono">chrome://extensions</code> y activa el <strong>Modo de desarrollador</strong> arriba a la derecha.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="font-mono text-red-500 font-bold">3.</span>
            <div>
              <span className="font-semibold text-white block">Carga y fija el panel lateral</span>
              <span className="text-zinc-400 text-xs">
                Haz clic en "Cargar descomprimida" y abre <strong className="text-white">labs.google</strong> o <strong className="text-white">flow.google.com</strong>.
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleDownloadZip}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-500 active:scale-95 transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
          >
            <span>{downloadTriggered ? '✓ Descarga iniciada' : 'Descargar Archivo de la Extensión'}</span>
          </button>

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
