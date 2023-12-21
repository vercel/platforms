import { cn } from "@/lib/utils";

interface PagePaddingProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function PagePadding({ className, ...rest }: PagePaddingProps) {
  return (
    <div
      className={cn("flex flex-col space-y-12 p-5", className)}
      {...rest}
    />
  );
}
