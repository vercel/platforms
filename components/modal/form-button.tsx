import { useFormStatus } from "react-dom";
import PrimaryButton from "../buttons/primary-button";
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
      type="submit"
      className={cn(className)}
      loading={pending || (loading ?? false)}
    >
      <span>{text}</span>
    </PrimaryButton>
  );
}
