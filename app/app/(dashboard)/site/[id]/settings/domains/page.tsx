import prisma from "@/lib/prisma";
import Form from "../../../../components/form";
import { editSite } from "../../../../components/form/actions";

export default async function SiteSettingsDomains({
  params,
}: {
  params: { id: string };
}) {
  const data = await prisma.site.findUnique({
    where: {
      id: params.id,
    },
  });

  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Subdomain"
        description="The subdomain of your site."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "subdomain",
          type: "text",
          defaultValue: data?.subdomain!,
          placeholder: "subdomain",
          maxLength: 32,
        }}
        handleSubmit={editSite}
      />
    </div>
  );
}
