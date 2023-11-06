"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";

export default function SiteSettingsNav() {
  const { subdomain } = useParams() as { subdomain?: string };
  const segment = useSelectedLayoutSegment();

  const navItems = [
    {
      name: "General",
      href: `/city/${subdomain}/settings`,
      segment: null,
    },
    {
      name: "Domains",
      href: `/city/${subdomain}/settings/domains`,
      segment: "domains",
    },
    {
      name: "Appearance",
      href: `/city/${subdomain}/settings/appearance`,
      segment: "appearance",
    },
  ];

  return (
    <div className="flex space-x-4 border-b border-gray-200 pb-4 pt-2 dark:border-gray-700">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          // Change style depending on whether the link is active
          className={cn(
            "rounded-md px-2 py-1 text-sm font-medium transition-colors active:bg-gray-200 dark:active:bg-gray-600",
            segment === item.segment
              ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
