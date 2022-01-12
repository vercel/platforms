import { useState } from "react";
import Layout from "@/components/app/Layout";
import BlurImage from "@/components/BlurImage";
import Modal from "@/components/Modal";
import LoadingDots from "@/components/app/loading-dots";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function AppIndex() {
  const [showModal, setShowModal] = useState(false);
  const [creatingSite, setCreatingSite] = useState(false);

  const router = useRouter();

  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const { data: sites } = useSWR(
    sessionId && `/api/get-sites?sessionId=${sessionId}`,
    fetcher
  );

  async function createSite(e) {
    const res = await fetch("/api/create-site", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: sessionId,
        name: e.target.name.value,
        subdomain: e.target.subdomain.value,
        description: e.target.description.value,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/site/${data.siteId}`);
    }
  }

  return (
    <Layout>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setCreatingSite(true);
            createSite(event);
          }}
          className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all transform bg-white shadow-xl rounded-lg"
        >
          <h2 className="font-cal text-2xl mb-6">Create a New Site</h2>
          <div className="grid gap-y-5 w-5/6 mx-auto">
            <div className="border border-gray-700 rounded-lg flex flex-start items-center">
              <span className="pl-5 pr-1">📌</span>
              <input
                className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                type="text"
                name="name"
                placeholder="Site Name"
              />
            </div>
            <div className="border border-gray-700 rounded-lg flex flex-start items-center">
              <span className="pl-5 pr-1">🪧</span>
              <input
                className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-l-lg placeholder-gray-400"
                type="text"
                name="subdomain"
                placeholder="Subdomain"
              />
              <span className="px-5 bg-gray-100 h-full flex items-center rounded-r-lg border-l border-gray-600">
                .vercel.pub
              </span>
            </div>
            <div className="border border-gray-700 rounded-lg flex flex-start items-top">
              <span className="pl-5 pr-1 mt-3">✍️</span>
              <textarea
                required
                name="description"
                rows="3"
                className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                placeholder="Description"
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-10 w-full">
            <button
              className="w-full px-5 py-5 text-sm text-gray-400 hover:text-black border-t border-gray-300 rounded-bl focus:outline-none focus:ring-0 transition-all ease-in-out duration-150"
              onClick={() => setShowModal(false)}
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={creatingSite}
              className={`${
                creatingSite
                  ? "cursor-not-allowed bg-gray-50"
                  : "bg-white hover:text-black"
              } w-full px-5 py-5 text-sm text-gray-400 border-t border-l border-gray-300 rounded-br focus:outline-none focus:ring-0 transition-all ease-in-out duration-150`}
            >
              {creatingSite ? <LoadingDots /> : "CREATE SITE"}
            </button>
          </div>
        </form>
      </Modal>

      <div className="py-20 max-w-screen-xl mx-auto px-10 sm:px-20">
        <div className="flex justify-between items-center">
          <h1 className="font-cal text-5xl">My Sites</h1>
          <button
            onClick={() => setShowModal(true)}
            className="font-cal text-lg tracking-wide text-white bg-black border-black border-2 px-5 py-3 hover:bg-white hover:text-black transition-all ease-in-out duration-150"
          >
            New Site <span className="ml-2">＋</span>
          </button>
        </div>
        <div className="my-10 grid gap-y-10">
          {sites
            ? sites.map((site) => (
                <Link href={`/site/${site.id}`} key={site.id}>
                  <a>
                    <div className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200">
                      <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none">
                        <BlurImage
                          src={site.image}
                          layout="fill"
                          objectFit="cover"
                          alt={site.name}
                        />
                      </div>
                      <div className="relative p-10">
                        <h2 className="font-cal text-3xl">{site.name}</h2>
                        <p className="text-base my-5">{site.description}</p>
                        <a
                          href={`${site.subdomain}.vercel.pub`}
                          target="_blank"
                          className="font-cal px-3 py-1 tracking-wide rounded bg-gray-200 text-gray-600 absolute bottom-5 left-10"
                        >
                          {site.subdomain}.vercel.pub ↗
                        </a>
                      </div>
                    </div>
                  </a>
                </Link>
              ))
            : [0, 1].map((i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200"
                >
                  <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none bg-gray-300 animate-pulse" />
                  <div className="relative p-10 grid gap-5">
                    <div className="w-28 h-10 rounded-md bg-gray-300 animate-pulse" />
                    <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                    <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                    <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </Layout>
  );
}
