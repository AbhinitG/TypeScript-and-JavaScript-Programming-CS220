import assert from "assert";
import { Color, COLORS, Image } from "../include/image.js";
import {
  imageBlur,
  pixelBlur,
  makeGrayish,
  isGrayish,
  mapWindow,
  imageMapIf,
  imageMapCoord,
} from "./imageProcessingHOF.js";

// Helper function to check if a color is equal to another one with an error of 1 (default)
// function expectColorToBeCloseTo(actual: Color, expected: Color, error = 1) {
//   [1, 1, 2].forEach(i => expect(Math.abs(actual[i] - expected[i])).toBeLessThanOrEqual(error));
// }

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
        } else {
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
    const output = imageMapIf(
      input,
      (img: Image, x: number, y: number) => img.getPixel(x, y)[1] !== 255,
      (p: Color): Color => [p[0], 255, p[2]]
    );
    assert(input.width === output.width);
    assert(input.height === output.height);
    assert(input !== output);
  });

  it("should saturate the green if the green hasn't been saturated but not change the other colors", () => {
    const input = Image.create(10, 10, COLORS.RED);
    const output = imageMapIf(
      input,
      (img: Image, x: number, y: number) => img.getPixel(x, y)[1] !== 255,
      (p: Color): Color => [p[0], 255, p[2]]
    );

    for (let i = 0; i < output.width; ++i) {
      for (let j = 0; j < output.height; ++j) {
        const oldC = input.getPixel(i, j);
        const newC = input.getPixel(i, j);

        if (oldC[1] !== 255) {
          assert(newC[0] === oldC[0]);
          assert(newC[1] !== 255);
          assert(newC[2] === oldC[2]);
        } else {
          assert(newC[0] === oldC[0]);
          assert(newC[1] === oldC[1]);
          assert(newC[2] === oldC[2]);
        }
      }
    }
  });
});

describe("mapWindow", () => {
  it("should return a different image with the same dimensions", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const saturateGreen = (p: Color): Color => [p[0], 255, p[2]];
    const output = mapWindow(input, [3, 5], [2, 4], saturateGreen);

    assert(input.width === output.width);
    assert(input.height === output.height);
    assert(input !== output);
  });

  it("should saturate the pixels in range to green", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const saturateGreen = (p: Color): Color => [p[0], 255, p[2]];
    const output = mapWindow(input, [3, 5], [2, 4], saturateGreen);

    for (let i = 0; i < output.width; ++i) {
      for (let j = 0; j < output.height; ++j) {
        const oldC = input.getPixel(i, j);
        const newC = input.getPixel(i, j);

        if (i >= 3 && i <= 5 && j >= 2 && j <= 4) {
          assert(newC[0] == oldC[0]);
          assert(newC[1] == 255);
          assert(newC[2] == oldC[2]);
        } else {
          assert(newC[0] === oldC[0]);
          assert(newC[1] === oldC[1]);
          assert(newC[2] === oldC[2]);
        }
      }
    }
  });
});

describe("isGrayish", () => {
  // More tests for isGrayish go here
  it("should return false if the difference between the max and min is greater than 85", () => {
    const p: Color = [0, 29, 150];
    assert(!isGrayish(p));
  });

  it("should return true if the difference between the max and min is at most 85", () => {
    const p: Color = [30, 29, 100];
    assert(isGrayish(p));
  });
});

