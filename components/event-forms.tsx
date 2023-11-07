import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import notFound from "@/app/app/(dashboard)/post/[id]/not-found";
import FormCard from "./form-card"; // Assuming you have a FormCard component
import { Event, Organization, Role, Form, Question } from "@prisma/client";

export default async function EventForms({
  organization,
  event,
  forms,
  limit,
}: {
  organization: Organization;
  event?: Event;
  forms: (Form & {
    questions: Question[];
    role: Role[];
    formResponse: { id: string }[];
  })[];
  limit?: number;
}) {
  return forms.length > 0 ? (
    <div className="grid  grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {forms.map((form) => (
        <FormCard
          key={form.id}
          form={form}
          questions={form.questions}
          role={form.role}
          organization={organization}
          event={event}
        />
      ))}
    </div>
  ) : (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">No Forms Yet</h1>
      <Image
        alt="missing Forms"
        src="https://illustrations.popsy.co/gray/web-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-gray-500">
        You have not created any Forms yet.
      </p>
    </div>
  );
}
