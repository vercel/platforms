import Layout from "@/components/app/Layout";
import useSWR, { mutate } from "swr";
import { useDebounce } from "use-debounce";
import { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useRouter } from "next/router";
import LoadingDots from "@/components/app/loading-dots";
import Loader from "@/components/app/Loader";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Post() {
  const router = useRouter();
  const { id } = router.query;
  const postId = id;

  const { data: post, isValidating } = useSWR(
    router.isReady && `/api/post?postId=${postId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000,
      onError: () => {
        router.push("/");
      },
    }
  );

  const [savedState, setSavedState] = useState(
    post
      ? `Last saved at ${Intl.DateTimeFormat("en", { month: "short" }).format(
          new Date(post.updatedAt)
        )} ${Intl.DateTimeFormat("en", { day: "2-digit" }).format(
          new Date(post.updatedAt)
        )} ${Intl.DateTimeFormat("en", {
          hour: "numeric",
          minute: "numeric",
        }).format(new Date(post.updatedAt))}`
      : "Saving changes..."
  );

  const [data, setData] = useState({
    title: "",
    description: "",
    content: "",
  });
  useEffect(() => {
    if (post)
      setData({
        title: post.title,
        description: post.description,
        content: post.content,
      });
  }, [post]);
  const [debouncedData] = useDebounce(data, 1000);

  useEffect(() => {
    if (debouncedData.title) saveChanges(debouncedData);
  }, [debouncedData]);

  const [publishing, setPublishing] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (data.title && data.description && data.content && !publishing)
      setDisabled(false);
    else setDisabled(true);
  }, [publishing, data]);

  useEffect(() => {
    const clickedSave = (e) => {
      let charCode = String.fromCharCode(e.which).toLowerCase();
      if ((e.ctrlKey || e.metaKey) && charCode === "s") {
        e.preventDefault();
        saveChanges(data);
      }
    };
    window.addEventListener("keydown", clickedSave);
    return () => {
      window.removeEventListener("keydown", clickedSave);
    };
  }, [data]);

  async function saveChanges(data) {
    setSavedState("Saving changes...");
    const response = await fetch("/api/post", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: postId,
        title: data.title,
        description: data.description,
        content: data.content,
      }),
    });
    if (response.ok) {
      const responseData = await response.json();
      setSavedState(
        `Last save ${Intl.DateTimeFormat("en", { month: "short" }).format(
          new Date(responseData.updatedAt)
        )} ${Intl.DateTimeFormat("en", { day: "2-digit" }).format(
          new Date(responseData.updatedAt)
        )} at ${Intl.DateTimeFormat("en", {
          hour: "numeric",
          minute: "numeric",
        }).format(new Date(responseData.updatedAt))}`
      );
    } else {
      setSavedState("Failed to save.");
    }
  }

  const publish = async () => {
    setPublishing(true);
    const response = await fetch(`/api/post`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: postId,
        title: data.title,
        description: data.description,
        content: data.content,
        published: true,
        subdomain: post.site.subdomain,
        customDomain: post.site.customDomain,
        slug: post.slug,
      }),
    });
    if (response.ok) {
      mutate(`/api/post?postId=${postId}`);
      router.push(`https://${post.site.subdomain}.vercel.pub/${post.slug}`);
    }
  };

  if (isValidating)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <>
      <Layout siteId={post?.site.id}>
        <div className="max-w-screen-xl mx-auto px-10 sm:px-20 mt-10 mb-16">
          <TextareaAutosize
            name="title"
            onInput={(e) => setData({ ...data, title: e.target.value })}
            className="w-full px-2 py-4 text-gray-800 placeholder-gray-400 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
            placeholder="Untitled Post"
            value={data.title}
          />
          <TextareaAutosize
            name="description"
            onInput={(e) => setData({ ...data, description: e.target.value })}
            className="w-full px-2 py-3 text-gray-800 placeholder-gray-400 text-xl mb-3 resize-none border-none focus:outline-none focus:ring-0"
            placeholder="No description provided. Click to edit."
            value={data.description}
          />

          <div className="relative mb-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
          </div>
          <TextareaAutosize
            name="content"
            onInput={(e) => setData({ ...data, content: e.target.value })}
            className="w-full px-2 py-3 text-gray-800 placeholder-gray-400 text-lg mb-5 resize-none border-none focus:outline-none focus:ring-0"
            placeholder={`Write some content. Markdown supported:

# A H1 header

## A H2 header

Fun fact: You embed tweets by pasting the tweet URL in a new line:

https://twitter.com/nextjs/status/1468044361082580995

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, and **bold**. Itemized lists look like:

  * this one
  * that one
  * the other one

Ordered lists look like:

  1. first item
  2. second item
  3. third item

> Block quotes are written like so.
>
> They can span multiple paragraphs,
> if you like.

            `}
            value={data.content}
          />
        </div>
        <footer className="h-20 z-5 fixed bottom-0 inset-x-0 border-solid border-t border-gray-500 bg-white">
          <div className="max-w-screen-xl mx-auto px-10 sm:px-20 h-full flex justify-between items-center">
            <div className="text-sm">
              <strong>
                <p>{post?.published ? "Published" : "Draft"}</p>
              </strong>
              <p>{savedState}</p>
            </div>
            <button
              onClick={async () => {
                await publish();
              }}
              title={
                disabled
                  ? "Post must have a title, description, and content to be published."
                  : "Publish"
              }
              disabled={disabled}
              className={`${
                disabled
                  ? "cursor-not-allowed bg-gray-300 border-gray-300"
                  : "bg-black hover:bg-white hover:text-black border-black"
              } mx-2 w-32 h-12 text-lg text-white border-2 focus:outline-none transition-all ease-in-out duration-150`}
            >
              {publishing ? <LoadingDots /> : "Publish  →"}
            </button>
          </div>
        </footer>
      </Layout>
    </>
  );
}
