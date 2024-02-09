import assert from "assert";
import { COLORS, Image } from "../include/image.js";
import { mapFlipColors, mapToGreen, imageMap, mapLine, flipColors, saturateGreen } from "./imageProcessing.js";

describe("saturateGreen", () => {
  it("should maximize green in the upper left corner", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(0, 0);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");

    // or alternatively, using jest, if you'd like
    // https://jestjs.io/docs/expect#toequalvalue
    // Use expect with .toEqual to compare recursively all properties of object instances (also known as "deep" equality).

    expect(p).toEqual([0, 255, 0]);

    // This will produce output showing the exact differences between the two objects, which is really helpful
    // for debugging. However, again, please use the simpler assert syntax if this is too confusing.
    // Focus on making your tests well written and correct, rather than using one syntax or another.
  });

  it("should maximize green in the center", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(5, 7);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });

  // More tests for removeRed go here.
});

describe("flipColors", () => {
  it("should correctly flip top left corner", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(0, 0, [100, 0, 150]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(0, 0);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });

  // More tests for flipColors go here.
  it("should correctly flip bottom left corner", () => {
    const purpleImage = Image.create(10, 10, [160, 32, 240]);
    const flippedPurpleImage = flipColors(purpleImage);
    const p = flippedPurpleImage.getPixel(0, 9);

    assert(p[0] === Math.floor((32 + 240) / 2));
    assert(p[1] === Math.floor((160 + 240) / 2));
    assert(p[2] === Math.floor((160 + 32) / 2));
  });
});

describe("mapLine", () => {
  // Tests for mapLine go here.
  it("should not modify the image if lineNo is not valid", () => {
    const purpleImage = Image.create(10, 10, [160, 32, 240]);
    const copy = purpleImage.copy();

    mapLine(copy, 12, color => [color[0], 255, color[1]]);

    for (let i = 0; i < copy.width; ++i) {
      for (let j = 0; j < copy.height; ++j) {
        const copyColor = copy.getPixel(i, j);
        const ogColor = copy.getPixel(i, j);
        assert(copyColor[0] === ogColor[0]);
        assert(copyColor[1] === ogColor[1]);
        assert(copyColor[2] === ogColor[2]);
      }
    }
  });

  it("should modify the image with func at lineNo when lineNo is valid", () => {
    const purpleImage = Image.create(10, 10, [160, 32, 240]);
    mapLine(purpleImage, 4, color => [color[0], 255, color[2]]);

    // the green color should be saturated for all pixels at height 4
    for (let i = 0; i < purpleImage.width; ++i) {
      assert(purpleImage.getPixel(i, 4)[1] === 255);
    }
  });
});

describe("imageMap", () => {
  // Tests for imageMap go here.
  it("should create a new image with the same dimensions as img", () => {
    const purpleImage = Image.create(10, 10, [160, 32, 240]);
    const mappedImage = imageMap(purpleImage, color => [255, color[1], color[2]]);

    assert(mappedImage.width === purpleImage.width);
    assert(mappedImage.height === purpleImage.height);
  });

  it("should have the value of each pixel in the new image be a result of func", () => {
    const purpleImage = Image.create(10, 10, [160, 32, 240]);
    const mappedImage = imageMap(purpleImage, color => [255, color[1], color[2]]);

    // the red color of every pixel in the image should be saturated
    for (let i = 0; i < mappedImage.width; ++i) {
      for (let j = 0; j < mappedImage.height; ++j) {
        assert(mappedImage.getPixel(i, j)[0] === 255);
      }
    }
  });
});

describe("mapToGreen", () => {
  // Tests for mapToGreen go here.
  it("should create an image with the same dimensions as the result from saturateGreen", () => {
    const purpleImage = Image.create(10, 10, [160, 32, 240]);
    const imgFromSaturate = saturateGreen(purpleImage);
    const imgFromMap = mapToGreen(purpleImage);

    assert(imgFromSaturate.width === imgFromMap.width);
    assert(imgFromSaturate.height === imgFromMap.height);
  });

  it("should create an image with the same result as saturateGreen", () => {
    const purpleImage = Image.create(10, 10, [160, 32, 240]);
    const imgFromSaturate = saturateGreen(purpleImage);
    const imgFromMap = mapToGreen(purpleImage);

    for (let i = 0; i < imgFromMap.width; ++i) {
      for (let j = 0; j < imgFromMap.height; ++j) {
        const mapColors = imgFromMap.getPixel(i, j);
        const saturateColors = imgFromSaturate.getPixel(i, j);

        assert(mapColors[0] === saturateColors[0]);
        assert(mapColors[1] === saturateColors[1]);
        assert(mapColors[2] === saturateColors[2]);
      }
    }
  });
});

describe("mapFlipColors", () => {
  // Tests for mapFlipColors go here.
  it("should create an image with the same dimensions as the result from flipColors", () => {
    const purpleImage = Image.create(10, 10, [160, 32, 240]);
    const imgFromFlip = flipColors(purpleImage);
    const imgFromMap = mapFlipColors(purpleImage);

    assert(imgFromFlip.width === imgFromMap.width);
    assert(imgFromFlip.height === imgFromMap.height);
  });

  it("should create an image with the same result as flipColors", () => {
    const purpleImage = Image.create(10, 10, [160, 32, 240]);
    const imgFromFlip = flipColors(purpleImage);
    const imgFromMap = mapFlipColors(purpleImage);

    for (let i = 0; i < imgFromMap.width; ++i) {
      for (let j = 0; j < imgFromMap.height; ++j) {
        const mapColors = imgFromMap.getPixel(i, j);
        const flipColors = imgFromFlip.getPixel(i, j);

        assert(mapColors[0] === flipColors[0]);
        assert(mapColors[1] === flipColors[1]);
        assert(mapColors[2] === flipColors[2]);
      }
    }
  });
});
