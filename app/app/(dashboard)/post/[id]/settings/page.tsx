import { notFound, redirect } from "next/navigation";

import Form from "@/components/form";
import DeletePostForm from "@/components/form/delete-post-form";
import { updatePostMetadata } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function PostSettings({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
  });
  if (!data || data.userId !== session.user.id) {
    notFound();
  }
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-6">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Post Settings
        </h1>
        <Form
          description="The slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
          handleSubmit={updatePostMetadata}
          helpText="Please use a slug that is unique to this post."
          inputAttrs={{
            defaultValue: data?.slug!,
            name: "slug",
            placeholder: "slug",
            type: "text",
          }}
          title="Post Slug"
        />

        <Form
          description="The thumbnail image for your post. Accepted formats: .png, .jpg, .jpeg"
          handleSubmit={updatePostMetadata}
          helpText="Max file size 50MB. Recommended size 1200x630."
          inputAttrs={{
            defaultValue: data?.image!,
            name: "image",
            type: "file",
          }}
          title="Thumbnail image"
        />

        <DeletePostForm postName={data?.title!} />
      </div>
    </div>
  );
}
