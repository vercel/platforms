import { useState } from "react";
import Layout from "@/components/app/Layout";
import BlurImage from "@/components/BlurImage";
import LoadingDots from "@/components/app/loading-dots";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function SiteDrafts() {
  const [creatingPost, setCreatingPost] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const siteId = id;

  const { data } = useSWR(
    siteId && `/api/post?siteId=${siteId}&published=false`,
    fetcher,
    {
      onSuccess: (data) => {
        if (!data?.site) {
          router.push("/");
        }
      },
    }
  );

  async function createPost(siteId) {
    const res = await fetch(`/api/post?siteId=${siteId}`, {
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
              <>
                <div className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200">
                  <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none bg-gray-300" />
                  <div className="relative p-10 grid gap-5">
                    <div className="w-28 h-10 rounded-md bg-gray-300" />
                    <div className="w-48 h-6 rounded-md bg-gray-300" />
                    <div className="w-48 h-6 rounded-md bg-gray-300" />
                    <div className="w-48 h-6 rounded-md bg-gray-300" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-cal text-gray-600">
                    No drafts yet. Click "New Draft" to create one.
                  </p>
                </div>
              </>
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
