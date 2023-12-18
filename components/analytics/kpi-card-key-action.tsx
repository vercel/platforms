import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

const KPICardKeyAction = ({
  title,
  links,
}: {
  title: string;
  links: { display: string; href: string }[];
}) => {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold tracking-tight">{title}</p>
      <div className="-mx-4 -mb-4">
        {links.map((link, i) => {
          return (
            <Button key={`${i}_${link.href}`} asChild variant={"ghost"}>
              <Link
                href={link.href}
                className="flex h-8 w-full items-center justify-between py-1"
              >
                <span>{link.display}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default KPICardKeyAction;
