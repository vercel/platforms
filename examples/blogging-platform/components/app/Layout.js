import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { signOut } from "next-auth/react";
import Loader from "./Loader";
import useRequireAuth from "../../lib/useRequireAuth";

export default function Layout({ siteId, children }) {
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
          <meta name="twitter:site" content="@Elegance" />
          <meta name="twitter:creator" content="@StevenTey" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={logo} />
        </Head>
        <div className="absolute left-0 right-0 h-16 border-b bg-white border-gray-200">
          <div className="flex justify-between items-center h-full max-w-screen-xl mx-auto px-10 sm:px-20">
            <Link href="/">
              <a className="flex justify-center items-center">
                <div className="h-8 w-8 inline-block rounded-full overflow-hidden align-middle">
                  <Image
                    src={session.user.image}
                    width={40}
                    height={40}
                    alt={session.user.name}
                  />
                </div>
                <span className="inline-block ml-3 font-medium truncate">
                  {session.user.name}
                </span>
              </a>
            </Link>
            <button className="font-cal" onClick={() => signOut()}>
              Logout
            </button>
          </div>
        </div>
        {rootPage && (
          <div className="absolute left-0 right-0 top-16 flex justify-center items-center font-cal space-x-16 border-b bg-white border-gray-200">
            <Link href="/">
              <a
                className={`border-b-2 ${
                  tab == "" ? "border-black" : "border-transparent"
                } py-3`}
              >
                My Sites
              </a>
            </Link>
            <Link href="/settings">
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
              <Link href={`/`}>
                <a>
                  ←<p className="md:inline-block ml-3 hidden">All Sites</p>
                </a>
              </Link>
              <div className="flex justify-between items-center space-x-10 md:space-x-16">
                <Link href={`/site/${router.query.id}`}>
                  <a
                    className={`border-b-2 ${
                      !tab ? "border-black" : "border-transparent"
                    } py-3`}
                  >
                    Posts
                  </a>
                </Link>
                <Link href={`/site/${router.query.id}/drafts`}>
                  <a
                    className={`border-b-2 ${
                      tab == "drafts" ? "border-black" : "border-transparent"
                    } py-3`}
                  >
                    Drafts
                  </a>
                </Link>
                <Link href={`/site/${router.query.id}/settings`}>
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
                <Link href={`/site/${siteId}`}>
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
                <Link href={`/post/${router.query.id}`}>
                  <a
                    className={`border-b-2 ${
                      !tab ? "border-black" : "border-transparent"
                    } py-3`}
                  >
                    Editor
                  </a>
                </Link>
                <Link href={`/post/${router.query.id}/settings`}>
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
