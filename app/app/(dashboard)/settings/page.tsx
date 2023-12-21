import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";
import { MAX_MB_UPLOAD } from "@/lib/constants";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Settings
        </h1>
        <Form
          title="Name"
          description="Your name on this app."
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            name: "name",
            type: "text",
            defaultValue: session.user.name!,
            placeholder: "Brendon Urie",
            maxLength: 32,
          }}
          handleSubmit={editUser}
        />
        <Form
          title="Profile Image"
          description="The image for your profile. Accepted formats: .png, .jpg, .jpeg"
          helpText={`Max file size ${MAX_MB_UPLOAD}MB. Recommended size 1080x1080.`}
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: session.user?.image!,
            aspectRatio: "aspect-square",
          }}
          handleSubmit={editUser}
        />
      </div>
    </div>
  );
}
