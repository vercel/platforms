import Image from "next/image";
import FormCard from "./form-card"; // Assuming you have a FormCard component
import { Event, Organization, Role, Form, Question } from "@prisma/client";
import FormList from "./form-list";

export default function OrgForms({
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
  // const [isListView, setIsListView] = useState(false);

  return (
    <div>
      {/* <button onClick={() => setIsListView(!isListView)}>
        {isListView ? "Switch to List View" : "Switch to Card View"}
      </button> */}

      {forms.length > 0 ? (
        true ? (
          <div className="grid  grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
          <FormList forms={forms} organization={organization} />
        )
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
      )}
    </div>
  );
}
