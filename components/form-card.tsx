import { Form, Organization, Question, Role, Event } from "@prisma/client";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

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
  form: Form & {
    questions: Question[];
    role: Role[];
    formResponse: { id: string }[];
  };
  role?: Role[];
  questions: Question[];
  organization: Organization;
  event?: Event;
}) {
  const formImage = getPlaceholderImage(form);
  return (
    <Card className="overflow-hidden">
      <Link href={`/city/${organization.subdomain}/forms/${form.id}`}>
        <div className="h-40  p-6">
          <CardTitle>{form.name}</CardTitle>

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
        </div>
      </Link>

      <Separator />
      <Link href={`/city/${organization.subdomain}/forms/${form.id}/results`}>
        <CardFooter className="bg-gray-50 dark:bg-gray-900 py-4">
          <span className="hover:text-gray-500">
            {form.formResponse?.length === 0
              ? "No responses"
              : `${form.formResponse?.length.toString()} response`}
          </span>
        </CardFooter>
      </Link>
    </Card>
  );
}
