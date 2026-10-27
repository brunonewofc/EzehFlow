import React from 'react';

interface HeroProps {
  onInstallClick: () => void;
  onScrollToSimulator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onInstallClick, onScrollToSimulator }) => {
  return (
    <section className="relative overflow-hidden bg-black pt-12 pb-20 md:pt-20 md:pb-32 border-b border-zinc-900">
      {/* Subtle crimson radial glow backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-red-600/15 blur-[120px] rounded-full"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Proposition and Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Clean unboxed text kicker */}
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-4">
              Extensión de Panel Lateral para Chrome
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 [text-wrap:balance]">
              Automatización de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-rose-400">
                Google Flow
              </span>{' '}
              en una única cola
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mb-8">
              <strong className="text-white font-semibold">EzehFlow</strong> automatiza la creación y descarga secuencial de imágenes y videos dentro de Google Flow (<span className="text-zinc-100 font-mono text-sm">labs.google</span> y <span className="text-zinc-100 font-mono text-sm">flow.google.com</span>). Escribe tus prompts separados por una línea en blanco, calibra tus parámetros y deja que la extensión genere y descargue cada resultado en orden, uno tras otro.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                onClick={onScrollToSimulator}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-white bg-red-600 hover:bg-red-500 active:scale-95 rounded-xl transition-all shadow-xl shadow-red-600/30 flex items-center justify-center gap-2.5"
              >
                <span>Probar Simulador de Cola</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              <button
                onClick={onInstallClick}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-zinc-200 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Descargar Extensión</span>
                <span className="text-zinc-400 text-xs">v1.0.0</span>
              </button>
            </div>

            {/* Clean unboxed metadata indicators with dot separators (Zero-Pill discipline) */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-400 pt-2 border-t border-zinc-900 w-full">
              <span className="text-zinc-300">labs.google & flow.google.com</span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span>Nano Banana 2 / Lite / Pro</span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span>Veo 3.1 & Omni Flash</span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span className="text-red-400 font-medium">Resolución hasta 4K</span>
            </div>
          </div>

          {/* Right Column: Visual Anchor */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto rounded-2xl border border-zinc-800/90 bg-zinc-950/80 p-2 shadow-2xl shadow-red-950/20 group">
              <div className="relative overflow-hidden rounded-xl bg-zinc-900 aspect-[16/9] border border-zinc-800/60">
                <img
                  src="/src/assets/images/ezehflow_hero_creative_1793043095489.jpg"
                  alt="EzehFlow visualización de interfaz y procesamiento secuencial para Google Flow"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback in case asset load fails
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Fallback scrim and details overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
                  <span className="font-mono text-zinc-400">Google Flow Sidepanel Sync</span>
                  <span className="text-red-400 font-mono font-semibold">COLA ACTIVA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
