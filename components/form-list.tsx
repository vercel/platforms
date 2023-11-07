import { Form, FormResponse, Organization, Question, Role } from "@prisma/client";

export default function FormList({
  forms,
  organization,
}: {
  forms:  (Form & { questions: Question[]; role: Role[], formResponse: { id: string }[] })[];
  organization: Organization;
}) {
  return (
    <ul>
      {forms.map((form) => {
        return <li key={form.id} className="flex">
            <h6>{form.name}</h6>
            <h6>{form.questions.length}</h6>
        </li>;
      })}
    </ul>
  );
}
