import { redirect } from "next/navigation";
import { ReactNode } from "react";

import Form from "@/components/form";
import { editUser } from "@/lib/actions";
import { getSession } from "@/lib/auth";

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
          description="Your name on this app."
          handleSubmit={editUser}
          helpText="Please use 32 characters maximum."
          inputAttrs={{
            defaultValue: session.user.name!,
            maxLength: 32,
            name: "name",
            placeholder: "Brendon Urie",
            type: "text",
          }}
          title="Name"
        />
        <Form
          description="Your email on this app."
          handleSubmit={editUser}
          helpText="Please enter a valid email."
          inputAttrs={{
            defaultValue: session.user.email!,
            name: "email",
            placeholder: "panic@thedis.co",
            type: "email",
          }}
          title="Email"
        />
      </div>
    </div>
  );
}