describe("makeGrayish", () => {
  // More tests for makeGrayish go here
  it("should return a different image with the same dimensions", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = makeGrayish(input);

    assert(input !== output);
    assert(input.width === output.width);
    assert(input.height === output.height);
  });

  it("should not change the color of the pixels in the image if isGrayish is true", () => {
    const p: Color = [0, 29, 150];
    const input = Image.create(10, 10, p);
    const output = makeGrayish(input);

    for (let i = 0; i < output.width; ++i) {
      for (let j = 0; j < output.height; ++j) {
        const oldC = input.getPixel(i, j);
        const newC = output.getPixel(i, j);

        if (isGrayish(oldC)) {
          assert(newC[0] === oldC[0]);
          assert(newC[1] === oldC[1]);
          assert(newC[2] === oldC[2]);
        }
      }
    }
  });

  it("should change the color of the pixels to the average of the rgb if isGrayish is false", () => {
    const p: Color = [30, 29, 100];
    const input = Image.create(10, 10, p);
    const output = makeGrayish(input);

    for (let i = 0; i < output.width; ++i) {
      for (let j = 0; j < output.height; ++j) {
        const oldC = input.getPixel(i, j);
        const newC = output.getPixel(i, j);

        if (!isGrayish(oldC)) {
          assert(newC[0] === Math.floor((oldC[0] + oldC[1] + oldC[2]) / 3));
          assert(newC[1] === Math.floor((oldC[0] + oldC[1] + oldC[2]) / 3));
          assert(newC[2] === Math.floor((oldC[0] + oldC[1] + oldC[2]) / 3));
        }
      }
    }
  });
});

describe("pixelBlur", () => {
  // Tests for pixelBlur go here
  it("should return a pixel with all rgb values of zero if x and y are not integers", () => {
    const p: Color = [0, 29, 150];
    const input = Image.create(10, 10, p);
    const output = pixelBlur(input, 13.1, 1.5);

    assert(output[0] === 0);
    assert(output[1] === 0);
    assert(output[2] === 0);
  });

  it("should return a pixel with all rgb values of zero if x and y are negative", () => {
    const p: Color = [0, 29, 150];
    const input = Image.create(10, 10, p);
    const output = pixelBlur(input, -5, -7);

    assert(output[0] === 0);
    assert(output[1] === 0);
    assert(output[2] === 0);
  });

  it("should return a color with the truncated mean of itself and its neighbors", () => {
    const input = Image.loadImageFromGallery("bike");
    const x = Math.floor(input.width / 2);
    const y = Math.floor(input.height / 2);
    const output = pixelBlur(input, x, y);
    let expected: Color = [0, 0, 0];

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

    for (let i = 0; i < neighbors.length; ++i) {
      const c = input.getPixel(neighbors[i][0], neighbors[i][1]);
      expected = [expected[0] + c[0], expected[1] + c[1], expected[2] + c[2]];
    }

    expected = [
      Math.floor(expected[0] / neighbors.length),
      Math.floor(expected[1] / neighbors.length),
      Math.floor(expected[2] / neighbors.length),
    ];

    assert(output[0] === expected[0]);
    assert(output[1] === expected[1]);
    assert(output[2] === expected[2]);
  });
});

describe("imageBlur", () => {
  // Tests for imageBlur go here
  it("should return a different image with the same dimensions", () => {
    const input = Image.loadImageFromGallery("bike");
    const output = imageBlur(input);

    assert(input !== output);
    assert(input.width === output.width);
    assert(input.height === output.height);
  });

  it("should apply pixelBlur to every pixel in the image", () => {
    const input = Image.loadImageFromGallery("bike");
    const output = imageBlur(input);

    for (let i = 0; i < output.width; ++i) {
      for (let j = 0; j < output.height; ++j) {
        const newC = output.getPixel(i, j);
        let expected: Color = [0, 0, 0];
        const neighbors = [
          [i, j],
          [i + 1, j],
          [i - 1, j],
          [i, j + 1],
          [i, j - 1],
          [i + 1, j + 1],
          [i + 1, j - 1],
          [i - 1, j - 1],
          [i - 1, j + 1],
        ];

        const filtered = neighbors.filter(e => e[0] >= 0 && e[0] < output.width && e[1] >= 0 && e[1] < output.height);

        for (let i = 0; i < filtered.length; ++i) {
          const c = input.getPixel(filtered[i][0], filtered[i][1]);
          expected = [expected[0] + c[0], expected[1] + c[1], expected[2] + c[2]];
        }

        expected = [
          Math.floor(expected[0] / filtered.length),
          Math.floor(expected[1] / filtered.length),
          Math.floor(expected[2] / filtered.length),
        ];

        assert(newC[0] === expected[0]);
        assert(newC[1] === expected[1]);
        assert(newC[2] === expected[2]);
      }
    }
  });
});