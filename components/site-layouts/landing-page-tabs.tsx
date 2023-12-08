"use client";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { LineGradient } from "../line-gradient";

export default function LandingPageTabs({
  params,
}: {
  params: { domain: string };
}) {
  const { domain } = params;
  // const { domain } = useParams() as { domain?: string };
  const segment = useSelectedLayoutSegment();

  const navItems = [
    {
      name: "How to apply",
      href: `/#events`,
      segment: "events",
    },
    {
      name: "How to find housng",
      href: `/#docs`,
      segment: "docs",
    },
  ];
  return (
    <div className="">
      <h4 className="mx-5 font-bold tracking-tight text-gray-750 dark:text-gray-400">
        {"Resources"}
      </h4>
      <div className="grid grid-cols-2 items-center gap-2 px-2.5 pb-5 pt-2 dark:border-gray-700 md:grid-cols-3 md:justify-center xl:grid-cols-5">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            // Change style depending on whether the link is active
            className={cn(
              "flex items-center rounded-md border border-gray-350 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:border-gray-650 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-600",
            )}
          >
            <div className="flex flex-1 px-2">{item.name}</div>
            <span>
              <ChevronRight height={14} width={14} />
            </span>
          </Link>
        ))}
      </div>
      <LineGradient />
    </div>
  );
}
