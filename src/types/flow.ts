export type GenerationMode =
  | 'text_to_image'
  | 'text_to_video'
  | 'frames_to_video'
  | 'components_to_video';

export type ImageModel = 'nano_banana_2' | 'nano_banana_2_lite' | 'nano_banana_pro';

export type VideoModel = 'veo_3_1_lite' | 'veo_3_1_fast' | 'veo_3_1_quality' | 'omni_flash';

export type OmniDuration = 4 | 6 | 8 | 10;

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';

export type ImageResolution = '1080p' | '2K' | '4K';

export type VideoResolution = '720p' | '1080p' | '4K';

export interface QueueConfig {
  mode: GenerationMode;
  imageModel: ImageModel;
  videoModel: VideoModel;
  omniDuration: OmniDuration;
  aspectRatio: AspectRatio;
  outputsPerPrompt: number; // 1 to 4
  autoDownloadCount: number; // 1 to 4
  resolution: string; // 1080p, 2K, 4K for image; 720p, 1080p, 4K for video
  referenceImage?: string; // Optional for text_to_image
  firstFrame?: string; // Mandatory for frames_to_video
  lastFrame?: string; // Optional for frames_to_video
  components: string[]; // Up to 3 for components_to_video
}

export type QueueItemStatus = 'pending' | 'generating' | 'downloading' | 'completed' | 'error';

export interface GeneratedOutput {
  id: string;
  url: string;
  format: 'image' | 'video';
  resolution: string;
  downloaded: boolean;
  filename: string;
}

export interface QueueItem {
  id: string;
  promptNumber: number;
  prompt: string;
  status: QueueItemStatus;
  progress: number; // 0 to 100
  outputs: GeneratedOutput[];
  error?: string;
}
