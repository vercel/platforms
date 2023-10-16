import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Form from "@/components/form";
import { updatePostMetadata, getUserEventRoles, updateEvent } from "@/lib/actions";
// import DeletePostForm from "@/components/form/delete-post-form";

export default async function EventSettings({
  params,
}: {
  params: { path: string, subdomain: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const data = await prisma.event.findFirst({
    where: {
      organization: {
        subdomain: params.subdomain,
      },
      path: params.path,
    },
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
        handleSubmit={updateEvent}
      />
    </div>
  );
}
