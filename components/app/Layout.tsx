import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { signOut } from "next-auth/react";
import Loader from "./Loader";
import useRequireAuth from "../../lib/useRequireAuth";

import type { WithChildren } from "@/types";

interface LayoutProps extends WithChildren {
  siteId?: string;
}

export default function Layout({ siteId, children }: LayoutProps) {
  const title = "Platforms on Vercel";
  const description =
    "Create a fullstack application with multi-tenancy and custom domains support using Next.js, Prisma, and PostgreSQL";
  const logo = "/favicon.ico";
  const router = useRouter();
  const sitePage = router.pathname.startsWith("/app/site/[id]");
  const postPage = router.pathname.startsWith("/app/post/[id]");
  const rootPage = !sitePage && !postPage;
  const tab = rootPage
    ? router.asPath.split("/")[1]
    : router.asPath.split("/")[3];

  const session = useRequireAuth();
  if (!session) return <Loader />;

  return (
    <>
      <div>
        <Head>
          <title>{title}</title>
          <link rel="icon" href={logo} />
          <link rel="shortcut icon" type="image/x-icon" href={logo} />
          <link rel="apple-touch-icon" sizes="180x180" href={logo} />
          <meta name="theme-color" content="#7b46f6" />

          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <meta itemProp="name" content={title} />
          <meta itemProp="description" content={description} />
          <meta itemProp="image" content={logo} />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={logo} />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@Vercel" />
          <meta name="twitter:creator" content="@StevenTey" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={logo} />
        </Head>
        <div className="absolute left-0 right-0 h-16 border-b bg-white border-gray-200">
          <div className="flex justify-between items-center h-full max-w-screen-xl mx-auto px-10 sm:px-20">
            <div className="flex space-x-4">
              <Link href="/">
                <a className="flex justify-center items-center">
                  {session.user && session.user.image && (
                    <div className="h-8 w-8 inline-block rounded-full overflow-hidden align-middle">
                      <Image
                        src={session.user.image}
                        width={40}
                        height={40}
                        alt={session.user.name ?? "User avatar"}
                      />
                    </div>
                  )}
                  <span className="sm:block inline-block ml-3 font-medium truncate">
                    {session.user?.name}
                  </span>
                </a>
              </Link>
              <div className="h-8 border border-gray-300" />
              <button
                className="text-gray-500 hover:text-gray-700 transition-all ease-in-out duration-150"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
            <a
              className="font-cal flex items-center space-x-2 text-gray-700 px-5 py-3 sm:hover:text-black sm:hover:bg-white transition-all ease-in-out duration-150"
              href="https://github.com/vercel/platforms"
              rel="noreferrer"
              target="_blank"
            >
              <p className="hidden sm:block">Build my own</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
        {rootPage && (
          <div className="absolute left-0 right-0 top-16 flex justify-center items-center font-cal space-x-16 border-b bg-white border-gray-200">
            <Link href="/" passHref>
              <a
                className={`border-b-2 ${
                  tab == "" ? "border-black" : "border-transparent"
                } py-3`}
              >
                My Sites
              </a>
            </Link>
            <Link href="/settings" passHref>
              <a
                className={`border-b-2 ${
                  tab == "settings" ? "border-black" : "border-transparent"
                } py-3`}
              >
                Settings
              </a>
            </Link>
          </div>
        )}
        {sitePage && (
          <div className="absolute left-0 right-0 top-16 font-cal border-b bg-white border-gray-200">
            <div className="flex justify-between items-center space-x-16 max-w-screen-xl mx-auto px-10 sm:px-20">
              <Link href="/" passHref>
                <a>
                  ←<p className="md:inline-block ml-3 hidden">All Sites</p>
                </a>
              </Link>
              <div className="flex justify-between items-center space-x-10 md:space-x-16">
                <Link href={`/site/${router.query.id}`} passHref>
                  <a
                    className={`border-b-2 ${
                      !tab ? "border-black" : "border-transparent"
                    } py-3`}
                  >
                    Posts
                  </a>
                </Link>
                <Link href={`/site/${router.query.id}/drafts`} passHref>
                  <a
                    className={`border-b-2 ${
                      tab == "drafts" ? "border-black" : "border-transparent"
                    } py-3`}
                  >
                    Drafts
                  </a>
                </Link>
                <Link href={`/site/${router.query.id}/settings`} passHref>
                  <a
                    className={`border-b-2 ${
                      tab == "settings" ? "border-black" : "border-transparent"
                    } py-3`}
                  >
                    Settings
                  </a>
                </Link>
              </div>
              <div />
            </div>
          </div>
        )}
        {postPage && (
          <div className="absolute left-0 right-0 top-16 font-cal border-b bg-white border-gray-200">
            <div className="flex justify-between items-center space-x-16 max-w-screen-xl mx-auto px-10 sm:px-20">
              {siteId ? (
                <Link href={`/site/${siteId}`} passHref>
                  <a>
                    ←<p className="md:inline-block ml-3 hidden">All Posts</p>
                  </a>
                </Link>
              ) : (
                <div>
                  {" "}
                  ←<p className="md:inline-block ml-3 hidden">All Posts</p>
                </div>
              )}

              <div className="flex justify-between items-center space-x-10 md:space-x-16">
                <Link href={`/post/${router.query.id}`} passHref>
                  <a
                    className={`border-b-2 ${
                      !tab ? "border-black" : "border-transparent"
                    } py-3`}
                  >
                    Editor
                  </a>
                </Link>
                <Link href={`/post/${router.query.id}/settings`} passHref>
                  <a
                    className={`border-b-2 ${
                      tab == "settings" ? "border-black" : "border-transparent"
                    } py-3`}
                  >
                    Settings
                  </a>
                </Link>
              </div>
              <div />
            </div>
          </div>
        )}
        <div className="pt-28">{children}</div>
      </div>
    </>
  );
}
