import Form from "@/components/form";
import DeleteSiteForm from "@/components/form/delete-site-form";
import { updateSite } from "@/lib/actions";
import prisma from "@/lib/prisma";

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
        description="The name of your site. This will be used as the meta title on Google as well."
        handleSubmit={updateSite}
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          defaultValue: data?.name!,
          maxLength: 32,
          name: "name",
          placeholder: "My Awesome Site",
          type: "text",
        }}
        title="Name"
      />

      <Form
        description="The description of your site. This will be used as the meta description on Google as well."
        handleSubmit={updateSite}
        helpText="Include SEO-optimized keywords that you want to rank for."
        inputAttrs={{
          defaultValue: data?.description!,
          name: "description",
          placeholder: "A blog about really interesting things.",
          type: "text",
        }}
        title="Description"
      />

      <DeleteSiteForm siteName={data?.name!} />
    </div>
  );
}
