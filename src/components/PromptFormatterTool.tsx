import React, { useState } from 'react';
import { parsePrompts } from '../utils/queueParser';

const FORMATTER_TEMPLATES = [
  {
    name: 'Cinemática Cyberpunk',
    text: `1. Calle lluviosa en Neo-Tokio con reflejos de neón carmesí en el asfalto mojado, plano general
2. Hacker con prótesis biónica tecleando en una terminal holográfica en una guarida subterránea
3. Vehículo volador patrullando entre rascacielos cubiertos de niebla densa y carteles luminosos`,
  },
  {
    name: 'Comercial de Producto',
    text: `Reloj inteligente de titanio mate con correa roja sobre superficie de obsidiana pulida, luz cenital difusa
Auriculares inalámbricos de alta gama levitando con ondas sónicas sutiles alrededor, fondo gris grafito
Cámara analógica clásica rediseñada con materiales futuristas y acentos escarlata, profundidad de campo reducida`,
  },
  {
    name: 'Concept Art Arquitectónico',
    text: `Museo de arte contemporáneo con formas geométricas audaces y claraboyas triangulares, hora dorada
Estación espacial orbital con ventanal panorámico hacia una nebulosa carmesí y estrellas lejanas
Pabellón minimalista de concreto negro en medio de un bosque de niebla, iluminación arquitectónica tenue`,
  },
];

interface FormatterProps {
  onLoadIntoSimulator?: (promptsText: string) => void;
}

export const PromptFormatterTool: React.FC<FormatterProps> = ({ onLoadIntoSimulator }) => {
  const [inputText, setInputText] = useState<string>(FORMATTER_TEMPLATES[0].text);
  const [copied, setCopied] = useState<boolean>(false);

  // Converts any messy input (bullet points, numbered lines, single enter) into double enter blocks
  const formatText = (text: string): string => {
    if (!text.trim()) return '';

    // Split by single line breaks or numbers/bullets
    const rawLines = text
      .split('\n')
      .map((line) => line.replace(/^[\s\d\.\-\*•\)\>]+/, '').trim())
      .filter((line) => line.length > 0);

    return rawLines.join('\n\n');
  };

  const formattedOutput = formatText(inputText);
  const promptList = parsePrompts(formattedOutput);

  const handleCopy = () => {
    if (!formattedOutput) return;
    navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTransfer = () => {
    if (onLoadIntoSimulator) {
      onLoadIntoSimulator(formattedOutput);
      const simulatorEl = document.getElementById('simulador');
      if (simulatorEl) {
        simulatorEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="formateador" className="py-20 bg-black border-b border-zinc-900 scroll-mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">
            Herramienta Integrada
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 [text-wrap:balance]">
            Formateador de Cola para EzehFlow
          </h2>
          <p className="text-zinc-400 max-w-2xl text-sm sm:text-base leading-relaxed">
            Pega listas desordenadas, notas con viñetas o ideas numeradas. Esta utilidad las convierte al formato de línea en blanco que requiere el panel lateral de EzehFlow con un solo clic.
          </p>
        </div>

        {/* Template Pickers */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-zinc-400 mr-2">Cargar plantilla:</span>
          {FORMATTER_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.name}
              type="button"
              onClick={() => setInputText(tmpl.text)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
            >
              {tmpl.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input Textarea */}
          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Texto Original / Notas Desordenadas
                </span>
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="text-xs text-zinc-400 hover:text-red-400"
                >
                  Limpiar
                </button>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={9}
                placeholder="Pega tu texto aquí (con viñetas, números o líneas simples)..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none leading-relaxed font-sans"
              />
            </div>

            <div className="pt-3 text-[11px] text-zinc-400">
              Elimina automáticamente números iniciales, guiones y espacios redundantes.
            </div>
          </div>

          {/* Right: Output Ready for EzehFlow */}
          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Formato EzehFlow Listo
                  </span>
                  <span className="text-xs font-mono text-red-400 font-semibold">
                    ({promptList.length} prompts listos)
                  </span>
                </div>
                {copied && (
                  <span className="text-xs text-zinc-100 bg-zinc-800 px-2 py-0.5 rounded font-mono">
                    ✓ Copiado al portapapeles
                  </span>
                )}
              </div>

              <textarea
                readOnly
                value={formattedOutput}
                rows={9}
                placeholder="El resultado con líneas en blanco aparecerá aquí..."
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-zinc-200 focus:outline-none leading-relaxed font-sans"
              />
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!formattedOutput}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2"
              >
                <span>Copiar Cola Formateada</span>
              </button>

              {onLoadIntoSimulator && (
                <button
                  type="button"
                  onClick={handleTransfer}
                  disabled={!formattedOutput}
                  className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-40 transition-all"
                >
                  Probar en Simulador
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
