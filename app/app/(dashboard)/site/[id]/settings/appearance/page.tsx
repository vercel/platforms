import Form from "@/components/form";
import { updateSite } from "@/lib/actions";
import prisma from "@/lib/prisma";

export default async function SiteSettingsAppearance({
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
        description="The thumbnail image for your site. Accepted formats: .png, .jpg, .jpeg"
        handleSubmit={updateSite}
        helpText="Max file size 50MB. Recommended size 1200x630."
        inputAttrs={{
          defaultValue: data?.image!,
          name: "image",
          type: "file",
        }}
        title="Thumbnail image"
      />
      <Form
        description="The logo for your site. Accepted formats: .png, .jpg, .jpeg"
        handleSubmit={updateSite}
        helpText="Max file size 50MB. Recommended size 400x400."
        inputAttrs={{
          defaultValue: data?.logo!,
          name: "logo",
          type: "file",
        }}
        title="Logo"
      />
      <Form
        description="The font for the heading text your site."
        handleSubmit={updateSite}
        helpText="Please select a font."
        inputAttrs={{
          defaultValue: data?.font!,
          name: "font",
          type: "select",
        }}
        title="Font"
      />
      <Form
        description="Message to be displayed on the 404 page."
        handleSubmit={updateSite}
        helpText="Please use 240 characters maximum."
        inputAttrs={{
          defaultValue: data?.message404!,
          maxLength: 240,
          name: "message404",
          placeholder: "Blimey! You've found a page that doesn't exist.",
          type: "text",
        }}
        title="404 Page Message"
      />
    </div>
  );
}
