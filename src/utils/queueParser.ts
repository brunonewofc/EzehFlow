import { GenerationMode, ImageModel, VideoModel, OmniDuration } from '../types/flow';

/**
 * Splits raw user input into an array of distinct prompts based on blank lines (double enter).
 * Empty lines and leading/trailing whitespace are stripped.
 */
export function parsePrompts(rawText: string): string[] {
  if (!rawText || !rawText.trim()) {
    return [];
  }
  return rawText
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/**
 * Validates queue configuration and returns error message or null if valid.
 */
export function validateQueueConfig(
  prompts: string[],
  mode: GenerationMode,
  options: {
    outputsPerPrompt: number;
    autoDownloadCount: number;
    firstFrame?: string;
    componentsCount?: number;
  }
): { isValid: boolean; error: string | null } {
  if (prompts.length === 0) {
    return { isValid: false, error: 'Debes ingresar al menos un prompt en la cola.' };
  }

  if (options.outputsPerPrompt < 1 || options.outputsPerPrompt > 4) {
    return { isValid: false, error: 'Las salidas por prompt deben estar entre 1 y 4.' };
  }

  if (options.autoDownloadCount < 1 || options.autoDownloadCount > options.outputsPerPrompt) {
    return {
      isValid: false,
      error: `La cantidad de descargas automáticas (${options.autoDownloadCount}) no puede superar las salidas generadas (${options.outputsPerPrompt}).`,
    };
  }

  if (mode === 'frames_to_video' && !options.firstFrame) {
    return {
      isValid: false,
      error: 'El modo Frames → Vídeo requiere un primer fotograma obligatorio.',
    };
  }

  if (mode === 'components_to_video' && (options.componentsCount ?? 0) === 0) {
    return {
      isValid: false,
      error: 'El modo Componentes → Vídeo requiere al menos 1 imagen de componente (máximo 3).',
    };
  }

  return { isValid: true, error: null };
}

/**
 * Estimates total processing duration based on mode, models and total outputs.
 */
export function estimateDuration(
  promptsCount: number,
  mode: GenerationMode,
  model: ImageModel | VideoModel,
  outputsPerPrompt: number,
  omniDuration: OmniDuration = 6
): { totalOutputs: number; totalSeconds: number; formatted: string } {
  const totalOutputs = promptsCount * outputsPerPrompt;
  let secondsPerOutput = 8; // base for nano banana 2

  if (mode === 'text_to_image') {
    if (model === 'nano_banana_2_lite') secondsPerOutput = 4;
    else if (model === 'nano_banana_2') secondsPerOutput = 7;
    else if (model === 'nano_banana_pro') secondsPerOutput = 12;
  } else {
    // Video generation
    if (model === 'veo_3_1_lite') secondsPerOutput = 18;
    else if (model === 'veo_3_1_fast') secondsPerOutput = 22;
    else if (model === 'veo_3_1_quality') secondsPerOutput = 45;
    else if (model === 'omni_flash') {
      // Scales with chosen duration: 4s, 6s, 8s, 10s
      secondsPerOutput = 12 + omniDuration * 2.5;
    }

    if (mode === 'frames_to_video') secondsPerOutput += 4;
    if (mode === 'components_to_video') secondsPerOutput += 6;
  }

  const totalSeconds = Math.round(totalOutputs * secondsPerOutput);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  let formatted = '';
  if (minutes > 0) {
    formatted = `${minutes}m ${remainingSeconds}s`;
  } else {
    formatted = `${remainingSeconds}s`;
  }

  return { totalOutputs, totalSeconds, formatted };
}

/**
 * Formats a clean filename for automated downloads
 */
export function generateFilename(
  index: number,
  outputNumber: number,
  mode: GenerationMode,
  resolution: string
): string {
  const isVideo = mode !== 'text_to_image';
  const ext = isVideo ? 'mp4' : 'png';
  const modeTag =
    mode === 'text_to_image'
      ? 'Txt2Img'
      : mode === 'text_to_video'
      ? 'Txt2Vid'
      : mode === 'frames_to_video'
      ? 'Frames2Vid'
      : 'Comp2Vid';

  const paddedPrompt = String(index + 1).padStart(3, '0');
  return `EzehFlow_${modeTag}_P${paddedPrompt}_Out${outputNumber}_${resolution}.${ext}`;
}

/**
 * Preset prompts for creative demonstrations
 */
export const SAMPLE_PROMPT_PRESETS: { [key in GenerationMode]: string } = {
  text_to_image: `Retrato editorial cyberpunk de una hacker con visor holográfico rojo escarlata y chaqueta táctica oscura, iluminación lateral volumétrica, 8k

Arquitectura brutalista futurista iluminada con luces de neón carmesí bajo una lluvia torrencial nocturna, reflejos en asfalto mojado

Prototipo de vehículo aerodinámico en un hangar minimalista de titanio negro con líneas de luz láser roja`,

  text_to_video: `Cámara aérea sobrevolando una megalópolis futurista a medianoche con rascacielos negros y autopistas de tráfico lumínico rojo intenso

Primer plano de una esfera cuántica que se activa emitiendo pulsos de plasma carmesí y rotando en gravedad cero

Un viajero espacial caminando en la superficie de un asteroide oscuro mirando un eclipse solar con corona roja ardiente`,

  frames_to_video: `Transición fluida desde la silueta inmóvil del explorador hasta un giro dinámico de cámara de 180 grados mostrando la ciudad cibernética

Aceleración hiperespacial partiendo del fotograma clave con estelas de luz roja y desvanecimiento hacia el horizonte`,

  components_to_video: `Integración armónica del casco cibernético con la armadura pesada en una secuencia de acción táctica en el corredor industrial

Unificación de los elementos de diseño en un plano de pasarela de moda vanguardista con efectos de iluminación cinética`,
};
