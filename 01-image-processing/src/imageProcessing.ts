import { COLORS, Color, Image } from "../include/image.js";

/**
 * Saturates green color in each pixel of an image
 * @param img An image
 * @returns A new image where each pixel has the green channel set to its maximum.
 */
export function saturateGreen(img: Image): Image {
  // TODO
  const newImg = img.copy();

  for (let i = 0; i < newImg.width; ++i) {
    for (let j = 0; j < newImg.height; ++j) {
      const curColor = newImg.getPixel(i, j);
      
      if (curColor[1] !== COLORS.GREEN[1]) {
        newImg.setPixel(i, j, [curColor[0], COLORS.GREEN[1], curColor[2]]);
      }
    }
  }

  return newImg;
}

/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixel's channel has been
 *  set as the truncated average of the other two
 */
export function flipColors(img: Image): Image {
  // TODO
  const newImg = img.copy();

  for (let i = 0; i < newImg.width; ++i) {
    for (let j = 0; j < newImg.height; ++j) {
      const ogColors = img.getPixel(i, j);
      const newFirstColor = Math.floor((ogColors[1] + ogColors[2]) / 2);
      const newSecondColor = Math.floor((ogColors[0] + ogColors[2]) / 2);
      const newThirdColor = Math.floor((ogColors[0] + ogColors[1]) / 2);

      newImg.setPixel(i, j, [newFirstColor, newSecondColor, newThirdColor]);
    }
  }

  return newImg;
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
  const newImg = img.copy();

  for (let j = 0; j < newImg.height; ++j) {
    mapLine(newImg, j, func);
  }

  return newImg;
}

/**
 * Saturates green color in an image
 * @param img An image
 * @returns A new image where each pixel has the green channel has been set to its maximum.
 */
export function mapToGreen(img: Image): Image {
  // TODO
  const newImg = imageMap(img, color => [color[0], 255, color[2]]);

  return newImg;
}

/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixels channel has been
 *  set as the truncated average of the other two
 */
export function mapFlipColors(img: Image): Image {
  // TODO
  return img.copy();
}
