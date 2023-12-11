import { OrganizationPageLinks } from "@prisma/client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LineGradient } from "../line-gradient";
import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function OrganizationPageLinksGrid({
  pageLinks,
}: {
  pageLinks?: OrganizationPageLinks[];
}) {
  if (!pageLinks) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h4 className="mx-5 my-3 font-bold tracking-tight text-gray-750 dark:text-gray-400 md:my-5 md:text-lg">
        {"Resources"}
      </h4>
      <div className="grid grid-cols-2 items-center gap-2 px-2.5 pb-5 md:pb-8 dark:border-gray-700 md:grid-cols-3 md:justify-center">
        {pageLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            // Change style depending on whether the link is active
            className={cn(
              "flex items-center rounded-md border border-gray-350 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200 dark:border-gray-650 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-600 md:py-2 md:text-md",
            )}
          >
            <div className="flex flex-1 px-2">{link.display}</div>
            <span className="md:pr-1">
              <ChevronRight
                height={16}
                width={16}
                className="stroke-gray-600 dark:stroke-gray-400"
              />
            </span>
          </Link>
        ))}
      </div>
      <LineGradient />
    </div>
  );
}
