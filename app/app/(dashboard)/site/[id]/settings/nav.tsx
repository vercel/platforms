"use client";

import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";

import { cn } from "@/lib/utils";

export default function SiteSettingsNav() {
  const { id } = useParams() as { id?: string };
  const segment = useSelectedLayoutSegment();

  const navItems = [
    {
      href: `/site/${id}/settings`,
      name: "General",
      segment: null,
    },
    {
      href: `/site/${id}/settings/domains`,
      name: "Domains",
      segment: "domains",
    },
    {
      href: `/site/${id}/settings/appearance`,
      name: "Appearance",
      segment: "appearance",
    },
  ];

  return (
    <div className="flex space-x-4 border-b border-stone-200 pb-4 pt-2 dark:border-stone-700">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          // Change style depending on whether the link is active
          className={cn(
            "rounded-md px-2 py-1 text-sm font-medium transition-colors active:bg-stone-200 dark:active:bg-stone-600",
            segment === item.segment
              ? "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
              : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800",
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
