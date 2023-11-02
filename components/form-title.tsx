import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface FormTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export default function FormTitle({ className, ...props }: FormTitleProps) {
  return (
    <h1
      className={cn("p-1 font-serif text-3xl dark:text-white", className)}
      {...props}
    />
  );
}
