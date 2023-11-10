import PaperDoc from "@/components/paper-doc";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import notFound from "../../[slug]/not-found";
import FormTitle from "@/components/form-title";
import DynamicForm from "../../[slug]/apply/dynamic-form";
import AuthModalCoverProvider from "@/components/auth-modal-cover-provider";

export default async function FormPage({
  params,
}: {
  params: { domain: string; id: string };
}) {
  const session = await getSession();
  // if (!session) {
  //   redirect("/login");
  // }

  const form = await prisma.form.findUnique({
    where: {
      id: params.id,
    },
    include: {
      organization: true,
      questions: true,
    },
  });

  if (!form) {
    return notFound();
  }

  return (
    <AuthModalCoverProvider show={!session}>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-6">
          <PaperDoc className="mx-auto">
            <FormTitle>{form.name}</FormTitle>
            <DynamicForm form={form} />
          </PaperDoc>
        </div>
      </div>
    </AuthModalCoverProvider>
  );
}
