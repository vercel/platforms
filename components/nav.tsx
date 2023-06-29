"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Edit3,
  Globe,
  LayoutDashboard,
  Menu,
  Newspaper,
  Settings,
} from "lucide-react";
import { useParams, useSelectedLayoutSegments } from "next/navigation";
import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { getSiteFromPostId } from "@/lib/actions";
import Image from "next/image";
import { FileCode, Github } from "lucide-react";

const externalLinks = [
  {
    name: "Star on GitHub",
    href: "https://github.com/vercel/platforms",
    icon: <Github width={18} />,
  },
  {
    name: "Read the guide",
    href: "https://vercel.com/guides/nextjs-multi-tenant-application",
    icon: <FileCode width={18} />,
  },
  {
    name: "Deploy your own",
    href: "https://vercel.com/templates/next.js/platforms-starter-kit",
    icon: (
      <svg
        width={18}
        viewBox="0 0 76 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="py-1"
      >
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#000000" />
      </svg>
    ),
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
          name: "Back to All Sites",
          href: "/sites",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Posts",
          href: `/site/${id}`,
          isActive: segments.length === 2,
          icon: <Newspaper width={18} />,
        },
        {
          name: "Analytics",
          href: `/site/${id}/analytics`,
          isActive: segments.includes("analytics"),
          icon: <BarChart3 width={18} />,
        },
        {
          name: "Settings",
          href: `/site/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    } else if (segments[0] === "post" && id) {
      return [
        {
          name: "Back to All Posts",
          href: siteId ? `/site/${siteId}` : "/sites",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Editor",
          href: `/post/${id}`,
          isActive: segments.length === 2,
          icon: <Edit3 width={18} />,
        },
        {
          name: "Settings",
          href: `/post/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    }
    return [
      {
        name: "Overview",
        href: "/",
        isActive: segments.length === 0,
        icon: <LayoutDashboard width={18} />,
      },
      {
        name: "Sites",
        href: "/sites",
        isActive: segments[0] === "sites",
        icon: <Globe width={18} />,
      },
      {
        name: "Settings",
        href: "/settings",
        isActive: segments[0] === "settings",
        icon: <Settings width={18} />,
      },
    ];
  }, [segments, id, siteId]);

  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <button
        className={`z-20 fixed ${
          // left align for Editor, right align for other pages
          segments[0] === "post" && segments.length === 2 && !showSidebar
            ? "top-5 left-5"
            : "top-7 right-5"
        } sm:hidden`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 transition-all w-full sm:w-60 z-10 h-full fixed border-r bg-stone-100 border-gray-200 p-4 flex flex-col justify-between`}
      >
        <div className="grid gap-2">
          <div className="rounded-lg px-2 py-1.5 flex items-center space-x-2">
            <a
              href="https://vercel.com/templates/next.js/platforms-starter-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 hover:bg-stone-200"
            >
              <svg
                width="26"
                viewBox="0 0 76 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#000000" />
              </svg>
            </a>
            <div className="border-l border-stone-400 h-6 rotate-[30deg]" />
            <Link href="/" className="rounded-lg p-2 hover:bg-stone-200">
              <Image src="/logo.png" width={24} height={24} alt="Logo" />
            </Link>
          </div>
          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-3 ${
                  isActive ? "bg-stone-200 text-black" : ""
                } hover:bg-stone-200 active:bg-stone-300 rounded-lg px-2 py-1.5 transition-all ease-in-out duration-150`}
              >
                {icon}
                <span className="font-medium text-sm">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="grid gap-1">
            {externalLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between hover:bg-stone-200 active:bg-stone-300 rounded-lg px-2 py-1.5 transition-all ease-in-out duration-150"
              >
                <div className="flex items-center space-x-3">
                  {icon}
                  <span className="font-medium text-sm">{name}</span>
                </div>
                <p>↗</p>
              </a>
            ))}
          </div>
          <div className="border-t border-stone-200 my-2" />
          {children}
        </div>
      </div>
    </>
  );
}
