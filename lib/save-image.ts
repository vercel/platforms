import { decode } from "blurhash";

import type { CloudinaryCallbackImage, UserSettings } from "@/types";

export async function saveImage<U = UserSettings | null>(
  imageData: CloudinaryCallbackImage,
  data: U,
  setData: (data: U) => void
): Promise<void> {
  try {
    const res = await fetch(`/api/blurhash?url=${imageData.url}`);

    if (res.ok) {
      const blurhash = await res.json();
      const pixels = decode(blurhash.hash, 32, 32);
      const image = getImgFromArr(pixels, 32, 32);

      setData({
        ...data,
        image: imageData.url,
        imageBlurhash: image.src,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export default saveImage;

/**
 * Get Image from Array
 *
 * Convert an Uint8ClampedArray to an image.
 *
 * TypeScript port of `array-to-image`.
 * @see https://github.com/vaalentin/array-to-image
 *
 * @param {Uint8ClampedArray} arr - Uint array of image data
 * @param {number} width - Width of the image
 * @param {number} height - Height of the image
 *
 * @returns
 */
export function getImgFromArr(
  arr: Uint8ClampedArray,
  width: number,
  height: number
): HTMLImageElement {
  if (typeof width === "undefined" || typeof height === "undefined") {
    width = height = Math.sqrt(arr.length / 4);
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  if (ctx) {
    const imgData = ctx.createImageData(width, height);
    imgData.data.set(arr);
    ctx.putImageData(imgData, 0, 0);
  }

  const img = document.createElement("img");
  img.src = canvas.toDataURL();

  return img;
}
