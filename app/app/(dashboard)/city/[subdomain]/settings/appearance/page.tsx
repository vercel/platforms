import prisma from "@/lib/prisma";
import Form from "@/components/form";
import { updateOrganization } from "@/lib/actions";
import UpsertOrganizationPageLinksForm from "@/components/form/upsert-organization-page-links";

export default async function SiteSettingsAppearance({
  params,
}: {
  params: { subdomain: string };
}) {
  const data = await prisma.organization.findUnique({
    where: {
      subdomain: params.subdomain,
    },
    include: {
      pageLinks: true
    }
  });

  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Thumbnail image"
        description="The thumbnail image for your site. Accepted formats: .png, .jpg, .jpeg"
        helpText="Max file size 50MB. Recommended size 1200x630."
        inputAttrs={{
          name: "image",
          type: "file",
          defaultValue: data?.image!,
        }}
        handleSubmit={updateOrganization}
      />
      <Form
        title="Logo"
        description="The logo for your site. Accepted formats: .png, .jpg, .jpeg"
        helpText="Max file size 50MB. Recommended size 400x400."
        inputAttrs={{
          name: "logo",
          type: "file",
          defaultValue: data?.logo!,
        }}
        handleSubmit={updateOrganization}
      />
      <UpsertOrganizationPageLinksForm
        title="Page Resources"
        description="Links added to your page. Used as a quick information reference for your citizens or guest."
        helpText="Select one link to be your primary call to action."
        pageLinks={data?.pageLinks ?? []}
      />
      <Form
        title="Font"
        description="The font for the heading text your site."
        helpText="Please select a font."
        inputAttrs={{
          name: "font",
          type: "select",
          defaultValue: data?.font!,
        }}
        handleSubmit={updateOrganization}
      />
      <Form
        title="404 Page Message"
        description="Message to be displayed on the 404 page."
        helpText="Please use 240 characters maximum."
        inputAttrs={{
          name: "message404",
          type: "text",
          defaultValue: data?.message404!,
          placeholder: "Blimey! You've found a page that doesn't exist.",
          maxLength: 240,
        }}
        handleSubmit={updateOrganization}
      />
    </div>
  );
}
