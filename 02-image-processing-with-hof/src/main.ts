import { Image, COLORS } from "../include/image.js";
import { makeGrayish, imageMapCoord, imageBlur } from "./imageProcessingHOF.js";

const input = Image.create(10, 10, COLORS.WHITE);
const output = makeGrayish(input);

console.log(input.height);
console.log(output.height);

const art = Image.loadImageFromGallery("art");
imageMapCoord(art, (img, x, y) => {
  const c = img.getPixel(x, y);
  if (y % 2 === 0) {
    return [c[0], 0, 0];
  }

  return c;
}).show();

imageBlur(Image.loadImageFromGallery()).show();