"use client";

import { BlobResult } from "@vercel/blob";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import LoadingDots from "@/components/icons/loading-dots";

export default function Uploader() {
  const [data, setData] = useState<{
    image: string | null;
  }>({
    image: null,
  });
  const [file, setFile] = useState<File | null>(null);

  const [dragActive, setDragActive] = useState(false);

  const onChangePicture = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          toast.error("File size too big (max 50MB)");
        } else {
          setFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setData((prev) => ({ ...prev, image: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setData],
  );

  const [saving, setSaving] = useState(false);

  const saveDisabled = useMemo(() => {
    return !data.image || saving;
  }, [data.image, saving]);

  return (
    <form
      className="grid gap-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        fetch("/api/upload", {
          body: file,
          headers: { "content-type": file?.type || "application/octet-stream" },
          method: "POST",
        }).then(async (res) => {
          if (res.status === 200) {
            const { url } = (await res.json()) as BlobResult;
            toast(
              <div className="relative">
                <div className="p-2">
                  <p className="font-semibold text-gray-900">File uploaded!</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Your file has been uploaded to{" "}
                    <a
                      className="font-medium text-gray-900 underline"
                      href={url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {url}
                    </a>
                  </p>
                </div>
              </div>,
            );
          } else {
            const error = await res.text();
            toast.error(error);
          }
          setSaving(false);
        });
      }}
    >
      <div>
        <div className="mb-4 space-y-1">
          <h2 className="text-xl font-semibold">Upload a file</h2>
          <p className="text-sm text-gray-500">
            Accepted formats: .png, .jpg, .gif, .mp4
          </p>
        </div>
        <label
          className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
          htmlFor="image-upload"
        >
          <div
            className="absolute z-[5] h-full w-full rounded-md"
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);

              const file = e.dataTransfer.files && e.dataTransfer.files[0];
              if (file) {
                if (file.size / 1024 / 1024 > 50) {
                  toast.error("File size too big (max 50MB)");
                } else {
                  setFile(file);
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setData((prev) => ({
                      ...prev,
                      image: e.target?.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
          />
          <div
            className={`${
              dragActive ? "border-2 border-black" : ""
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
              data.image
                ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                : "bg-white opacity-100 hover:bg-gray-50"
            }`}
          >
            <svg
              className={`${
                dragActive ? "scale-110" : "scale-100"
              } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            <p className="mt-2 text-center text-sm text-gray-500">
              Drag and drop or click to upload.
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              Max file size: 50MB
            </p>
            <span className="sr-only">Photo upload</span>
          </div>
          {data.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="Preview"
              className="h-full w-full rounded-md object-cover"
              src={data.image}
            />
          )}
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            accept="image/*"
            className="sr-only"
            id="image-upload"
            name="image"
            onChange={onChangePicture}
            type="file"
          />
        </div>
      </div>

      <button
        className={`${
          saveDisabled
            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
            : "border-black bg-black text-white hover:bg-white hover:text-black"
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
        disabled={saveDisabled}
      >
        {saving ? (
          <LoadingDots color="#808080" />
        ) : (
          <p className="text-sm">Confirm upload</p>
        )}
      </button>
    </form>
  );
}
