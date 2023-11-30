import { experimental_useFormStatus as useFormStatus } from "react-dom";
import PrimaryButton from "../primary-button";

export default function FormButton({
  text,
  loading,
}: {
  text: string;
  loading?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <PrimaryButton loading={pending || (loading ?? false)}>
      <span>{text}</span>
    </PrimaryButton>
  );
}
