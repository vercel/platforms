import { useState } from "react";
import Layout from "@/components/app/Layout";
import BlurImage from "@/components/BlurImage";
import Modal from "@/components/Modal";
import LoadingDots from "@/components/app/loading-dots";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";

const data = [
  {
    id: "yrguykasd2324fwbhe",
    name: "Pleasr Blog",
    subdomain: "pleasr",
    description:
      "PleasrDAO is a collective of DeFi leaders, early NFT collectors and digital artists who have built a formidable yet benevolent reputation for acquiring culturally significant pieces with a charitable twist.",
    image:
      "http://res.cloudinary.com/daojones/image/upload/v1637743458/zck20kzjidjswosrzo3f.jpg",
    imageBlurhash:
      "data:image/png;base64,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",
  },
  {
    id: "sahdk2y3ui627dw",
    name: "Klima Blog",
    subdomain: "klima",
    description:
      "Drive climate action and earn rewards with a carbon-backed, algorithmic digital currency.",
    image:
      "http://res.cloudinary.com/daojones/image/upload/v1637658634/qs2u10bnxs4uwmpwgnzs.png",
    imageBlurhash:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABJJJREFUWEftV2FvG1UQnGc79EslUBpSoE2T1hJRS9O0QkKI//+XgNjn20Wzs/v87FgoH5D40iinuzi+29mZ3dm99vmPewcAd4ebwyzPbrA4HLYw+MLhSwfOHG0FtDMeDQteLxvaEkDLw/U8mx22c8yTYbc17DYzdhvDxPPWME+ORgBOCATAmwKE6UwAMHhjcBOAHhwCsmo6LxragqkA8TgmMjvmHQPpYHCCmOJs2BHAp98/EW/8RvYB4gQAsrAaABQQAlgmC8kAEwpGE4AVA2ThIQEUA3e/fQwCgoHIWgB0LQYsGHAgGKAMyn5xltlTAmafDMTjeH9JQBZSAmU/SPDh1/cVX7QxaMrg8L0EIwMrdCkWDM6/KcEJBiwkYB1I/7EGjBLc3v+8L0JSR/qDjVBfEMjAwiJoMBDaDzVQDJwEkHVABrYFYsa8UV209S/rKIAqRAVPJlwQGLx3QQYOGah91kAxENmMEswG1sDYCfNGAIKB69tr3ZNd0NuxgpMHtiAZyC4QE8nAsol+6j8yUO3MNowamKMOGJwy2MbgW0d7tX71GECAyexHAKSf/V4AeB30E0QCUC69C2xgoAAwuD0A2ALt5fXLYi1uEhOmB4QHiAFQhmIgqGfwAqAi7PQPPhAA0gtsy8xdwQvAxdVFMiALicBuuu4Akv5ltaOC0wEDBBloDU4JuqtmK+4IwKMObOuwDQAefwOYgPbi9bl8oOogTCnpbwYEAwaQhQDA4Lyu4AlgQchCoDo6BOCTw7aAbzN7MkAA51fnGb9KYcieYAoAgycIUZ9H6u80gSYb7q46yw0pgU0KHgDIQAG4uHlR90j/f2Ggu2EPrhpQ9T+WIKyd9AcAh08IFgIADzJwuf7+sAhL+zyLgaENg/603dI/bHgowhMSRA2MMhAIAfx4+0N3wq4fjovwBIAOolowmZCt9WmoeSAjii4YQeyA9vqDfEDUSwK14GEb7gsx7XioAZnQWAMqwhhqKUGN5AARQAAngDd3VwcS9ODsBM6AMKL0gqENYwGJVqw2PDKiwQnFwCxLphsmEwTX3t7fRL6d/s5CjiLWANtx7II0IYEYRnH3gf1CEhLkLCCIPQCx0959fnsoAfeBQQILANWCBLKXoK9iWYRUoVqqr3fMPoxIwTkRiwEaVFt/eefaydJAaihpEziQYL+UJPW1CcU+mEXYBxtyIdlbsbLXMhJdEQzci4FDALkT5D5IFuiEmgVqw5oFwUIykEaYdg6Z0NEwKgYIRjVwd9M3or6YlhVnIQaAXoC5kORUPA0ga4CbVcyCXExLAk5DskAA1+/fHG5Ep6Zh1kAx0LOPYjzFwDEArWS1FzI4FxLOh/9/H7j86bKPY43i2M/TkIZ9YHgvqG0oss9W1Eh+3AUlQWRN2h8czlH8l+quffv8O9lADy4b1UjOcdzXca3ksRHxzEG00kqmjUjz4HgcaxQ7nBPwTwBzlX28XT07GMfIOZDvN/tv1hXN5hmAbxLECtoRmH29GQm/Ak1avSJjfnb001prvQ0f//uJnxBUDSfeUsGf8OT/BsATcZ762lcA/wAeeKT1j7KTEQAAAABJRU5ErkJggg==",
  },
];
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
