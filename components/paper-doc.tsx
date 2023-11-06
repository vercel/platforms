import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Card } from "./ui/card";

export default function PaperDoc({
  className,
  ...props
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "relative min-h-[500px] w-full max-w-screen-lg p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 shadow-lg",
        className,
      )}
      {...props}
    />
  )
}
