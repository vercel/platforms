import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Form from "@/components/form";
import { updatePostMetadata } from "@/lib/actions";
import DeletePostForm from "@/components/form/delete-post-form";
import db from "@/lib/db";

export default async function PostSettings({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, decodeURIComponent(params.id)),
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
          title="Post Slug"
          description="The slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
          helpText="Please use a slug that is unique to this post."
          inputAttrs={{
            name: "slug",
            type: "text",
            defaultValue: data?.slug!,
            placeholder: "slug",
          }}
          handleSubmit={updatePostMetadata}
        />

        <Form
          title="Thumbnail image"
          description="The thumbnail image for your post. Accepted formats: .png, .jpg, .jpeg"
          helpText="Max file size 50MB. Recommended size 1200x630."
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.image!,
          }}
          handleSubmit={updatePostMetadata}
        />

        <DeletePostForm postName={data?.title!} />
      </div>
    </div>
  );
}
