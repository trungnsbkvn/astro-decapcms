// src/utils/imageUtils.ts
import sizeOf from 'image-size';
import fs from 'fs';
import path from 'path';

export function inferImageDimensions(imagePath: string) {
  const fullPath = path.resolve('public', imagePath);
  const dimensions = sizeOf(fullPath);
  return dimensions;
}