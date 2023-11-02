"use client";

import Link from "next/link";
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
  FileCode,
  Github,
  Users2,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { getOrganizationFromPostId } from "@/lib/actions";
import Image from "next/image";

// const externalLinks = [
//   {
//     name: "Read announcement",
//     href: "https://vercel.com/blog/platforms-starter-kit",
//     icon: <Megaphone width={18} />,
//   },
//   {
//     name: "Star on GitHub",
//     href: "https://github.com/vercel/platforms",
//     icon: <Github width={18} />,
//   },
//   {
//     name: "Read the guide",
//     href: "https://vercel.com/guides/nextjs-multi-tenant-application",
//     icon: <FileCode width={18} />,
//   },
//   {
//     name: "View demo site",
//     href: "https://demo.vercel.pub",
//     icon: <Layout width={18} />,
//   },
// ];

export default function CityDrawer({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const { subdomain } = useParams() as { subdomain?: string };

  const [organizationSubdomain, setOrganizationSubdomain] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (segments[0] === "post" && subdomain) {
      getOrganizationFromPostId(subdomain).then((subdomain) => {
        setOrganizationSubdomain(subdomain);
      });
    }
  }, [segments, subdomain]);

  const tabs = useMemo(() => {
    if (segments[0] === "city" && subdomain) {
      return [
        {
          name: "Posts",
          href: `/city/${subdomain}`,
          isActive: segments.length === 2,
          icon: <Newspaper width={18} />,
        },
        {
          name: "People",
          href: `/city/${subdomain}/people`,
          isActive: segments.includes("people"),
          icon: <Users2 width={18} />,
        },
        {
          name: "Analytics",
          href: `/city/${subdomain}/analytics`,
          isActive: segments.includes("analytics"),
          icon: <BarChart3 width={18} />,
        },
        {
          name: "Settings",
          href: `/city/${subdomain}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    } else if (segments[0] === "post" && subdomain) {
      return [
        {
          name: "Back to All Posts",
          href: organizationSubdomain
            ? `/city/${organizationSubdomain}`
            : "/cities",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Editor",
          href: `/post/${subdomain}`,
          isActive: segments.length === 2,
          icon: <Edit3 width={18} />,
        },
        {
          name: "Settings",
          href: `/post/${subdomain}/settings`,
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
        name: "People",
        href: `/people`,
        isActive: segments.includes("people"),
        icon: <Users2 width={18} />,
      },

      // {
      //   name: "Events",
      //   href: "/events",
      //   isActive: segments[0] === "events",
      //   icon: <Globe width={18} />,
      // },
      // {
      //   name: "Sites",
      //   href: "/cities",
      //   isActive: segments[0] === "sites",
      //   icon: <Globe width={18} />,
      // },
      // {
      //   name: "Settings",
      //   href: "/settings",
      //   isActive: segments[0] === "settings",
      //   icon: <Settings width={18} />,
      // },
    ];
  }, [segments, subdomain, organizationSubdomain]);

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
        className={`transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } fixed z-10 flex h-full w-full flex-col justify-between border-r border-brand-gray200 bg-brand-gray100/50 p-4 transition-all dark:border-brand-gray700 dark:bg-brand-gray800/50 sm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
            <a
              href="app.localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 hover:bg-brand-gray200 dark:hover:bg-brand-gray700"
            >
              <svg
                width="26"
                viewBox="0 0 76 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-black dark:text-white"
              >
                <path
                  d="M37.5274 0L75.0548 65H0L37.5274 0Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <div className="h-6 rotate-[30deg] border-l border-brand-gray400 dark:border-brand-gray500" />
            <Link
              href="/"
              className="rounded-lg p-2 hover:bg-brand-gray200 dark:hover:bg-brand-gray700"
            >
              <Image
                src="/logo.png"
                width={24}
                height={24}
                alt="Logo"
                className="dark:scale-110 dark:rounded-full dark:border dark:border-brand-gray400"
              />
            </Link>
          </div>
          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-3 ${
                  isActive ? "bg-brand-gray200 text-black dark:bg-brand-gray700" : ""
                } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-brand-gray200 active:bg-brand-gray300 dark:text-white dark:hover:bg-brand-gray700 dark:active:bg-brand-gray800`}
              >
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          {/* <div className="grid gap-1">
            {externalLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-brand-gray200 active:bg-brand-gray300 dark:text-white dark:hover:bg-brand-gray700 dark:active:bg-brand-gray800"
              >
                <div className="flex items-center space-x-3">
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <p>↗</p>
              </a>
            ))}
          </div> */}
          <div className="my-2 border-t border-brand-gray200 dark:border-brand-gray700" />
          {children}
        </div>
      </div>
    </>
  );
}
