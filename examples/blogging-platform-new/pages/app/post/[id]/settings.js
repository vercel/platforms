import Layout from "@/components/app/Layout";
import useSWR from "swr";
import BlurImage from "@/components/BlurImage";
import CloudinaryUploadWidget from "@/components/Cloudinary";
import LoadingDots from "@/components/app/loading-dots";
import { decode } from "blurhash";
import { getImgFromArr } from "array-to-image";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Post() {
  const router = useRouter();
  const { id } = router.query;
  const postId = id;

  const { data: settings } = useSWR(
    `/api/get-post-data?postId=${postId}`,
    fetcher
  );

  const [saving, setSaving] = useState(false);

  const [data, setData] = useState({
    image: settings?.image,
    imageBlurhash: settings?.imageBlurhash,
  });

  useEffect(() => {
    if (settings)
      setData({
        slug: settings.slug,
        image: settings.image,
        imageBlurhash: settings.imageBlurhash,
      });
  }, [settings]);

  useEffect(async () => {
    if (data?.image) {
      const res = await fetch(`/api/blurhash?url=${data.image}`);
      if (res.ok) {
        const blurhash = await res.json();
        const pixels = decode(blurhash.hash, 32, 32);
        const image = getImgFromArr(pixels, 32, 32);
        setData((data) => ({
          ...data,
          imageBlurhash: image.src,
        }));
      }
    }
  }, [data?.image]);

  const saveImage = async (imageData) => {
    const res = await fetch(`/api/blurhash?url=${imageData.url}`);
    if (res.ok) {
      const blurhash = await res.json();
      const pixels = decode(blurhash.hash, 32, 32);
      const image = getImgFromArr(pixels, 32, 32);
      setData({ image: imageData.url, imageBlurhash: image.src });
    }
  };

  async function savePostSettings(data) {
    setSaving(true);
    const response = await fetch("/api/save-post-settings", {
      method: "POST",
      body: JSON.stringify({
        id: postId,
        slug: data.slug,
        image: data.image,
        imageBlurhash: data.imageBlurhash,
      }),
    });
    if (response.ok) {
      setSaving(false);
    }
  }

  return (
    <>
      <Layout>
        <div className="max-w-screen-xl mx-auto px-10 sm:px-20 mt-10 mb-16">
          <h1 className="font-cal text-5xl mb-12">Post Settings</h1>
          <div className="mb-28 flex flex-col space-y-6">
            <h2 className="font-cal text-2xl">Post Slug</h2>
            <div className="border border-gray-700 rounded-lg flex items-center max-w-lg">
              <span className="px-5 font-cal rounded-l-lg border-r border-gray-600">
                {settings?.site.subdomain}.vercel.pub/
              </span>
              <input
                className="w-full px-5 py-3 font-cal text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                type="text"
                name="slug"
                placeholder="post-slug"
                value={data?.slug}
                onInput={(e) =>
                  setData((data) => ({ ...data, slug: e.target.value }))
                }
              />
            </div>
            <h2 className="font-cal text-2xl">Thumbnail Image</h2>
            <div
              className={`${
                data.image ? "" : "animate-pulse bg-gray-300 h-150"
              } relative mt-5 w-full p-2 border-2 border-gray-800 border-dashed rounded-md`}
            >
              <CloudinaryUploadWidget callback={saveImage}>
                {({ open }) => (
                  <button
                    onClick={open}
                    className="absolute w-full h-full bg-gray-200 z-10 flex flex-col justify-center items-center opacity-0 hover:opacity-100 transition-all ease-linear duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100"
                      height="100"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 16h-3v5h-2v-5h-3l4-4 4 4zm3.479-5.908c-.212-3.951-3.473-7.092-7.479-7.092s-7.267 3.141-7.479 7.092c-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h3.5v-2h-3.5c-1.93 0-3.5-1.57-3.5-3.5 0-2.797 2.479-3.833 4.433-3.72-.167-4.218 2.208-6.78 5.567-6.78 3.453 0 5.891 2.797 5.567 6.78 1.745-.046 4.433.751 4.433 3.72 0 1.93-1.57 3.5-3.5 3.5h-3.5v2h3.5c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408z" />
                    </svg>
                    <p>Upload another image</p>
                  </button>
                )}
              </CloudinaryUploadWidget>

              {data.image && (
                <BlurImage
                  src={data.image}
                  alt="Cover Photo"
                  width={800}
                  height={500}
                  layout="responsive"
                  objectFit="cover"
                  placeholder="blur"
                  blurDataURL={data.imageBlurhash}
                />
              )}
            </div>
          </div>
        </div>
        <footer className="h-20 z-20 fixed bottom-0 inset-x-0 border-solid border-t border-gray-500 bg-white">
          <div className="max-w-screen-xl mx-auto px-10 sm:px-20 h-full flex justify-end items-center">
            <button
              onClick={() => {
                savePostSettings(data);
              }}
              disabled={saving}
              className={`${
                saving
                  ? "cursor-not-allowed bg-gray-300 border-gray-300"
                  : "bg-black hover:bg-white hover:text-black border-black"
              } mx-2 rounded-md w-36 h-12 text-lg text-white border-2 focus:outline-none transition-all ease-in-out duration-150`}
            >
              {saving ? <LoadingDots /> : "Save Changes"}
            </button>
          </div>
        </footer>
      </Layout>
    </>
  );
}
