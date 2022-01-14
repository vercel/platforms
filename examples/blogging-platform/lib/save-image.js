import { decode } from "blurhash";
import { getImgFromArr } from "array-to-image";

const saveImage = async (imageData, data, setData) => {
  const res = await fetch(`/api/blurhash?url=${imageData.url}`);
  if (res.ok) {
    const blurhash = await res.json();
    const pixels = decode(blurhash.hash, 32, 32);
    const image = getImgFromArr(pixels, 32, 32);
    setData({ ...data, image: imageData.url, imageBlurhash: image.src });
  }
};

export default saveImage;
