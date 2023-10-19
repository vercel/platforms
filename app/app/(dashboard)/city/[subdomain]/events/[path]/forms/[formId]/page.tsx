import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageHeader from "@/components/page-header";
import prisma from "@/lib/prisma";
import notFound from "../../not-found";
import { Form, Organization, Event, Question, Role } from "@prisma/client";
import { useState, useEffect } from "react";
import FormBuilder from "./form-builder";

export default async function EventFormsPage({
  params,
}: {
  params: { path: string; subdomain: string; formId: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const form = await prisma.form.findUnique({
    where: {
      id: params.formId,
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

  return (
    <FormBuilder session={session} form={form} />
  );
}
