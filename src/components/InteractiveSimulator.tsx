import React, { useState, useEffect, useRef } from 'react';
import {
  GenerationMode,
  ImageModel,
  VideoModel,
  OmniDuration,
  AspectRatio,
  QueueItem,
  GeneratedOutput,
} from '../types/flow';
import {
  parsePrompts,
  validateQueueConfig,
  estimateDuration,
  generateFilename,
  SAMPLE_PROMPT_PRESETS,
} from '../utils/queueParser';

const SAMPLE_IMAGES = [
  '/src/assets/images/sample_cinematic_scene_1793043096789.jpg',
  '/src/assets/images/sample_component_art_1793043095238.jpg',
  '/src/assets/images/ezehflow_hero_creative_1793043095489.jpg',
];

export const InteractiveSimulator: React.FC = () => {
  // Config state
  const [mode, setMode] = useState<GenerationMode>('text_to_video');
  const [imageModel, setImageModel] = useState<ImageModel>('nano_banana_2');
  const [videoModel, setVideoModel] = useState<VideoModel>('omni_flash');
  const [omniDuration, setOmniDuration] = useState<OmniDuration>(6);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [outputsPerPrompt, setOutputsPerPrompt] = useState<number>(2);
  const [autoDownloadCount, setAutoDownloadCount] = useState<number>(2);
  const [imageResolution, setImageResolution] = useState<string>('4K');
  const [videoResolution, setVideoResolution] = useState<string>('4K');

  // References state
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [firstFrame, setFirstFrame] = useState<string | null>(SAMPLE_IMAGES[0]);
  const [lastFrame, setLastFrame] = useState<string | null>(null);
  const [components, setComponents] = useState<string[]>([SAMPLE_IMAGES[1]]);

  // Prompt input
  const [rawPrompts, setRawPrompts] = useState<string>(SAMPLE_PROMPT_PRESETS.text_to_video);

  // Queue runner state
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(-1);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const activeRes = mode === 'text_to_image' ? imageResolution : videoResolution;
  const parsedPrompts = parsePrompts(rawPrompts);
  const currentModel = mode === 'text_to_image' ? imageModel : videoModel;
  const durationEstimate = estimateDuration(
    parsedPrompts.length || 1,
    mode,
    currentModel,
    outputsPerPrompt,
    omniDuration
  );

  // When mode changes, load preset if rawPrompts is untouched or empty
  const handleModeChange = (newMode: GenerationMode) => {
    setMode(newMode);
    setRawPrompts(SAMPLE_PROMPT_PRESETS[newMode]);
    setConfigError(null);
  };

  // Adjust autoDownloadCount if outputsPerPrompt drops below it
  useEffect(() => {
    if (autoDownloadCount > outputsPerPrompt) {
      setAutoDownloadCount(outputsPerPrompt);
    }
  }, [outputsPerPrompt, autoDownloadCount]);

  // Simulation execution loop
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && !isPaused && queue.length > 0) {
      const activeIdx = queue.findIndex(
        (item) => item.status === 'pending' || item.status === 'generating' || item.status === 'downloading'
      );

      if (activeIdx === -1) {
        // Queue finished
        setIsRunning(false);
        setCurrentPromptIndex(-1);
        setOverallProgress(100);
        showNotification('¡Cola completada con éxito! Todos los archivos fueron procesados y descargados.');
        return;
      }

      setCurrentPromptIndex(activeIdx);
      const currentItem = queue[activeIdx];

      if (currentItem.status === 'pending') {
        // Transition to generating
        setQueue((prev) =>
          prev.map((item, idx) => (idx === activeIdx ? { ...item, status: 'generating', progress: 15 } : item))
        );
      } else if (currentItem.status === 'generating') {
        if (currentItem.progress < 100) {
          timer = setTimeout(() => {
            setQueue((prev) =>
              prev.map((item, idx) =>
                idx === activeIdx ? { ...item, progress: Math.min(100, item.progress + 25) } : item
              )
            );
          }, 450);
        } else {
          // Finished generating outputs, transition to downloading
          const isVid = mode !== 'text_to_image';
          const outputs: GeneratedOutput[] = [];
          for (let o = 1; o <= outputsPerPrompt; o++) {
            const willDownload = o <= autoDownloadCount;
            const filename = generateFilename(activeIdx, o, mode, activeRes);
            outputs.push({
              id: `${activeIdx}-${o}`,
              url: SAMPLE_IMAGES[(activeIdx + o) % SAMPLE_IMAGES.length],
              format: isVid ? 'video' : 'image',
              resolution: activeRes,
              downloaded: willDownload,
              filename,
            });
          }

          setQueue((prev) =>
            prev.map((item, idx) =>
              idx === activeIdx ? { ...item, status: 'downloading', outputs } : item
            )
          );

          showNotification(
            `Descargando automáticamente ${autoDownloadCount} de ${outputsPerPrompt} salidas para Prompt #${activeIdx + 1} (${activeRes})...`
          );
        }
      } else if (currentItem.status === 'downloading') {
        timer = setTimeout(() => {
          setQueue((prev) =>
            prev.map((item, idx) =>
              idx === activeIdx ? { ...item, status: 'completed' } : item
            )
          );
        }, 800);
      }

      // Calculate overall progress
      const completedCount = queue.filter((i) => i.status === 'completed').length;
      const progressRatio = Math.round((completedCount / queue.length) * 100);
      setOverallProgress(progressRatio);
    }

    return () => clearTimeout(timer);
  }, [isRunning, isPaused, queue, outputsPerPrompt, autoDownloadCount, mode, activeRes]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  const handleStartQueue = () => {
    const validation = validateQueueConfig(parsedPrompts, mode, {
      outputsPerPrompt,
      autoDownloadCount,
      firstFrame: firstFrame || undefined,
      componentsCount: components.length,
    });

    if (!validation.isValid) {
      setConfigError(validation.error);
      return;
    }

    setConfigError(null);
    const initialQueue: QueueItem[] = parsedPrompts.map((promptText, i) => ({
      id: `prompt-${i}`,
      promptNumber: i + 1,
      prompt: promptText,
      status: 'pending',
      progress: 0,
      outputs: [],
    }));

    setQueue(initialQueue);
    setIsRunning(true);
    setIsPaused(false);
    setOverallProgress(0);
    showNotification(`Iniciando cola de ${parsedPrompts.length} prompts en Google Flow...`);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleResetQueue = () => {
    setIsRunning(false);
    setIsPaused(false);
    setQueue([]);
    setOverallProgress(0);
    setCurrentPromptIndex(-1);
  };

  const handleLoadSample = (key: GenerationMode) => {
    setRawPrompts(SAMPLE_PROMPT_PRESETS[key]);
  };

  return (
    <section id="simulador" className="py-20 bg-black border-b border-zinc-900 scroll-mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">
            Simulador de Panel Lateral en Vivo
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 [text-wrap:balance]">
            Experimenta EzehFlow directamente en tu navegador
          </h2>
          <p className="text-zinc-400 max-w-2xl text-sm sm:text-base leading-relaxed">
            Configura los parámetros reales de la extensión tal como funciona junto a Google Flow (<span className="text-zinc-200 font-mono text-xs">flow.google.com</span> y <span className="text-zinc-200 font-mono text-xs">labs.google</span>) y observa la cola de procesamiento en tiempo real.
          </p>
        </div>

        {/* Live Notification Bar */}
        {notification && (
          <div
            role="status"
            className="mb-6 p-4 rounded-xl bg-zinc-950 border border-red-500/40 text-red-300 text-sm flex items-center justify-between shadow-lg shadow-red-950/20 animate-fade-in"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-red-500" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-zinc-400 hover:text-white text-xs px-2 py-1"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Main Simulator Workspace (Split: Controls & Sidepanel vs Live Google Flow Stage) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* EzehFlow Sidepanel Mockup (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-zinc-950 rounded-2xl border border-zinc-800 p-5 sm:p-6 shadow-2xl relative">
            {/* Top Bar of Sidepanel */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-red-600" />
                <span className="text-sm font-bold text-white tracking-wide">EzehFlow SidePanel</span>
                <span className="text-xs text-zinc-400">· Google Flow Companion</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="text-zinc-400">Estado:</span>
                {isRunning ? (
                  isPaused ? (
                    <span className="text-amber-400 font-semibold">Pausado</span>
                  ) : (
                    <span className="text-red-400 font-semibold">Procesando cola</span>
                  )
                ) : (
                  <span className="text-zinc-400">Listo</span>
                )}
              </div>
            </div>

            {/* 1. Selector de Modos */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                1. Modo de Generación
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleModeChange('text_to_image')}
                  className={`px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-all border ${
                    mode === 'text_to_image'
                      ? 'bg-red-950/40 border-red-500 text-white shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-white mb-0.5">Texto → Imagen</div>
                  <div className="text-[10px] text-zinc-400 truncate">Prompts en serie</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('text_to_video')}
                  className={`px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-all border ${
                    mode === 'text_to_video'
                      ? 'bg-red-950/40 border-red-500 text-white shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-white mb-0.5">Texto → Vídeo</div>
                  <div className="text-[10px] text-zinc-400 truncate">Videos automáticos</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('frames_to_video')}
                  className={`px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-all border ${
                    mode === 'frames_to_video'
                      ? 'bg-red-950/40 border-red-500 text-white shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-white mb-0.5">Frames → Vídeo</div>
                  <div className="text-[10px] text-zinc-400 truncate">1er frame obligatorio</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('components_to_video')}
                  className={`px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-all border ${
                    mode === 'components_to_video'
                      ? 'bg-red-950/40 border-red-500 text-white shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-white mb-0.5">Componentes → Vídeo</div>
                  <div className="text-[10px] text-zinc-400 truncate">Hasta 3 referencias</div>
                </button>
              </div>
            </div>

            {/* 2. Control de Modelos & Duraciones */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === 'text_to_image' ? (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    2. Modelo de Imagen
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['nano_banana_2', 'nano_banana_2_lite', 'nano_banana_pro'] as ImageModel[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setImageModel(m)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                          imageModel === m
                            ? 'bg-red-600 border-red-500 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        {m === 'nano_banana_2'
                          ? 'Nano Banana 2'
                          : m === 'nano_banana_2_lite'
                          ? 'Nano Banana 2 Lite'
                          : 'Nano Banana Pro'}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                      2. Modelo de Vídeo
                    </label>
                    <select
                      value={videoModel}
                      onChange={(e) => setVideoModel(e.target.value as VideoModel)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs rounded-lg px-3 py-2.5 focus:border-red-500 focus:outline-none"
                    >
                      <option value="veo_3_1_lite">Veo 3.1-lite (Alta velocidad)</option>
                      <option value="veo_3_1_fast">Veo 3.1-fast (Balanceado)</option>
                      <option value="veo_3_1_quality">Veo 3.1-quality (Máxima fidelidad)</option>
                      <option value="omni_flash">Omni Flash (Duración dinámica)</option>
                    </select>
                  </div>

                  {/* Selector exclusivo para Omni Flash */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                      Duración Omni Flash {videoModel !== 'omni_flash' && <span className="text-zinc-400 font-normal">(Exclusivo)</span>}
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {([4, 6, 8, 10] as OmniDuration[]).map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          disabled={videoModel !== 'omni_flash'}
                          onClick={() => setOmniDuration(dur)}
                          className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                            videoModel !== 'omni_flash'
                              ? 'opacity-30 cursor-not-allowed bg-zinc-900 border-zinc-800 text-zinc-400'
                              : omniDuration === dur
                              ? 'bg-red-600 border-red-500 text-white font-bold'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          {dur}s
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 3. Relación de Aspecto y Resoluciones */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  3. Relación de Aspecto
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['16:9', '9:16', '1:1', '4:3', '3:4'] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                        aspectRatio === ratio
                          ? 'bg-red-600 border-red-500 text-white font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  4. Resolución de Salida
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {mode === 'text_to_image'
                    ? ['1080p', '2K', '4K'].map((res) => (
                        <button
                          key={res}
                          type="button"
                          onClick={() => setImageResolution(res)}
                          className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                            imageResolution === res
                              ? 'bg-red-600 border-red-500 text-white font-bold'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          {res}
                        </button>
                      ))
                    : ['720p', '1080p', '4K'].map((res) => (
                        <button
                          key={res}
                          type="button"
                          onClick={() => setVideoResolution(res)}
                          className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                            videoResolution === res
                              ? 'bg-red-600 border-red-500 text-white font-bold'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          {res}
                        </button>
                      ))}
                </div>
              </div>
            </div>

            {/* 4. Salidas por Prompt y Descargas Automáticas */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    5. Salidas por Prompt
                  </label>
                  <span className="text-xs font-mono text-zinc-400">{outputsPerPrompt} generadas</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setOutputsPerPrompt(num)}
                      className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                        outputsPerPrompt === num
                          ? 'bg-zinc-100 text-black font-bold border-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    6. Descarga Automática
                  </label>
                  <span className="text-xs font-mono text-red-400 font-semibold">{autoDownloadCount} de {outputsPerPrompt}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      disabled={num > outputsPerPrompt}
                      onClick={() => setAutoDownloadCount(num)}
                      className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                        num > outputsPerPrompt
                          ? 'opacity-30 cursor-not-allowed bg-zinc-900 border-zinc-800 text-zinc-400'
                          : autoDownloadCount === num
                          ? 'bg-red-600 border-red-500 text-white font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reference Inputs for Special Modes */}
            {mode === 'text_to_image' && (
              <div className="mb-6 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-zinc-300">Imagen de referencia (Opcional)</span>
                  {referenceImage ? (
                    <button
                      onClick={() => setReferenceImage(null)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Quitar
                    </button>
                  ) : (
                    <button
                      onClick={() => setReferenceImage(SAMPLE_IMAGES[2])}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      Adjuntar muestra
                    </button>
                  )}
                </div>
                {referenceImage && (
                  <div className="flex items-center gap-3">
                    <img
                      src={referenceImage}
                      alt="Referencia"
                      className="w-14 h-14 object-cover rounded-lg border border-zinc-700"
                    />
                    <span className="text-xs text-zinc-400 truncate">referencia_estilo_ezehflow.jpg</span>
                  </div>
                )}
              </div>
            )}

            {mode === 'frames_to_video' && (
              <div className="mb-6 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-xs font-semibold text-zinc-300 mb-2">Configuración de Fotogramas</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-zinc-800 p-2 rounded-lg bg-zinc-950">
                    <span className="block text-[11px] text-red-400 font-semibold mb-1">Primer Frame (Obligatorio)</span>
                    <div className="flex items-center gap-2">
                      <img src={firstFrame || SAMPLE_IMAGES[0]} alt="Primer frame" className="w-10 h-10 object-cover rounded border border-zinc-700" />
                      <span className="text-[11px] text-zinc-300 truncate">frame_inicial_01.png</span>
                    </div>
                  </div>
                  <div className="border border-zinc-800 p-2 rounded-lg bg-zinc-950">
                    <span className="block text-[11px] text-zinc-400 font-semibold mb-1">Último Frame (Opcional)</span>
                    {lastFrame ? (
                      <div className="flex items-center justify-between">
                        <img src={lastFrame} alt="Último frame" className="w-10 h-10 object-cover rounded border border-zinc-700" />
                        <button onClick={() => setLastFrame(null)} className="text-[10px] text-red-400">Quitar</button>
                      </div>
                    ) : (
                      <button onClick={() => setLastFrame(SAMPLE_IMAGES[2])} className="text-[11px] text-zinc-400 hover:text-white pt-2">
                        + Añadir frame final
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {mode === 'components_to_video' && (
              <div className="mb-6 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-300">Imágenes de Componentes (Hasta 3)</span>
                  <span className="text-xs text-zinc-400">{components.length}/3 agregadas</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((slot) => {
                    const compImg = components[slot];
                    return (
                      <div key={slot} className="border border-zinc-800 p-2 rounded-lg bg-zinc-950 text-center">
                        {compImg ? (
                          <div className="relative group">
                            <img src={compImg} alt={`Componente ${slot + 1}`} className="w-full h-16 object-cover rounded border border-zinc-700 mb-1" />
                            <button
                              onClick={() => setComponents(components.filter((_, i) => i !== slot))}
                              className="text-[10px] text-red-400 hover:text-red-300"
                            >
                              Eliminar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setComponents([...components, SAMPLE_IMAGES[slot % SAMPLE_IMAGES.length]])}
                            className="h-16 w-full flex items-center justify-center text-[10px] text-zinc-400 hover:text-white border border-dashed border-zinc-700 rounded"
                          >
                            + Slot {slot + 1}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Prompt Queue Textarea */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  7. Cola de Prompts (Separados por línea en blanco)
                </label>
                <button
                  type="button"
                  onClick={() => handleLoadSample(mode)}
                  className="text-xs text-red-400 hover:text-red-300 font-medium"
                >
                  Restaurar muestra
                </button>
              </div>

              <textarea
                value={rawPrompts}
                onChange={(e) => setRawPrompts(e.target.value)}
                rows={5}
                placeholder="Escribe tu primer prompt aquí...&#10;&#10;Escribe tu segundo prompt aquí tras un salto de línea..."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none font-sans leading-relaxed"
              />

              {/* Dynamic Queue Estimates strip */}
              <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{parsedPrompts.length}</span> prompts detectados
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-white">{durationEstimate.totalOutputs}</span> salidas totales
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-zinc-300">~{durationEstimate.formatted} estimado</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">Doble Enter = Nuevo Item</span>
              </div>
            </div>

            {/* Validation Error Message */}
            {configError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
                {configError}
              </div>
            )}

            {/* Sidepanel Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!isRunning ? (
                <button
                  type="button"
                  onClick={handleStartQueue}
                  className="flex-1 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-red-600 hover:bg-red-500 active:scale-95 transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Iniciar Cola de Automatización</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handlePauseResume}
                    className={`py-3 px-4 rounded-xl font-semibold text-xs transition-all border ${
                      isPaused
                        ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                    }`}
                  >
                    {isPaused ? 'Reanudar' : 'Pausar'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetQueue}
                    className="py-3 px-4 rounded-xl font-semibold text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
                  >
                    Cancelar / Reiniciar
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Google Flow Stage & Live Generation Output Preview (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Stage Frame mimicking Google Flow */}
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-xs font-mono text-zinc-300">Google Flow Canvas (Vista Previa)</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">labs.google / flow</span>
              </div>

              {/* Live Status Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Progreso general de la cola:</span>
                  <span className="font-mono text-white font-bold">{overallProgress}%</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                  <div
                    className="bg-red-600 h-full transition-all duration-300 ease-out"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>

              {/* Active Prompt Execution Monitor */}
              <div className="bg-zinc-900/90 rounded-xl p-3.5 border border-zinc-800 mb-4 min-h-[140px] flex flex-col justify-center">
                {isRunning && currentPromptIndex >= 0 && queue[currentPromptIndex] ? (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-red-400">
                        Procesando #{queue[currentPromptIndex].promptNumber} de {queue.length}
                      </span>
                      <span className="text-zinc-400 font-mono text-[11px] uppercase">
                        {queue[currentPromptIndex].status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-200 line-clamp-2 italic mb-3">
                      "{queue[currentPromptIndex].prompt}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                      <span>Modelo: {mode === 'text_to_image' ? imageModel : videoModel}</span>
                      <span>{activeRes} · {aspectRatio}</span>
                    </div>
                  </div>
                ) : queue.length > 0 && overallProgress === 100 ? (
                  <div className="text-center py-4">
                    <div className="text-xs font-bold text-zinc-100 mb-1">¡Automatización finalizada!</div>
                    <p className="text-[11px] text-zinc-400">
                      Todos los elementos fueron descargados automáticamente en la carpeta de Descargas.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-zinc-400 text-xs">
                    Pulsa <span className="text-red-400 font-semibold">"Iniciar Cola"</span> para observar el ciclo secuencial de generación y descarga automática.
                  </div>
                )}
              </div>

              {/* Queue Items Timeline */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {queue.length > 0 ? (
                  queue.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border text-xs transition-all ${
                        idx === currentPromptIndex
                          ? 'bg-red-950/20 border-red-500/80 shadow-md'
                          : item.status === 'completed'
                          ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                          : 'bg-zinc-900/20 border-zinc-900 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-zinc-200">
                          Prompt #{item.promptNumber}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            item.status === 'completed'
                              ? 'bg-zinc-800 text-zinc-300'
                              : item.status === 'generating'
                              ? 'bg-red-900/80 text-red-200'
                              : item.status === 'downloading'
                              ? 'bg-rose-900 text-rose-200'
                              : 'text-zinc-400'
                          }`}
                        >
                          {item.status === 'completed'
                            ? 'Descargado'
                            : item.status === 'generating'
                            ? `Generando ${item.progress}%`
                            : item.status === 'downloading'
                            ? 'Descargando...'
                            : 'En cola'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mb-1.5">{item.prompt}</p>

                      {/* Display outputs if completed */}
                      {item.outputs.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-zinc-800/60">
                          {item.outputs.map((out) => (
                            <span
                              key={out.id}
                              className="text-[9px] font-mono text-zinc-300 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800"
                            >
                              ✓ {out.filename.substring(0, 24)}...
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-zinc-400 text-xs">
                    No hay ejecuciones activas. Configura los parámetros a la izquierda.
                  </div>
                )}
              </div>
            </div>

            {/* Aspect Ratio Preview Visualizer Card */}
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Relación de aspecto seleccionada:</span>
                <span className="font-mono text-white font-bold">{aspectRatio}</span>
              </div>
              <div className="h-28 flex items-center justify-center bg-black rounded-xl border border-zinc-900 overflow-hidden relative">
                <div
                  className="border-2 border-red-500 bg-red-950/20 rounded flex items-center justify-center text-[10px] font-mono text-red-300 transition-all duration-300"
                  style={{
                    aspectRatio:
                      aspectRatio === '16:9'
                        ? '16/9'
                        : aspectRatio === '9:16'
                        ? '9/16'
                        : aspectRatio === '1:1'
                        ? '1/1'
                        : aspectRatio === '4:3'
                        ? '4/3'
                        : '3/4',
                    maxHeight: '90px',
                    maxWidth: '180px',
                    width: aspectRatio === '9:16' || aspectRatio === '3:4' ? 'auto' : '100%',
                    height: aspectRatio === '9:16' || aspectRatio === '3:4' ? '85px' : 'auto',
                  }}
                >
                  {aspectRatio}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
