import Form from "@/components/form";
import { updateSite } from "@/lib/actions";
import prisma from "@/lib/prisma";

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
        description="The subdomain for your site."
        handleSubmit={updateSite}
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          defaultValue: data?.subdomain!,
          maxLength: 32,
          name: "subdomain",
          placeholder: "subdomain",
          type: "text",
        }}
        title="Subdomain"
      />
      <Form
        description="The custom domain for your site."
        handleSubmit={updateSite}
        helpText="Please enter a valid domain."
        inputAttrs={{
          defaultValue: data?.customDomain!,
          maxLength: 64,
          name: "customDomain",
          pattern: "^[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}$",
          placeholder: "yourdomain.com",
          type: "text",
        }}
        title="Custom Domain"
      />
    </div>
  );
}
