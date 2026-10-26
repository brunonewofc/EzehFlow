import React, { useState } from 'react';
import { GenerationMode } from '../types/flow';

interface ModeInfo {
  id: GenerationMode;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  specDetails: string[];
  referenceLabel: string;
  badgeTag: string;
  imageSrc: string;
}

const MODES_DATA: ModeInfo[] = [
  {
    id: 'text_to_image',
    number: '01',
    title: 'Texto → Imagen',
    subtitle: 'Generación por lotes con referencia opcional',
    description:
      'Genera imágenes en serie a partir de tu lista de prompts separados por una línea en blanco. Permite adjuntar una imagen de referencia opcional para mantener consistencia de estilo, paleta o composición en todo el lote.',
    specDetails: [
      'Modelos compatibles: Nano Banana 2, Nano Banana 2 Lite y Nano Banana Pro',
      'Resoluciones disponibles: 1080p, 2K y 4K ultra nítido',
      'Genera de 1 a 4 variaciones por prompt con descarga automática selectiva',
    ],
    referenceLabel: 'Imagen de referencia opcional',
    badgeTag: 'Nano Banana Engine',
    imageSrc: '/src/assets/images/ezehflow_hero_creative_1793043095489.jpg',
  },
  {
    id: 'text_to_video',
    number: '02',
    title: 'Texto → Vídeo',
    subtitle: 'Creación automática a partir de bloques de texto',
    description:
      'Crea videos automáticamente a partir de bloques de texto sin intervención constante. La extensión alimenta cada bloque al motor de Google Flow, espera el renderizado y guarda los clips directamente en tu sistema.',
    specDetails: [
      'Modelos: Veo 3.1-lite, Veo 3.1-fast, Veo 3.1-quality y Omni Flash',
      'Selector exclusivo de duración para Omni Flash: 4s, 6s, 8s y 10s',
      'Resolución en 720p, 1080p y 4K con tasa de bits cinematográfica',
    ],
    referenceLabel: 'Procesamiento directo de prompts',
    badgeTag: 'Veo 3.1 & Omni Flash',
    imageSrc: '/src/assets/images/sample_cinematic_scene_1793043096789.jpg',
  },
  {
    id: 'frames_to_video',
    number: '03',
    title: 'Frames → Vídeo',
    subtitle: 'Fotograma clave inicial con último frame opcional',
    description:
      'Genera videos definiendo un primer fotograma obligatorio que ancla el inicio de la animación y un último fotograma opcional para interpolar movimientos entre ambos extremos temporales con fluidez cinemática.',
    specDetails: [
      'Primer fotograma obligatorio: Establece el sujeto, iluminación y perspectiva',
      'Último fotograma opcional: Guía la transformación espacial hacia un punto fijo',
      'Ideal para transiciones de productos, animaciones de concepto y VFX',
    ],
    referenceLabel: 'Fotogramas clave de control',
    badgeTag: 'Control de Fotogramas',
    imageSrc: '/src/assets/images/sample_cinematic_scene_1793043096789.jpg',
  },
  {
    id: 'components_to_video',
    number: '04',
    title: 'Componentes → Vídeo',
    subtitle: 'Fusión visual de hasta 3 componentes gráficos',
    description:
      'Crea videos combinando hasta 3 imágenes de componentes como referencia visual. EzehFlow vincula cada componente en el panel de Google Flow para guiar la estética de personajes, accesorios o escenarios dentro de cada iteración.',
    specDetails: [
      'Hasta 3 slots de componentes simultáneos (personaje, objeto, entorno)',
      'Asociación automática a cada prompt de la cola de trabajo',
      'Mantiene la coherencia de identidad de marca en toda la serie de videos',
    ],
    referenceLabel: '3 slots visuales simultáneos',
    badgeTag: 'Multi-referencia gráfica',
    imageSrc: '/src/assets/images/sample_component_art_1793043095238.jpg',
  },
];

export const ModesDeepDive: React.FC = () => {
  const [selectedModeId, setSelectedModeId] = useState<GenerationMode>('text_to_video');
  const activeMode = MODES_DATA.find((m) => m.id === selectedModeId) || MODES_DATA[0];

  return (
    <section id="modos" className="py-20 bg-black border-b border-zinc-900 scroll-mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">
            Arquitectura de Procesamiento
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 [text-wrap:balance]">
            Modos de generación totalmente automatizados
          </h2>
          <p className="text-zinc-400 max-w-2xl text-sm sm:text-base leading-relaxed">
            EzehFlow cubre los cuatro flujos esenciales de Google Flow adaptándose tanto a producciones de imagen fija como a tuberías completas de vídeo cinematográfico.
          </p>
        </div>

        {/* Interactive Mode Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {MODES_DATA.map((mode) => {
            const isSelected = mode.id === selectedModeId;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedModeId(mode.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-zinc-950 border-red-500 shadow-lg shadow-red-950/20'
                    : 'bg-zinc-950/50 border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-mono font-bold text-red-500 mb-1">{mode.number}.</div>
                <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {mode.title}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{mode.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Detailed Spotlight Card for Active Mode */}
        <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Mode Explanation */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 mb-3">
                <span>Modo {activeMode.number}</span>
                <span aria-hidden="true">·</span>
                <span className="text-zinc-400">{activeMode.badgeTag}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                {activeMode.title}
              </h3>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
                {activeMode.description}
              </p>

              {/* Specifications List */}
              <div className="space-y-3 mb-8">
                {activeMode.specDetails.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                    <span className="h-2 w-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* Reference indicator */}
              <div className="pt-4 border-t border-zinc-900 flex items-center gap-3 text-xs text-zinc-400">
                <span className="text-zinc-300 font-medium">Control de referencia:</span>
                <span className="font-mono text-red-400">{activeMode.referenceLabel}</span>
              </div>
            </div>

            {/* Right Column: Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black aspect-[16/10] group">
                <img
                  src={activeMode.imageSrc}
                  alt={activeMode.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
                  <span className="font-mono text-zinc-400">EzehFlow Engine</span>
                  <span className="text-white font-mono">{activeMode.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
