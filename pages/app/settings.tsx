import Layout from "@/components/app/Layout";
import toast, { Toaster } from "react-hot-toast";
import BlurImage from "@/components/BlurImage";
import CloudinaryUploadWidget from "@/components/Cloudinary";
import LoadingDots from "@/components/app/loading-dots";
import { HttpMethod } from "@/types";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import type { UserSettings } from "@/types";

export default function AppSettings() {
  const { data: session } = useSession();

  const [saving, setSaving] = useState<boolean>(false);
  const [data, setData] = useState<UserSettings | null>(null);

  useEffect(() => {
    if (session)
      setData({
        ...session.user,
      });
  }, [session]);

  async function saveSettings(data: UserSettings | null) {
    setSaving(true);
    const response = await fetch("/api/save-settings", {
      method: HttpMethod.POST,
      body: JSON.stringify({
        ...data,
      }),
    });
    if (response.ok) {
      setSaving(false);
      toast.success(`Changes Saved`);
    }
  }

  return (
    <>
      <Layout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 10000,
          }}
        />
        <div className="max-w-screen-xl mx-auto px-10 sm:px-20 mt-10 mb-16">
          <h1 className="font-cal text-5xl mb-12">Settings</h1>
          <div className="mb-28 flex flex-col space-y-12">
            <div className="space-y-6">
              <h2 className="font-cal text-2xl">Name</h2>
              <div className="border border-gray-700 rounded-lg flex items-center max-w-lg overflow-hidden">
                <input
                  className="w-full px-5 py-3 font-cal text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-lg placeholder-gray-400"
                  type="text"
                  name="name"
                  placeholder="Your awesome name"
                  value={data?.name || ""}
                  onInput={(e) =>
                    setData({
                      ...data,
                      name: (e.target as HTMLTextAreaElement).value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="font-cal text-2xl">Email</h2>
              <div className="border border-gray-700 rounded-lg flex items-center max-w-lg overflow-hidden">
                <input
                  className="w-full px-5 py-3 font-cal text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-lg placeholder-gray-400"
                  type="email"
                  name="email"
                  placeholder="panic@thedis.co"
                  value={data?.email || ""}
                  onInput={(e) =>
                    setData({
                      ...data,
                      email: (e.target as HTMLTextAreaElement).value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="font-cal text-2xl">Display Picture</h2>
              <div
                className={`${
                  data?.image ? "" : "animate-pulse bg-gray-300 h-150"
                } relative mt-5 w-48 border-2 border-gray-800 border-dashed rounded-md`}
              >
                <CloudinaryUploadWidget
                  callback={(e) =>
                    setData({
                      ...data,
                      image: e.secure_url,
                    })
                  }
                >
                  {({ open }) => (
                    <button
                      onClick={open}
                      className="absolute w-full h-full rounded-md bg-gray-200 z-10 flex flex-col justify-center items-center opacity-0 hover:opacity-100 transition-all ease-linear duration-200"
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

                {data?.image && (
                  <BlurImage
                    src={data.image}
                    alt="Cover Photo"
                    width={100}
                    height={100}
                    className="rounded-md w-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <footer className="h-20 z-20 fixed bottom-0 inset-x-0 border-solid border-t border-gray-500 bg-white">
          <div className="max-w-screen-xl mx-auto px-10 sm:px-20 h-full flex justify-end items-center">
            <button
              onClick={() => {
                saveSettings(data);
              }}
              disabled={saving}
              className={`${
                saving
                  ? "cursor-not-allowed bg-gray-300 border-gray-300"
                  : "bg-black hover:bg-white hover:text-black border-black"
              } mx-2 w-36 h-12 text-lg text-white border-2 focus:outline-none transition-all ease-in-out duration-150`}
            >
              {saving ? <LoadingDots /> : "Save Changes"}
            </button>
          </div>
        </footer>
      </Layout>
    </>
  );
}
