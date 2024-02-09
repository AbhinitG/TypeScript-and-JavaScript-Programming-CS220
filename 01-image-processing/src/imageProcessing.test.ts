import assert from "assert";
import { COLORS, Image } from "../include/image.js";
import { flipColors, saturateGreen } from "./imageProcessing.js";

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

  // More tests for saturateGreen go here.
  it("should maximize green for every pixel but not change the others", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);

    for (let i = 0; i < gbImage.width; ++i) {
      for (let j = 0; j < gbImage.height; ++j) {
        const newP = gbImage.getPixel(i, j);
        const ogP = blackImage.getPixel(i, j);

        assert(newP[0] === ogP[0], "The red channel should not have changed.")
        assert(newP[1] === 255, "The green channel should be saturated.")
        assert(newP[2] === ogP[2], "The blue channel should not have changed.")
      }
    }
  });
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
  it("should correctly flip every pixel", () => {
    const purpleImage = Image.create(10, 10, [160, 32, 240]);
    const flippedPurpleImage = flipColors(purpleImage);

    for (let i = 0; i < flippedPurpleImage.width; ++i) {
      for (let j = 0; j < flippedPurpleImage.height; ++j) {
        const newP = flippedPurpleImage.getPixel(i, j);
        const ogP = purpleImage.getPixel(i, j);

        assert(newP[0] === Math.floor(Math.floor((ogP[1] + ogP[2]) / 2)));
        assert(newP[1] === Math.floor(Math.floor((ogP[0] + ogP[2]) / 2)));
        assert(newP[2] === Math.floor(Math.floor((ogP[0] + ogP[1]) / 2)));
      }
    }
  });
});

describe("mapLine", () => {
  // Tests for mapLine go here.
});

describe("imageMap", () => {
  // Tests for imageMap go here.
});

describe("mapToGreen", () => {
  // Tests for mapToGreen go here.
});

describe("mapFlipColors", () => {
  // Tests for mapFlipColors go here.
});
