"use client";

import {
  ArrowLeft,
  BarChart3,
  Edit3,
  Globe,
  Layout,
  LayoutDashboard,
  Megaphone,
  Menu,
  Newspaper,
  Settings,
} from "lucide-react";
import { FileCode, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";

import { getSiteFromPostId } from "@/lib/actions";

const externalLinks = [
  {
    href: "https://vercel.com/blog/platforms-starter-kit",
    icon: <Megaphone width={18} />,
    name: "Read announcement",
  },
  {
    href: "https://github.com/vercel/platforms",
    icon: <Github width={18} />,
    name: "Star on GitHub",
  },
  {
    href: "https://vercel.com/guides/nextjs-multi-tenant-application",
    icon: <FileCode width={18} />,
    name: "Read the guide",
  },
  {
    href: "https://demo.vercel.pub",
    icon: <Layout width={18} />,
    name: "View demo site",
  },
  {
    href: "https://vercel.com/templates/next.js/platforms-starter-kit",
    icon: (
      <svg
        className="py-1 text-black dark:text-white"
        fill="none"
        viewBox="0 0 76 76"
        width={18}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
      </svg>
    ),
    name: "Deploy your own",
  },
];

export default function Nav({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const [siteId, setSiteId] = useState<string | null>();

  useEffect(() => {
    if (segments[0] === "post" && id) {
      getSiteFromPostId(id).then((id) => {
        setSiteId(id);
      });
    }
  }, [segments, id]);

  const tabs = useMemo(() => {
    if (segments[0] === "site" && id) {
      return [
        {
          href: "/sites",
          icon: <ArrowLeft width={18} />,
          name: "Back to All Sites",
        },
        {
          href: `/site/${id}`,
          icon: <Newspaper width={18} />,
          isActive: segments.length === 2,
          name: "Posts",
        },
        {
          href: `/site/${id}/analytics`,
          icon: <BarChart3 width={18} />,
          isActive: segments.includes("analytics"),
          name: "Analytics",
        },
        {
          href: `/site/${id}/settings`,
          icon: <Settings width={18} />,
          isActive: segments.includes("settings"),
          name: "Settings",
        },
      ];
    } else if (segments[0] === "post" && id) {
      return [
        {
          href: siteId ? `/site/${siteId}` : "/sites",
          icon: <ArrowLeft width={18} />,
          name: "Back to All Posts",
        },
        {
          href: `/post/${id}`,
          icon: <Edit3 width={18} />,
          isActive: segments.length === 2,
          name: "Editor",
        },
        {
          href: `/post/${id}/settings`,
          icon: <Settings width={18} />,
          isActive: segments.includes("settings"),
          name: "Settings",
        },
      ];
    }
    return [
      {
        href: "/",
        icon: <LayoutDashboard width={18} />,
        isActive: segments.length === 0,
        name: "Overview",
      },
      {
        href: "/sites",
        icon: <Globe width={18} />,
        isActive: segments[0] === "sites",
        name: "Sites",
      },
      {
        href: "/settings",
        icon: <Settings width={18} />,
        isActive: segments[0] === "settings",
        name: "Settings",
      },
    ];
  }, [segments, id, siteId]);

  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // hide sidebar on path change
    setShowSidebar(false);
  }, [pathname]);

  return (
    <>
      <button
        className={`fixed z-20 ${
          // left align for Editor, right align for other pages
          segments[0] === "post" && segments.length === 2 && !showSidebar
            ? "left-5 top-5"
            : "right-5 top-7"
        } sm:hidden`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } fixed z-10 flex h-full w-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
            <a
              className="rounded-lg p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700"
              href="https://vercel.com/templates/next.js/platforms-starter-kit"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                className="text-black dark:text-white"
                fill="none"
                viewBox="0 0 76 65"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M37.5274 0L75.0548 65H0L37.5274 0Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <div className="h-6 rotate-[30deg] border-l border-stone-400 dark:border-stone-500" />
            <Link
              className="rounded-lg p-2 hover:bg-stone-200 dark:hover:bg-stone-700"
              href="/"
            >
              <Image
                alt="Logo"
                className="dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
                height={24}
                src="/logo.png"
                width={24}
              />
            </Link>
          </div>
          <div className="grid gap-1">
            {tabs.map(({ href, icon, isActive, name }) => (
              <Link
                className={`flex items-center space-x-3 ${
                  isActive ? "bg-stone-200 text-black dark:bg-stone-700" : ""
                } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
                href={href}
                key={name}
              >
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="grid gap-1">
            {externalLinks.map(({ href, icon, name }) => (
              <a
                className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
                href={href}
                key={name}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="flex items-center space-x-3">
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <p>↗</p>
              </a>
            ))}
          </div>
          <div className="my-2 border-t border-stone-200 dark:border-stone-700" />
          {children}
        </div>
      </div>
    </>
  );
}
