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
  const newImg = img.copy();
  for (let i = 0; i < newImg.width; ++i) {
    for (let j = 0; j < newImg.height; ++j) {
      if (cond(newImg, i, j) === true) {
        newImg.setPixel(i, j, func(newImg.getPixel(i, j)));
      }
    }
  }
  return newImg;
}

export function mapWindow(
  img: Image,
  xInterval: number[], // Assumed to be a two element array containing [x_min, x_max]
  yInterval: number[], // Assumed to be a two element array containing [y_min, y_max]
  func: (p: Color) => Color
): Image {
  // TODO
  if (
    xInterval.length !== 2 &&
    yInterval.length !== 2 &&
    xInterval[0] <= xInterval[1] &&
    yInterval[0] <= yInterval[1]
  ) {
    return img.copy();
  }
  const cond = (img: Image, x: number, y: number): boolean => {
    return x >= xInterval[0] && x <= xInterval[1] && y >= yInterval[0] && y <= yInterval[1];
  };
  return imageMapIf(img, cond, func);
}

export function isGrayish(p: Color): boolean {
  // TODO
  return (Math.max(p[0], p[1], p[2]) - Math.min(p[0], p[1], p[2])) <= 85;
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
