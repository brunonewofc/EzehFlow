import React from 'react';

export const ModelsMatrix: React.FC = () => {
  return (
    <section id="modelos" className="py-20 bg-black border-b border-zinc-900 scroll-mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">
            Compatibilidad y Formatos
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 [text-wrap:balance]">
            Control total de modelos, resoluciones y aspectos
          </h2>
          <p className="text-zinc-400 max-w-2xl text-sm sm:text-base leading-relaxed">
            EzehFlow se enlaza directamente con los selectores nativos de Google Flow permitiendo que configures parámetros globales que se aplican a cada uno de los prompts de tu cola.
          </p>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Card 1: Modelos de Imagen (Nano Banana Suite) */}
          <div className="lg:col-span-6 bg-zinc-950 rounded-2xl border border-zinc-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider">
                  Motor de Imagen
                </span>
                <span className="text-xs font-mono text-zinc-400">labs.google / flow</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Familia Nano Banana</h3>
              <p className="text-xs text-zinc-400 mb-6">
                Selección directa en el panel lateral para producciones de alta fidelidad o iteraciones rápidas.
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">Nano Banana 2</span>
                    <span className="text-[10px] font-mono text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-900">
                      Balance Recomendado
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Equilibrio perfecto entre velocidad de renderizado y precisión de composición para lotes extensos.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">Nano Banana 2 Lite</span>
                    <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
                      Ultra Rápido
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Ideal para prototipado rápido de conceptos y validación de cientos de ideas en minutos.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">Nano Banana Pro</span>
                    <span className="text-[10px] font-mono text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                      Máximo Detalle
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Fidelidad extrema en texturas, iluminación compleja y renderizado de microdetalles para impresión y 4K.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
              <span>Resoluciones soportadas:</span>
              <span className="font-mono text-white font-semibold">1080p · 2K · 4K</span>
            </div>
          </div>

          {/* Card 2: Modelos de Vídeo (Veo 3.1 & Omni Flash) */}
          <div className="lg:col-span-6 bg-zinc-950 rounded-2xl border border-zinc-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider">
                  Motor de Vídeo
                </span>
                <span className="text-xs font-mono text-zinc-400">flow.google.com</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Veo 3.1 Suite & Omni Flash</h3>
              <p className="text-xs text-zinc-400 mb-6">
                Compatibilidad integral con todos los niveles de renderizado de vídeo generativo de Google.
              </p>

              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 text-left">
                    <span className="block text-xs font-bold text-white mb-1">Veo 3.1-lite</span>
                    <span className="text-[10px] text-zinc-400">Iteración ágil para borradores</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 text-left">
                    <span className="block text-xs font-bold text-white mb-1">Veo 3.1-fast</span>
                    <span className="text-[10px] text-zinc-400">Flujo ágil con movimiento fluido</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 text-left">
                    <span className="block text-xs font-bold text-white mb-1">Veo 3.1-quality</span>
                    <span className="text-[10px] text-zinc-400">Calidad cinemática de estudio</span>
                  </div>
                </div>

                {/* Omni Flash Spotlight */}
                <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Omni Flash</span>
                      <span className="text-[10px] font-mono text-red-400">Selector de Duración Exclusivo</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-300 mb-2.5">
                    Permite definir con precisión la duración temporal exacta de cada clip generado en la cola:
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[4, 6, 8, 10].map((s) => (
                      <div
                        key={s}
                        className="py-1 px-2 text-center rounded bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold text-red-400"
                      >
                        {s} segundos
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
              <span>Resoluciones de vídeo:</span>
              <span className="font-mono text-white font-semibold">720p · 1080p · 4K</span>
            </div>
          </div>
        </div>

        {/* Formatos y Descargas Bar */}
        <div className="mt-8 bg-zinc-950 rounded-2xl border border-zinc-800 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-red-500 mb-2">
                Relaciones de Aspecto
              </span>
              <p className="text-xs text-zinc-400 mb-3">
                Formatos preconfigurados para cualquier canal o dispositivo sin recortes posteriores:
              </p>
              <div className="flex flex-wrap gap-2">
                {['16:9', '9:16', '1:1', '4:3', '3:4'].map((ratio) => (
                  <span
                    key={ratio}
                    className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200"
                  >
                    {ratio}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-red-500 mb-2">
                Salidas por Prompt
              </span>
              <p className="text-xs text-zinc-400 mb-3">
                Genera de 1 a 4 variantes simultáneas por cada bloque de texto de la cola.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">1 salida</span>
                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">2 salidas</span>
                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">3 salidas</span>
                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">4 salidas</span>
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-red-500 mb-2">
                Descarga Automática Secuencial
              </span>
              <p className="text-xs text-zinc-400 mb-3">
                Define cuántas de las salidas deseas guardar automáticamente en disco en cuanto finalizan.
              </p>
              <div className="text-xs text-zinc-300 flex items-center gap-2">
                <span className="text-red-400 font-bold font-mono">1 a 4 descargas</span>
                <span className="text-zinc-400">· Sin intervención manual</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
