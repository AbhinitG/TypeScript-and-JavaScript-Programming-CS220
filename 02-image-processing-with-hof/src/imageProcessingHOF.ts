import type { Image, Color } from "../include/image.js";

export function imageMapCoord(img: Image, func: (img: Image, x: number, y: number) => Color): Image {
  // TODO
  const newImg = img.copy();
  for (let i = 0; i < newImg.width; ++i) {
    for (let j = 0; j < newImg.height; ++j) {
      newImg.setPixel(i, j, func(newImg, i, j));
    }
  }
  return newImg;
}

export function imageMapIf(
  img: Image,
  cond: (img: Image, x: number, y: number) => boolean,
  func: (p: Color) => Color
): Image {
  // TODO
  return img.copy();
}

export function mapWindow(
  img: Image,
  xInterval: number[], // Assumed to be a two element array containing [x_min, x_max]
  yInterval: number[], // Assumed to be a two element array containing [y_min, y_max]
  func: (p: Color) => Color
): Image {
  // TODO
  return img.copy();
}

export function isGrayish(p: Color): boolean {
  // TODO
  return true;
}

export function makeGrayish(img: Image): Image {
  // TODO
  return img.copy();
}

export function pixelBlur(img: Image, x: number, y: number): Color {
  // TODO
  return [0, 0, 0];
}

export function imageBlur(img: Image): Image {
  // TODO
  return img.copy();
}
