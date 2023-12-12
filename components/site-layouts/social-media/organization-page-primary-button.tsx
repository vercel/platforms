import Link from "next/link";
import { Button } from "../../ui/button";
import { OrganizationPageLinks } from "@prisma/client";
import { ChevronRight } from "lucide-react";

export default function OrganizationPagePrimaryButton({
  pageLink,
}: {
  pageLink?: OrganizationPageLinks;
}) {
  if (!pageLink) {
    return null;
  }

  return (
    <Button className="mx-3 mt-3 h-8 md:mt-4" asChild>
      <Link href={pageLink.href} className="space-x-3 ">
        <span className="font-semibold">{pageLink.display}</span>
        <ChevronRight width={18} />
      </Link>
    </Button>
  );
}
