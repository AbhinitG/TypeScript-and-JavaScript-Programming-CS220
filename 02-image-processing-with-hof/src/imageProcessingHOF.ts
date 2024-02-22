import type { Image, Color } from "../include/image.js";

export function imageMapCoord(img: Image, func: (img: Image, x: number, y: number) => Color): Image {
  // TODO
  const newImg = img.copy();
  for (let i = 0; i < newImg.width; ++i) {
    for (let j = 0; j < newImg.height; ++j) {
      newImg.setPixel(i, j, func(img, i, j));
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
      if (cond(newImg, i, j)) {
        newImg.setPixel(i, j, func(img.getPixel(i, j)));
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
  return Math.max(p[0], p[1], p[2]) - Math.min(p[0], p[1], p[2]) <= 85;
}

export function makeGrayish(img: Image): Image {
  // TODO
  const cond = (img: Image, x: number, y: number): boolean => !isGrayish(img.getPixel(x, y));
  return imageMapIf(
    img,
    cond,
    (p: Color): Color => [
      Math.floor((p[0] + p[1] + p[2]) / 3),
      Math.floor((p[0] + p[1] + p[2]) / 3),
      Math.floor((p[0] + p[1] + p[2]) / 3),
    ]
  );
}

export function pixelBlur(img: Image, x: number, y: number): Color {
  // TODO
  // First get all the neighbors and store in a 2d array
  // Second use map to get the set of Color values for each set of coordinates
  // Third use reduce to get the mean of the Color values
  let result: Color = [0, 0, 0];
  if (Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0) {
    const neighbors = [
      [x, y],
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
      [x + 1, y + 1],
      [x + 1, y - 1],
      [x - 1, y - 1],
      [x - 1, y + 1],
    ];

    const nInRange = neighbors.filter(e => e[0] >= 0 && e[0] < img.width && e[1] >= 0 && e[1] < img.height);

    result = nInRange.reduce(
      (acc: Color, e: number[]) => {
        const p: Color = img.getPixel(e[0], e[1]);
        return (acc = [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]]);
      },
      [0, 0, 0]
    );

    result = [
      Math.floor(result[0] / nInRange.length),
      Math.floor(result[1] / nInRange.length),
      Math.floor(result[2] / nInRange.length),
    ];
  }
  return result;
}

export function imageBlur(img: Image): Image {
  // TODO
  return imageMapCoord(img, pixelBlur);
}
