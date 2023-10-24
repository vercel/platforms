import { Form, Organization, Question, Role, Event } from "@prisma/client";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";

const getPlaceholderImage = (form: Form) => {
  // @ts-ignore
  if (form?.image) {
    // @ts-ignore
    return form?.image as string;
  }
  return undefined;
  // Add your own logic for placeholder images based on form
};

export default function FormCard({
  form,
  role,
  questions,
  organization,
  event,
}: {
  form: Form;
  role?: Role[];
  questions: Question[];
  organization: Organization;
  event?: Event;
}) {
  const formImage = getPlaceholderImage(form);
  return (
    <Link
      href={`/city/${organization.subdomain}/events/${event?.path}/forms/${form.id}`}
      className="flex flex-col overflow-hidden rounded-lg"
    >
      <div className="relative rounded-lg border border-brand-gray200 pb-5 shadow-md transition-all hover:shadow-xl dark:border-brand-gray700 dark:hover:border-white">
        {formImage ? (
          <div className="w-full">
            <AspectRatio ratio={1 / 1}>
              <Image
                src={formImage}
                alt={`${form.id} card image`}
                layout="fill"
              />
            </AspectRatio>
          </div>
        ) : null}
        <div className="border-t border-brand-gray200 p-4 dark:border-brand-gray700">
          <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide dark:text-white">
            {form.name}
          </h3>
          <p className="text-brand-gray500 mt-2 line-clamp-1 text-sm font-normal leading-snug dark:text-brand-gray400">
            {questions.map((question) => (
              <div key={question.id}>
                <h4>{question.text}</h4>
                <p>{question.type}</p>
              </div>
            ))}
          </p>
        </div>
      </div>
    </Link>
  );
}
