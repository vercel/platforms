import Layout from "@/components/app/Layout";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useRouter } from "next/router";
import LoadingDots from "@/components/app/loading-dots";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Post() {
  const router = useRouter();
  const { id } = router.query;
  const postId = id;

  const { data: post } = useSWR(
    `/api/get-post-data?postId=${postId}`,
    fetcher,
    {
      fallbackData: {
        updatedAt: "2021-06-26T22:39:53.071Z",
        title: "",
        description: "",
        content: "",
        site: {
          id: "",
        },
      },
      revalidateOnMount: true,
    }
  );

  const [savedState, setSavedState] = useState(
    `Last saved at ${Intl.DateTimeFormat("en", { month: "short" }).format(
      new Date(post.updatedAt)
    )} ${Intl.DateTimeFormat("en", { day: "2-digit" }).format(
      new Date(post.updatedAt)
    )} ${Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(post.updatedAt))}`
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

  //   useEffect(() => {
  //     if (firstRender.current) {
  //       setSavedState("Unsaved changes");
  //       let timer = setTimeout(() => {
  //         saveChanges(data);
  //       }, 3000);
  //       return () => {
  //         clearTimeout(timer);
  //       };
  //     } else {
  //       firstRender.current = true;
  //     }
  //   }, [title, description, content]);

  async function saveChanges(data) {
    setSavedState("Saving changes...");
    const response = await fetch("/api/save-post", {
      method: "POST",
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

  const publish = async (postId) => {
    setPublishing(true);
    await saveChanges(data);
    const response = await fetch(`/api/publish-post?postId=${postId}`, {
      method: "POST",
    });
    await response.json();
    router.push(`https://${post.site.subdomain}.vercel.pub/${post.slug}`);
  };

  return (
    <>
      <Layout siteId={post.site.id}>
        <div className="max-w-screen-xl mx-auto px-10 sm:px-20 mt-10 mb-16">
          <TextareaAutosize
            name="title"
            onInput={(e) => setData({ ...data, title: e.target.value })}
            className="w-full px-2 py-4 text-gray-800 placeholder-gray-500 mt-6 text-5xl font-cal resize-none border-none focus:outline-none focus:ring-0"
            placeholder="Untitled Post"
            value={data.title}
          />
          <TextareaAutosize
            name="description"
            onInput={(e) => setData({ ...data, description: e.target.value })}
            className="w-full px-2 py-3 text-gray-800 placeholder-gray-500 text-xl mb-3 resize-none border-none focus:outline-none focus:ring-0"
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
            className="w-full px-2 py-3 text-gray-800 placeholder-gray-500 text-lg mb-5 resize-none border-none focus:outline-none focus:ring-0"
            placeholder="Write some content here..."
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
                await publish(postId);
              }}
              disabled={publishing}
              className={`${
                publishing
                  ? "cursor-not-allowed bg-gray-300 border-gray-300"
                  : "bg-black hover:bg-white hover:text-black border-black"
              } mx-2 rounded-md w-32 h-12 text-lg text-white border-2 focus:outline-none transition-all ease-in-out duration-150`}
            >
              {publishing ? <LoadingDots /> : "Publish  →"}
            </button>
          </div>
        </footer>
      </Layout>
    </>
  );
}
