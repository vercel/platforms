import { experimental_useFormStatus as useFormStatus } from "react-dom";
import PrimaryButton from "../primary-button";

export default function FormButton({ text }: { text: string }) {
    const { pending } = useFormStatus();
    return (
      <PrimaryButton loading={pending}>
        <p>{text}</p>
      </PrimaryButton>
    );
  }
  