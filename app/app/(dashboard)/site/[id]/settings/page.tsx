import prisma from "@/lib/prisma";
import Form from "../../../components/form";
import { editSite } from "../../../components/form/actions";

export default async function SiteSettingsIndex({
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
        title="Name"
        description="The name of your site. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          defaultValue: data?.name!,
          placeholder: "name",
          maxLength: 32,
        }}
        handleSubmit={editSite}
      />

      <Form
        title="Description"
        description="The description of your site. This will be used as the meta description on Google as well."
        helpText="Include SEO-optimized keywords that you want to rank for."
        inputAttrs={{
          name: "description",
          defaultValue: data?.description!,
          placeholder: "description",
          maxLength: 140,
        }}
        handleSubmit={editSite}
      />
    </div>
  );
}
