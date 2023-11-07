import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";

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
    <button
      className={cn(
        "flex h-8 w-36 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none sm:h-9",
        loading
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          : "border border-gray-900 bg-gray-900 text-white hover:bg-white hover:text-gray-900 active:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-200 dark:hover:bg-gray-900 dark:hover:text-white dark:active:bg-gray-800",
        className,
      )}
      disabled={loading}
      {...rest}
    >
      {loading ? <LoadingDots color="#808080" /> : children}
    </button>
  );
}
