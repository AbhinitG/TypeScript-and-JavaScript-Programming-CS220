import assert from "assert";
import { Color, COLORS, Image } from "../include/image.js";
import { imageMapIf, imageMapCoord } from "./imageProcessingHOF.js";

// Helper function to check if a color is equal to another one with an error of 1 (default)
function expectColorToBeCloseTo(actual: Color, expected: Color, error = 1) {
  [0, 1, 2].forEach(i => expect(Math.abs(actual[i] - expected[i])).toBeLessThanOrEqual(error));
}

describe("imageMapCoord", () => {
  function identity(img: Image, x: number, y: number) {
    return img.getPixel(x, y);
  }

  it("should return a different image", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapCoord(input, identity);
    assert(input !== output);
  });

  it("should return a different image with the same dimensions", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapCoord(input, identity);
    assert(input.width === output.width);
    assert(input.height === output.height);
  });

  // More tests for imageMapCoord go here.
  it("should apply the function passed in main.ts", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const identity = (img: Image, x: number, y: number): Color => {
      const c = img.getPixel(x, y);
      if (y % 2 === 0) {
        return [c[0], 0, 0];
      }
      return c;
    };
    const output = imageMapCoord(input, identity);

    for (let i = 0; i < output.width; ++i) {
      for (let j = 0; j < output.height; ++j) {
        const oldC = input.getPixel(i, j);
        const newC = output.getPixel(i, j);
        if (j % 2 === 0) {
          assert(newC[0] === oldC[0]);
          assert(newC[1] === 0);
          assert(newC[2] === 0);
        }
        else {
          assert(newC[0] === oldC[0]);
          assert(newC[1] === oldC[1]);
          assert(newC[2] == newC[2]);
        }
      }
    }
  });
});

describe("imageMapIf", () => {
  // More tests for imageMapIf go here
  it("should return a different image with the same dimensions", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapIf(input, (img: Image, x: number, y: number) => img.getPixel(x, y)[1] === 255, (p: Color): Color => [p[0], 255, p[2]]);
    assert(input.width === output.width);
    assert(input.height === output.height);
    assert(input !== output);
  });

  it("should saturate the green if the green hasn't been saturated but not change the other colors", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapIf(
      input,
      (img: Image, x: number, y: number) => img.getPixel(x, y)[1] === 255,
      (p: Color): Color => [p[0], 255, p[2]]
    );

    for (let i = 0; i < output.width; ++i) {
      for (let j = 0; j < output.height; ++j) {
        const oldC = input.getPixel(i, j);
        const newC = input.getPixel(i, j);

        if (oldC[1] !== 255) {
          assert(newC[1] == 255);
          assert(newC[1] !== oldC[1]);
        }
        assert(newC[0] === oldC[0]);
        assert(newC[2] === oldC[2]);
      }
    }
  });
});

describe("mapWindow", () => {
  // More tests for mapWindow go here
});

describe("isGrayish", () => {
  // More tests for isGrayish go here
});

describe("makeGrayish", () => {
  // More tests for makeGrayish go here
});

describe("pixelBlur", () => {
  // Tests for pixelBlur go here
});

describe("imageBlur", () => {
  // Tests for imageBlur go here
});