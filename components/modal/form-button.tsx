import { experimental_useFormStatus as useFormStatus } from "react-dom";
import PrimaryButton from "../primary-button";
import { cn } from "@/lib/utils";

export default function FormButton({
  text,
  loading,
  className,
}: {
  text: string;
  loading?: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton
      className={cn(className)}
      loading={pending || (loading ?? false)}
    >
      <span>{text}</span>
    </PrimaryButton>
  );
}
