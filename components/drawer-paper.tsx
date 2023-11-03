import { cn } from "@/lib/utils";

type DrawerPaperProps = {
  showSidebar: boolean;
  className?: string;
  children?: React.ReactNode; // Add this line
};

export default function DrawerPaper({
  showSidebar,
  className,
  ...rest
}: DrawerPaperProps) {
  return (
    <div
      className={cn(`transform ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      } fixed z-10 flex h-full w-full flex-col justify-between border-r border-brand-gray300 bg-brand-gray100 p-4 text-brand-gray800 transition-all dark:border-brand-gray700 dark:bg-brand-gray900 sm:w-60 sm:translate-x-0`, className)}
      {...rest}
    ></div>
  );
}
