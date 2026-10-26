import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: '¿Qué es EzehFlow y cómo funciona en Google Flow?',
    answer:
      'EzehFlow es una extensión para Google Chrome que se ejecuta en el panel lateral (sidepanel) mientras navegas en labs.google o flow.google.com. Lee una lista secuencial de prompts y automatiza la pulsación de generación, el seguimiento del estado y la descarga automática del resultado final sin requerir supervisión continua.',
  },
  {
    question: '¿Cómo debo escribir y organizar mis prompts en la cola?',
    answer:
      'Solo tienes que redactar o pegar tus prompts separándolos con una línea en blanco (presionando dos veces la tecla Enter). Cada bloque de texto separado se interpreta como un trabajo individual y se ejecutará en orden estricto de arriba hacia abajo.',
  },
  {
    question: '¿Cuáles modelos de imagen y vídeo están disponibles?',
    answer:
      'Para imágenes puedes elegir directamente entre Nano Banana 2, Nano Banana 2 Lite y Nano Banana Pro. Para vídeos, EzehFlow es compatible con Veo 3.1-lite, Veo 3.1-fast, Veo 3.1-quality y Omni Flash. Además, al seleccionar Omni Flash se habilita el selector de duración exclusivo entre 4s, 6s, 8s y 10s.',
  },
  {
    question: '¿Cómo funciona la selección de salidas y descargas automáticas?',
    answer:
      'Puedes configurar que Google Flow genere entre 1 y 4 variantes por cada prompt. De manera independiente, puedes definir cuántas de esas variantes deseas que la extensión descargue automáticamente (por ejemplo, generar 4 pero descargar solo las 2 mejores o todas las 4) en 1080p, 2K o 4K para fotos y 720p, 1080p o 4K para videos.',
  },
  {
    question: '¿Cómo funcionan los modos Frames → Vídeo y Componentes → Vídeo?',
    answer:
      'En Frames → Vídeo defines un primer fotograma obligatorio que sirve como punto de partida visual del clip, con la opción de añadir un último fotograma opcional para transiciones guiadas. En Componentes → Vídeo puedes adjuntar hasta 3 imágenes de referencia que el sistema asociará para guiar el estilo, personajes u objetos generados.',
  },
  {
    question: '¿Mis datos o credenciales viajan a algún servidor externo?',
    answer:
      'No. EzehFlow opera 100% de forma local en tu navegador aprovechando tu sesión activa y legítima en Google Flow. No solicita claves de API ni almacena tus prompts o creaciones en servidores de terceros.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-black border-b border-zinc-900 scroll-mt-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">
            Respuestas Clave
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 [text-wrap:balance]">
            Preguntas Frecuentes
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Todo lo que necesitas saber para comenzar a procesar tus flujos creativos en Google Flow con EzehFlow.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-zinc-900/50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {faq.question}
                  </span>
                  <span className="text-red-500 font-mono text-lg font-bold shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-900">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
