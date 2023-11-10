import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import notFound from "../../not-found";
import FormBuilder from "@/components/form-builder";

export default async function EventFormsPage({
  params,
}: {
  params: { path: string; subdomain: string; id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const form = await prisma.form.findUnique({
    where: {
      id: params.id,
    },
    include: {
      event: true,
      organization: true,
      questions: true,
      role: true,
    },
  });

  if (!form || !form.organization) {
    return notFound();
  }

  return <FormBuilder session={session} form={form} />;
}
