import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import notFound from "../../../not-found";

export default async function FormResultsPage({
  params,
}: {
  params: { path: string; subdomain: string; formId: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const questions = await prisma.question.findMany({
    where: {
      formId: params.formId,
    },
    include: {
      form: true,
    },
  });

  const qMap: { [key: string]: (typeof questions)[0] } = {};
  questions.forEach((q) => {
    qMap[q.id] = q;
  });

  const sortedQs = questions.sort((q1, q2) => q1.order - q2.order);

  const responses = await prisma.formResponse.findMany({
    where: {
      formId: params.formId,
    },
    include: {
      user: true,
      answers: true,
    },
  });

  if (!responses) {
    return notFound();
  }

  return (
    <div>
      {responses.map((response, index) => (
        <div
          key={index}
          style={{ margin: "10px", padding: "10px", border: "1px solid black" }}
        >
          <h2>{response.user.name}</h2>
          <div>
            {response.answers.map((a) => {
              return (
                <div key={a.id}>
                  <div>{qMap[a.questionId].text}</div>{" "}
                  <div>{a.value?.toString()}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
