import { useState } from "react";
import Layout from "@/components/app/Layout";
import BlurImage from "@/components/BlurImage";
import LoadingDots from "@/components/app/loading-dots";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function SiteDrafts() {
  const [creatingPost, setCreatingPost] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const siteId = id;

  const { data } = useSWR(
    siteId && `/api/get-posts?siteId=${siteId}&published=false`,
    fetcher
  );

  async function createPost(siteId) {
    const res = await fetch(`/api/create-post?siteId=${siteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/post/${data.postId}`);
    }
  }

  return (
    <Layout>
      <div className="py-20 max-w-screen-xl mx-auto px-10 sm:px-20">
        <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 justify-between items-center">
          <h1 className="font-cal text-5xl">
            {" "}
            Drafts for {data ? data?.site?.name : "..."}
          </h1>
          <button
            onClick={() => {
              setCreatingPost(true);
              createPost(siteId);
            }}
            className={`${
              creatingPost
                ? "cursor-not-allowed bg-gray-300 border-gray-300"
                : "text-white bg-black hover:bg-white hover:text-black border-black"
            } font-cal text-lg w-3/4 sm:w-40 tracking-wide border-2 px-5 py-3 transition-all ease-in-out duration-150`}
          >
            {creatingPost ? (
              <LoadingDots />
            ) : (
              <>
                New Draft <span className="ml-2">＋</span>
              </>
            )}
          </button>
        </div>
        <div className="my-10 grid gap-y-10">
          {data ? (
            data.posts.length > 0 ? (
              data.posts.map((post) => (
                <Link href={`/post/${post.id}`} key={post.id}>
                  <a>
                    <div className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200">
                      <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none">
                        <BlurImage
                          src={post.image}
                          layout="fill"
                          objectFit="cover"
                          alt={post.name}
                        />
                      </div>
                      <div className="relative p-10">
                        <h2 className="font-cal text-3xl">
                          {post.title || "Untitled Post"}
                        </h2>
                        <p className="text-base my-5">
                          {post.description ||
                            "No description provided. Click to edit."}
                        </p>
                        <a
                          href={`https://${data.site.subdomain}.vercel.pub/${post.slug}`}
                          target="_blank"
                          className="font-cal px-3 py-1 tracking-wide rounded bg-gray-200 text-gray-600 absolute bottom-5 left-10 whitespace-nowrap"
                        >
                          {data.site.subdomain}.vercel.pub/{post.slug} ↗
                        </a>
                      </div>
                    </div>
                  </a>
                </Link>
              ))
            ) : (
              <div className="text-center">
                <Image
                  src="/empty-state.png"
                  alt="No Drafts"
                  width={613}
                  height={420}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA6ZJREFUWEe1VwFuGzEMk2///+8uydmDSFGWfdduKLAUQYqsiyiKpJQ2xhj2t4f/RR82RreO18FX/xlm+oDWzKw1a63Z4c+Dz3YcX1ZoPwLQh/VBIF48O2he/78BiO57R3ECMIDAw7s3L27WvGswcCQT+IeHx78x4HR7Ye9cIygM5Oc+MnBgDD8HkDPvNgJAHz27XwRUAfj8G4tTBxDIjYPvGfAuUfSJfo7AH/4SE5gaQOE5Av/9iYWvAWzFvWvQXwVYDQTxFRF68dTCBLODeAYQImPnon7VgBxQOYUDQL1e5wj4njNCq2ocNwD4YPicxSm8+bsYcP7r/GW/BFE0IFBiBH8D0zQrADhTCKzM3YtfVQMhSrIf03fq/adSro4XRmhPPsO93av5R8lWpTgLx/Ny788k9No1ATOAQnjoOoTITFiL+3sg4epXhiE9ziIofrE4fycAx0uwMX11X4pA/bJfWHGCCOojvdr780EvSrU6dy98BYj5PgEU82X2q4gAZBo+da8RvN7vGwBR78UnEyHGGJX4l6Co8Ek7KQ8rSgfwqawaGjhfr0UDolydJ4gtimU/iK/ZLXS0BaclqQFuS7oQ//d8nWAUqzWiFtRj7hdGMEeh+U8DEkB0rgWkFIxVLBC5rmVBx/H7PJMBbLlQPQqX4hqLRFgZyC4lvtwBcwQ1J9h9iHEBgJjdCl8XnQAxcg0jhAY/5L7/vahccCzJmP6XBR3IIwOl8w8KcxRax0rBnwEIIYqB83whVNnYzACOYNeAr+Gwoe6Q5QKanSuEMoA2K4YKXYTFBQqgEGHqwIFEQtYg0gqGBm4CLIvoONYIzihu1pADxQV7BogJ2pNOSRZ4hH3jgpIDhQFYMc44JmHcdtqCsl3aT4GkpRRC1DGIHCjXD0Wo4gyouqaVAXi9PheDdVnDg/MP9e9xXBnQIYoUbKH64oJcSCUN5/lu1rrzGgCYA3sWEIgvJn/d7wGMwEdRL+ESRIslyyrObYhVuIyAAOoikhjzQsptyHsg7agVjHEcdvyqdyHZURbkDsldHCBuDJTusZ5xK8ZVHBtJQty3Ye1+2Q2xkKDD5ZuRg4gRLG74diXrC0lxQ45gzYX9MLkD8He6zSNEEby7YLOibDVvv1p4i+UaSDcG4sxzFpaLSJfRPoJylueyKafYPgJ9T6g74fEsH85CLbpdRvp2LPekosNqa+FtDPE3ukqfvxdoDBuIeq4td2Gc+uxsjeB0Q1nRPEx4lPwBA2anSbfNT08AAAAASUVORK5CYII="
                />
                <p className="text-2xl font-cal text-gray-600">
                  No drafts yet. Click "New Draft" to create one.
                </p>
              </div>
            )
          ) : (
            [0, 1].map((i) => (
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
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
