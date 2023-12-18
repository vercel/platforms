import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { Button } from "../ui/button";

export type PrimaryButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading: boolean;
    children: React.ReactNode;
    className?: string;
  };

export default function PrimaryButton({
  loading,
  children,
  className,
  ...rest
}: PrimaryButtonProps) {
  return (
    <Button
      className={cn(
        "min-w-36 flex h-8 items-center justify-center space-x-2 rounded-lg border text-sm transition-all duration-100 focus:outline-none sm:h-9 font-semibold",
        loading
          ? "cursor-not-allowed border-gray-200 bg-gray-200 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          : "border border-gray-800 bg-gray-800 text-gray-100 hover:bg-gray-200 hover:text-gray-800 active:bg-gray-200 dark:border-gray-700 dark:hover:border-gray-200 dark:hover:bg-gray-900/20 dark:hover:text-gray-100 dark:active:bg-gray-800",
        className,
      )}
      disabled={loading}
      {...rest}
    >
      {loading ? <LoadingDots color="#808080" /> : children}
    </Button>
  );
}
