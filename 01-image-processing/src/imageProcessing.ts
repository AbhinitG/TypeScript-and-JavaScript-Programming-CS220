import { COLORS, Color, Image } from "../include/image.js";

/**
 * Saturates green color in each pixel of an image
 * @param img An image
 * @returns A new image where each pixel has the green channel set to its maximum.
 */
export function saturateGreen(img: Image): Image {
  // TODO
  const copy = img.copy();

  // double for loop that traverses through the width and height
  // saturates the green color of the pixel if not saturated
  for (let i = 0; i < copy.width; ++i) {
    for (let j = 0; j < copy.height; ++j) {
      const curColor = copy.getPixel(i, j);
      if (curColor[1] !== COLORS.GREEN[1]) {
        copy.setPixel(i, j, [curColor[0], COLORS.GREEN[1], curColor[2]]);
      }
    }
  }
  return copy;
}

/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixel's channel has been
 *  set as the truncated average of the other two
 */
export function flipColors(img: Image): Image {
  // TODO
  const copy = img.copy();

  for (let i = 0; i < copy.width; ++i) {
    for (let j = 0; j < copy.height; ++j) {
      const ogColors = img.getPixel(i, j);
      const newFirst = Math.floor((ogColors[1] + ogColors[2]) / 2);
      const newSecond = Math.floor((ogColors[0] + ogColors[2]) / 2);
      const newThird = Math.floor((ogColors[0] + ogColors[1]) / 2);

      copy.setPixel(i, j, [newFirst, newSecond, newThird]);
    }
  }
  return copy;
}

/**
 * Modifies the given `img` such that the value of each pixel
 * in the given line is the result of applying `func` to the
 * corresponding pixel of `img`. If `lineNo` is not a valid line
 * number, then `img` should not be modified.
 * @param img An image
 * @param lineNo A line number
 * @param func A color transformation function
 */
export function mapLine(img: Image, lineNo: number, func: (c: Color) => Color): void {
  // TODO
  if (lineNo >= 0 && lineNo < img.height) {
    for (let i = 0; i < img.width; ++i) {
      img.setPixel(i, lineNo, func(img.getPixel(i, lineNo)));
    }
  }
}

/**
 * The result must be a new image with the same dimensions as `img`.
 * The value of each pixel in the new image should be the result of
 * applying `func` to the corresponding pixel of `img`.
 * @param img An image
 * @param func A color transformation function
 */
export function imageMap(img: Image, func: (c: Color) => Color): Image {
  // TODO
  const copy = img.copy();

  for (let i = 0; i < img.height; ++i) {
    mapLine(copy, i, func);
  }

  return copy;
}

/**
 * Saturates green color in an image
 * @param img An image
 * @returns A new image where each pixel has the green channel has been set to its maximum.
 */
export function mapToGreen(img: Image): Image {
  // TODO
  const newImage = imageMap(img, color => [color[0], 255, color[2]]);
  return newImage;
}

/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixels channel has been
 *  set as the truncated average of the other two
 */
export function mapFlipColors(img: Image): Image {
  // TODO
  const newImage = imageMap(img, color => [
    Math.floor((color[1] + color[2]) / 2),
    Math.floor((color[0] + color[2]) / 2),
    Math.floor((color[0] + color[1]) / 2),
  ]);

  return newImage;
}
