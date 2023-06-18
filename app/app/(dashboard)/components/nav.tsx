"use client";

import Link from "next/link";
import {
  BarChart3,
  Edit3,
  Globe,
  LayoutDashboard,
  Newspaper,
  Settings,
  TestTube,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { useMemo } from "react";

const rootTabs = [
  {
    name: "Overview",
    href: "/",
    icon: <LayoutDashboard width={18} />,
  },
  {
    name: "Sites",
    href: "/sites",
    icon: <Globe width={18} />,
  },
  {
    name: "Test",
    href: "/test",
    icon: <TestTube width={18} />,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings width={18} />,
  },
];

export default function Nav() {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };
  const pathname = usePathname();

  const tabs = useMemo(() => {
    if (segments[0] === "site" && id) {
      return [
        {
          name: "All Sites",
          href: "/sites",
        },
        {
          name: "Posts",
          href: `/site/${id}/posts`,
          icon: <Newspaper width={18} />,
        },
        {
          name: "Analytics",
          href: `/site/${id}/analytics`,
          icon: <BarChart3 width={18} />,
        },
        {
          name: "Settings",
          href: `/site/${id}/settings`,
          icon: <Settings width={18} />,
        },
      ];
    } else if (segments[0] === "post" && id) {
      return [
        {
          name: "All Posts",
          href: "/sites",
        },
        {
          name: "Editor",
          href: `/post/${id}`,
          icon: <Edit3 width={18} />,
        },
        {
          name: "Settings",
          href: `/post/${id}/settings`,
          icon: <Settings width={18} />,
        },
      ];
    }
    return rootTabs;
  }, [segments, id]);

  return (
    <div className="grid gap-1">
      {tabs.map(({ name, href, icon }) => (
        <Link
          key={name}
          href={href}
          className={`flex items-center space-x-3 ${
            pathname == href ? "bg-stone-200 text-black" : ""
          } hover:bg-stone-200 active:bg-stone-300 rounded-lg px-2 py-1.5 transition-all ease-in-out duration-150`}
        >
          {icon}
          <span className="font-medium text-sm">{name}</span>
        </Link>
      ))}
    </div>
  );
}
