import PaperDoc from "@/components/paper-doc";
import { SessionData, getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import notFound from "../../[path]/not-found";
import FormTitle from "@/components/form-title";
import DynamicForm from "../../[path]/apply/dynamic-form";
import AuthModalCoverProvider from "@/components/auth-modal-cover-provider";
import {
  Answer,
  Form,
  FormResponse,
  Organization,
  Question,
} from "@prisma/client";

export default async function FormPage({
  params,
}: {
  params: { domain: string; id: string };
}) {
  const session = await getSession();
  // if (!session) {
  //   redirect("/login");
  // }

  const [form, formResponse] = await Promise.all([
    prisma.form.findUnique({
      where: {
        id: params.id,
      },
      include: {
        organization: true,
        questions: true,
      },
    }),
    prisma.formResponse.findFirst({
      where: {
        formId: params.id,
        userId: session?.user.id,
      },
      include: {
        answers: true,
      },
    }),
  ]);

  if (!form) {
    return notFound();
  }

  return (
    <AuthModalCoverProvider show={!session}>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-6">
          {formResponse ? (
            <PaperDoc className="mx-auto">
              <FormSubmission formResponse={formResponse} form={form} />
            </PaperDoc>
          ) : (
            <PaperDoc className="mx-auto">
              <FormTitle>{form.name}</FormTitle>
              <DynamicForm form={form} />
            </PaperDoc>
          )}
        </div>
      </div>
    </AuthModalCoverProvider>
  );
}

function FormSubmission({
  form,
  formResponse,
}: {
  form: Form & { questions: Question[]; organization: Organization };
  formResponse: FormResponse & { answers: Answer[] };
}) {
  return (
    <>
      <FormTitle>{form.endingTitle}</FormTitle>
      <p>{form.endingDescription}</p>
    </>
  );
}
