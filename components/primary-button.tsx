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
          ? "cursor-not-allowed border-brand-gray200 bg-brand-gray100 text-brand-gray400 dark:border-brand-gray700 dark:bg-brand-gray800 dark:text-brand-gray300"
          : "border border-brand-gray900 bg-brand-gray900 text-white hover:bg-white hover:text-brand-gray900 active:bg-brand-gray100 dark:border-brand-gray700 dark:hover:border-brand-gray200 dark:hover:bg-brand-gray900 dark:hover:text-white dark:active:bg-brand-gray800",
        className,
      )}
      disabled={loading}
      {...rest}
    >
      {loading ? <LoadingDots color="#808080" /> : children}
    </button>
  );
}
