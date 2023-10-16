"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";

export default function EventSettingsNav() {
  const { subdomain, path } = useParams() as { subdomain: string, path: string };
  const segment = useSelectedLayoutSegment();

  const navItems = [
    {
      name: "General",
      href: `/city/${subdomain}/events/${path}/settings`,
      segment: null,
    },
    // {
    //   name: "Domains",
    //   href: `/city/${subdomain}/events/${path}/settings/domains`,
    //   segment: "domains",
    // },
    // {
    //   name: "Appearance",
    //   href: `/city/${subdomain}/events/${path}/settings/appearance`,
    //   segment: "appearance",
    // },
  ];

  return (
    <div className="flex space-x-4 border-b border-brand-gray200 pb-4 pt-2 dark:border-brand-gray700">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          // Change style depending on whether the link is active
          className={cn(
            "rounded-md px-2 py-1 text-sm font-medium transition-colors active:bg-brand-gray200 dark:active:bg-brand-gray600",
            segment === item.segment
              ? "bg-brand-gray100 text-brand-gray600 dark:bg-brand-gray800 dark:text-brand-gray400"
              : "text-brand-gray600 hover:bg-brand-gray100 dark:text-brand-gray400 dark:hover:bg-brand-gray800",
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
