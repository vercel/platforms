"use client";
import Siwe from "@/components/siwe";
import EmailForm from "./email-form";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import ConnectPassportButton from "../buttons/ConnectPassportButton";
import { LineGradient } from "../line-gradient";

const steps = ["email", "verify", "siwe"];
export default function AuthModal({
  callbackUrl,
  redirect = false,
}: {
  callbackUrl?: string;
  redirect?: boolean;
}) {
  const params = useParams();
  // const searchParams = useSearchParams();
  // const email = searchParams.get("email");
  const [state, setState] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const nextStep = () => {
    setState((prev) => prev + 1);
  };

  const onEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // get email from form
    e.preventDefault();
    setLoading(true);
    const email = (e.target as HTMLFormElement).email.value;
    const response = await signIn("email", {
      email: email,
      callbackUrl,
      redirect,
    });
    if (response?.ok) {
      nextStep();
    }
  };

  return (
    <div className="mx-auto w-full max-w-[420px] rounded-md border border-gray-200 bg-gray-50/80  p-2 py-6 shadow backdrop-blur-lg dark:border-gray-750 dark:bg-gray-900/80 md:max-w-md md:border">
      <div className="mx-6">
        <h1 className="mb-3 mt-2 font-serif text-2xl font-light dark:text-gray-50 md:text-3xl">
          {steps[state] === "email" && "It's time to build new cities"}
          {steps[state] === "verify" && "We sent you an email"}
        </h1>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {`Signin with your Zero-Knowledge Passport.`}
        </p>
      </div>
      <div className="mx-auto mt-4 w-full">
        <div className="mb-8 mt-6 px-6">
          {steps[state] === "email" && (
            <ConnectPassportButton className="w-full" callbackUrl={callbackUrl}>
              Signin with Passport
            </ConnectPassportButton>
          )}
        </div>
        <div className="relative flex w-full items-center py-0 px-6">
          <LineGradient />
          <div className="px-3">
            <span className=" font-mono text-xs font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-400">
              {"OR"}
            </span>
          </div>
          <LineGradient />
        </div>
        <div>
          <div className="mx-6 mt-4">
            <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-200">
              {steps[state] === "email" && "Enter your email to continue."}
              {steps[state] === "verify" &&
                "Click the link in the email we sent you to continue."}
            </p>
          </div>
          {steps[state] === "email" && (
            <EmailForm onSubmit={onEmailSubmit} loading={loading} />
          )}
        </div>

        {/* {steps[state] === 'verify' && <div>verify</div>} */}
        {/* {steps[state] === "email" && (
          <div className="mx-6">
            <Siwe />
          </div>
        )} */}
        {/* <Siwe /> */}
        {/* <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800" />
          }
        >
          <LoginButton />
        </Suspense>
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800" />
          }
        >
          <Siwe />
        </Suspense> */}
      </div>
    </div>
  );
}
