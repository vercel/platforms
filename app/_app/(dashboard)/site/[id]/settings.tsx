import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR, { mutate } from "swr";

import BlurImage from "@/components/BlurImage";
import CloudinaryUploadWidget from "@/components/Cloudinary";
import DomainCard from "@/components/app/DomainCard";
import Layout from "@/components/app/Layout";
import LoadingDots from "@/components/app/loading-dots";
import Modal from "@/components/Modal";

import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Site } from "@prisma/client";

interface SettingsData
  extends Pick<
    Site,
    | "id"
    | "name"
    | "description"
    | "subdomain"
    | "customDomain"
    | "image"
    | "imageBlurhash"
  > {}

export default function SiteSettings() {
  const router = useRouter();
  const { id } = router.query;
  const siteId = id;

  const { data: settings } = useSWR<Site | null>(
    siteId && `/api/site?siteId=${siteId}`,
    fetcher,
    {
      onError: () => router.push("/"),
      revalidateOnFocus: false,
    }
  );

  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSite, setDeletingSite] = useState(false);

  const [data, setData] = useState<SettingsData>({
    id: "",
    name: null,
    description: null,
    subdomain: null,
    customDomain: null,
    image: null,
    imageBlurhash: null,
  });

  useEffect(() => {
    if (settings) setData(settings);
  }, [settings]);

  async function saveSiteSettings(data: SettingsData) {
    setSaving(true);

    try {
      const response = await fetch("/api/site", {
        method: HttpMethod.PUT,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentSubdomain: settings?.subdomain ?? undefined,
          ...data,
          id: siteId,
        }),
      });

      if (response.ok) {
        setSaving(false);
        mutate(`/api/site?siteId=${siteId}`);
        toast.success(`Changes Saved`);
      }
    } catch (error) {
      toast.error("Failed to save settings");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function deleteSite(siteId: string) {
    setDeletingSite(true);

    try {
      const response = await fetch(`/api/site?siteId=${siteId}`, {
        method: HttpMethod.DELETE,
      });

      if (response.ok) router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingSite(false);
    }
  }
  const [debouncedSubdomain] = useDebounce(data?.subdomain, 1500);
  const [subdomainError, setSubdomainError] = useState<string | null>(null);

  useEffect(() => {
    async function checkSubdomain() {
      try {
        const response = await fetch(
          `/api/domain/check?domain=${debouncedSubdomain}&subdomain=1`
        );

        const available = await response.json();

        setSubdomainError(
          available ? null : `${debouncedSubdomain}.vercel.pub`
        );
      } catch (error) {
        console.error(error);
      }
    }

    if (
      debouncedSubdomain !== settings?.subdomain &&
      debouncedSubdomain &&
      debouncedSubdomain?.length > 0
    )
      checkSubdomain();
  }, [debouncedSubdomain, settings?.subdomain]);

  async function handleCustomDomain() {
    const customDomain = data.customDomain;

    setAdding(true);

    try {
      const response = await fetch(
        `/api/domain?domain=${customDomain}&siteId=${siteId}`,
        {
          method: HttpMethod.POST,
        }
      );

      if (!response.ok)
        throw {
          code: response.status,
          domain: customDomain,
        };
      setError(null);
      mutate(`/api/site?siteId=${siteId}`);
    } catch (error) {
      setError(error);
    } finally {
      setAdding(false);
    }
  }

  return (
    <Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 10000,
        }}
      />
      <div className="max-w-screen-xl mx-auto px-10 sm:px-20 mt-20 mb-16">
        <h1 className="font-cal text-5xl mb-12">Site Settings</h1>
        <div className="mb-28 flex flex-col space-y-12">
          <div className="flex flex-col space-y-6">
            <h2 className="font-cal text-2xl">Site Name</h2>
            <div className="border border-gray-700 rounded-lg overflow-hidden flex items-center max-w-lg">
              <input
                className="w-full px-5 py-3 font-cal text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none placeholder-gray-400"
                name="name"
                onInput={(e) =>
                  setData((data) => ({
                    ...data,
                    name: (e.target as HTMLTextAreaElement).value,
                  }))
                }
                placeholder="Untitled Site"
                type="text"
                value={data.name || ""}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h2 className="font-cal text-2xl">Site Description</h2>
            <div className="border border-gray-700 rounded-lg overflow-hidden flex items-center max-w-lg">
              <textarea
                className="w-full px-5 py-3 font-cal text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none placeholder-gray-400"
                name="description"
                onInput={(e) =>
                  setData((data) => ({
                    ...data,
                    description: (e.target as HTMLTextAreaElement).value,
                  }))
                }
                placeholder="Lorem ipsum forem dimsum"
                rows={3}
                value={data?.description || ""}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <h2 className="font-cal text-2xl">Subdomain</h2>
            <div className="border border-gray-700 rounded-lg flex items-center max-w-lg">
              <input
                className="w-1/2 px-5 py-3 font-cal text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-l-lg placeholder-gray-400"
                name="subdomain"
                onInput={(e) =>
                  setData((data) => ({
                    ...data,
                    subdomain: (e.target as HTMLTextAreaElement).value,
                  }))
                }
                placeholder="subdomain"
                type="text"
                value={data.subdomain || ""}
              />
              <div className="w-1/2 h-12 flex justify-center items-center font-cal rounded-r-lg border-l border-gray-600 bg-gray-100">
                vercel.pub
              </div>
            </div>
            {subdomainError && (
              <p className="px-5 text-left text-red-500">
                <b>{subdomainError}</b> is not available. Please choose another
                subdomain.
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-6">
            <h2 className="font-cal text-2xl">Custom Domain</h2>
            {settings?.customDomain ? (
              <DomainCard data={data} />
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleCustomDomain();
                }}
                className="flex justify-start items-center space-x-3 max-w-lg"
              >
                <div className="border border-gray-700 flex-auto rounded-lg overflow-hidden">
                  <input
                    autoComplete="off"
                    className="w-full px-5 py-3 font-cal text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none placeholder-gray-400"
                    name="customDomain"
                    onInput={(e) => {
                      setData((data) => ({
                        ...data,
                        customDomain: (e.target as HTMLTextAreaElement).value,
                      }));
                    }}
                    pattern="^(?:[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$"
                    placeholder="mydomain.com"
                    value={data.customDomain || ""}
                    type="text"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black text-white border-black hover:text-black hover:bg-white px-5 py-3 w-28 font-cal border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150"
                >
                  {adding ? <LoadingDots /> : "Add"}
                </button>
              </form>
            )}
            {error && (
              <div className="text-red-500 text-left w-full max-w-2xl mt-5 text-sm flex items-center space-x-2">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  shapeRendering="geometricPrecision"
                  style={{ color: "#f44336" }}
                >
                  <circle cx="12" cy="12" r="10" fill="white" />
                  <path d="M12 8v4" stroke="#f44336" />
                  <path d="M12 16h.01" stroke="#f44336" />
                </svg>
                {error.code == 403 ? (
                  <p>
                    <b>{error.domain}</b> is already owned by another team.
                    <button
                      className="ml-1"
                      onClick={async (e) => {
                        e.preventDefault();
                        await fetch(
                          `/api/request-delegation?domain=${error.domain}`
                        ).then((res) => {
                          if (res.ok) {
                            toast.success(
                              `Requested delegation for ${error.domain}. Try adding the domain again in a few minutes.`
                            );
                          } else {
                            alert(
                              "There was an error requesting delegation. Please try again later."
                            );
                          }
                        });
                      }}
                    >
                      <u>Click here to request access.</u>
                    </button>
                  </p>
                ) : (
                  <p>
                    Cannot add <b>{error.domain}</b> since it&apos;s already
                    assigned to another project.
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-6 relative">
            <h2 className="font-cal text-2xl">Thumbnail Image</h2>
            <div
              className={`${
                data.image ? "" : "animate-pulse bg-gray-300 h-150"
              } relative mt-5 w-full border-2 border-gray-800 border-dashed rounded-md`}
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

              {data.image && (
                <BlurImage
                  alt="Cover Photo"
                  blurDataURL={data.imageBlurhash ?? undefined}
                  className="rounded-md w-full object-cover"
                  height={500}
                  placeholder="blur"
                  src={data.image}
                  width={800}
                />
              )}
            </div>
            <div className="w-full h-10" />
            <div className="flex flex-col space-y-6 max-w-lg">
              <h2 className="font-cal text-2xl">Delete Site</h2>
              <p>
                Permanently delete your site and all of its contents from our
                platform. This action is not reversible – please continue with
                caution.
              </p>
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                }}
                className="bg-red-500 text-white border-red-500 hover:text-red-500 hover:bg-white px-5 py-3 max-w-max font-cal border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150"
              >
                Delete Site
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal showModal={showDeleteModal} setShowModal={setShowDeleteModal}>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await deleteSite(siteId as string);
          }}
          className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
        >
          <h2 className="font-cal text-2xl mb-6">Delete Site</h2>
          <div className="grid gap-y-5 w-5/6 mx-auto">
            <p className="text-gray-600 mb-3">
              Are you sure you want to delete your site? This action is not
              reversible. Type in the full name of your site (<b>{data.name}</b>
              ) to confirm.
            </p>
            <div className="border border-gray-700 rounded-lg flex flex-start items-center overflow-hidden">
              <input
                className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                type="text"
                name="name"
                placeholder={data.name ?? ""}
                pattern={data.name ?? "Site Name"}
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-10 w-full">
            <button
              type="button"
              className="w-full px-5 py-5 text-sm text-gray-400 hover:text-black border-t border-gray-300 rounded-bl focus:outline-none focus:ring-0 transition-all ease-in-out duration-150"
              onClick={() => setShowDeleteModal(false)}
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={deletingSite}
              className={`${
                deletingSite
                  ? "cursor-not-allowed text-gray-400 bg-gray-50"
                  : "bg-white text-gray-600 hover:text-black"
              } w-full px-5 py-5 text-sm border-t border-l border-gray-300 rounded-br focus:outline-none focus:ring-0 transition-all ease-in-out duration-150`}
            >
              {deletingSite ? <LoadingDots /> : "DELETE SITE"}
            </button>
          </div>
        </form>
      </Modal>

      <footer className="h-20 z-20 fixed bottom-0 inset-x-0 border-solid border-t border-gray-500 bg-white">
        <div className="max-w-screen-xl mx-auto px-10 sm:px-20 h-full flex justify-end items-center">
          <button
            onClick={() => {
              saveSiteSettings(data);
            }}
            disabled={saving || subdomainError !== null}
            className={`${
              saving || subdomainError
                ? "cursor-not-allowed bg-gray-300 border-gray-300"
                : "bg-black hover:bg-white hover:text-black border-black"
            } mx-2 rounded-md w-36 h-12 text-lg text-white border-2 focus:outline-none transition-all ease-in-out duration-150`}
          >
            {saving ? <LoadingDots /> : "Save Changes"}
          </button>
        </div>
      </footer>
    </Layout>
  );
}
