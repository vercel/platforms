import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function PaperDoc({
  className,
  ...props
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative min-h-[500px] w-full max-w-screen-lg border-brand-gray200 bg-brand-gray200 p-12 px-8 dark:border-brand-gray700 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg",
        className,
      )}
      {...props}
    />
  )
}
