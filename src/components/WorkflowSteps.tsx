import React from 'react';

const STEPS = [
  {
    step: '01',
    title: 'Escribe tus prompts con doble salto',
    description:
      'Pega o redacta tu lista de ideas en el panel lateral. Solo debes separar cada prompt mediante una línea en blanco. EzehFlow reconocerá automáticamente cada bloque como un elemento individual de la cola.',
    detail: 'Doble Enter = 1 Ítem independiente en la cola',
  },
  {
    step: '02',
    title: 'Configura modelo, formato y descargas',
    description:
      'Ajusta los parámetros una sola vez: selecciona entre Nano Banana 2/Lite/Pro o la suite Veo 3.1 / Omni Flash, define la relación de aspecto, el número de salidas por prompt y cuántas deseas descargar en 1080p, 2K o 4K.',
    detail: 'Control total de duraciones (4s, 6s, 8s, 10s) en Omni Flash',
  },
  {
    step: '03',
    title: 'Generación y descarga secuencial',
    description:
      'Pulsa iniciar y deja que la extensión interactúe con labs.google o flow.google.com. EzehFlow espera el renderizado de cada resultado, lo guarda con nombres estandarizados y avanza automáticamente al siguiente.',
    detail: 'Descarga directa automática en tu carpeta local',
  },
];

export const WorkflowSteps: React.FC = () => {
  return (
    <section className="py-20 bg-black border-b border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">
            Flujo de Trabajo
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 [text-wrap:balance]">
            Automatización sin fricción en tres pasos
          </h2>
          <p className="text-zinc-400 max-w-2xl text-sm sm:text-base leading-relaxed">
            Elimina el proceso manual de esperar cada render y hacer clic derecho para descargar. EzehFlow convierte horas de trabajo repetitivo en un proceso desatendido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 sm:p-7 relative flex flex-col justify-between group hover:border-zinc-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-red-600">
                    {step.step}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-red-600" />
                </div>

                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-900 text-xs font-mono text-red-400">
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
