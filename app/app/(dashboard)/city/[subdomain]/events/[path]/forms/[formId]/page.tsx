import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageHeader from "@/components/page-header";
import prisma from "@/lib/prisma";
import notFound from "../../not-found";
import EventForms from "@/components/forms"; // Adjust this import
import CreateEventFormButton from "@/components/create-event-form-button";

export default async function EventFormsPage({
  params,
}: {
  params: { path: string; subdomain: string, formId: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  console.log('prisma', prisma)

  const form = await prisma.form.findUnique({
    where: {
      id: params.formId,
    },
    include: {
      event: true,
      organization: true,
      questions: true,
      role: true
    }
  });

  if (!form || !form.organization || !form.event) {
    return notFound();
  }


  return (
    <div className="flex flex-col space-y-6">
      <PageHeader
        title="Form"
      />
      
    </div>
  );
}