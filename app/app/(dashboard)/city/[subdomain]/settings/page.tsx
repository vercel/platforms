import prisma from "@/lib/prisma";
import Form from "@/components/form";
import { updateOrganization } from "@/lib/actions";
import DeleteOrganizationForm from "@/components/form/delete-organization-form";

export default async function CitySettingsIndex({
  params,
}: {
  params: { subdomain: string };
}) {
  const data = await prisma.organization.findUnique({
    where: {
      subdomain: params.subdomain,
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
          type: "text",
          defaultValue: data?.name!,
          placeholder: "My Awesome Site",
          maxLength: 32,
        }}
        handleSubmit={updateOrganization}
      />

      <Form
        title="Description"
        description="The description of your site. This will be used as the subheader on your landing page and the meta description on Google as well."
        helpText="Include SEO-optimized keywords that you want to rank for."
        inputAttrs={{
          name: "description",
          type: "text",
          defaultValue: data?.description!,
          placeholder: "A blog about really interesting things.",
        }}
        handleSubmit={updateOrganization}
      />

      <Form
        title="Site Title"
        description="The title of your site. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "title",
          type: "text",
          defaultValue: data?.title!,
          placeholder: "My Awesome Site",
          maxLength: 32,
        }}
        handleSubmit={updateOrganization}
      />

      <Form
        title="Site Header"
        description="The headline of your landing page."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "header",
          type: "text",
          defaultValue: data?.header!,
          placeholder: "My Awesome Site",
          maxLength: 32,
        }}
        handleSubmit={updateOrganization}
      />

      <DeleteOrganizationForm organizationName={data?.name!} />
    </div>
  );
}
