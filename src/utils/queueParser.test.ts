import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parsePrompts,
  validateQueueConfig,
  estimateDuration,
  generateFilename,
} from './queueParser';

test('parsePrompts correctly separates prompts by blank lines', () => {
  const input = 'Prompt uno\n\nPrompt dos\n\n\nPrompt tres';
  const result = parsePrompts(input);
  assert.equal(result.length, 3);
  assert.equal(result[0], 'Prompt uno');
  assert.equal(result[1], 'Prompt dos');
  assert.equal(result[2], 'Prompt tres');
});

test('parsePrompts handles empty or whitespace input', () => {
  assert.deepEqual(parsePrompts(''), []);
  assert.deepEqual(parsePrompts('   \n\n   '), []);
});

test('validateQueueConfig checks prompt presence and download bounds', () => {
  const emptyResult = validateQueueConfig([], 'text_to_image', {
    outputsPerPrompt: 2,
    autoDownloadCount: 2,
  });
  assert.equal(emptyResult.isValid, false);
  assert.match(emptyResult.error || '', /al menos un prompt/);

  const invalidDownload = validateQueueConfig(['A'], 'text_to_image', {
    outputsPerPrompt: 2,
    autoDownloadCount: 3,
  });
  assert.equal(invalidDownload.isValid, false);

  const validResult = validateQueueConfig(['A'], 'text_to_image', {
    outputsPerPrompt: 2,
    autoDownloadCount: 2,
  });
  assert.equal(validResult.isValid, true);
  assert.equal(validResult.error, null);
});

test('validateQueueConfig enforces first frame requirement in frames_to_video', () => {
  const noFrame = validateQueueConfig(['Animar escena'], 'frames_to_video', {
    outputsPerPrompt: 1,
    autoDownloadCount: 1,
  });
  assert.equal(noFrame.isValid, false);
  assert.match(noFrame.error || '', /primer fotograma obligatorio/);

  const withFrame = validateQueueConfig(['Animar escena'], 'frames_to_video', {
    outputsPerPrompt: 1,
    autoDownloadCount: 1,
    firstFrame: 'blob:frame1.png',
  });
  assert.equal(withFrame.isValid, true);
});

test('estimateDuration calculates total outputs and duration correctly', () => {
  const result = estimateDuration(3, 'text_to_image', 'nano_banana_2', 2);
  assert.equal(result.totalOutputs, 6);
  assert.equal(result.totalSeconds, 42); // 6 * 7
  assert.equal(result.formatted, '42s');

  const videoResult = estimateDuration(2, 'text_to_video', 'omni_flash', 1, 10);
  assert.equal(videoResult.totalOutputs, 2);
  assert.equal(videoResult.totalSeconds, 74); // 2 * (12 + 10 * 2.5) = 2 * 37 = 74
  assert.equal(videoResult.formatted, '1m 14s');
});

test('generateFilename builds standardized filenames', () => {
  const imgName = generateFilename(0, 1, 'text_to_image', '4K');
  assert.equal(imgName, 'EzehFlow_Txt2Img_P001_Out1_4K.png');

  const vidName = generateFilename(4, 2, 'text_to_video', '1080p');
  assert.equal(vidName, 'EzehFlow_Txt2Vid_P005_Out2_1080p.mp4');
});
