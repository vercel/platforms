"use client"
import Siwe from "@/components/siwe";
import EmailForm from "./email-form";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const steps = ['email', 'verify', 'siwe'];
export default function AuthModal() {
    // const params = useParams();
    const { email } = useSearchParams();
    console.log("email: ", email);
    const [state, setState] = useState<number>(0);

    const nextStep = () => {
      setState((prev) => (prev + 1));
    };

    const onEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // get email from form
        const email = e.currentTarget.elements.email.value;
        e.preventDefault();
        signIn('email', { email, callbackUrl: '/' })
        nextStep();
    };


  return (
    <div className="mx-auto border border-stone-200 py-10 dark:border-stone-700 w-full max-w-[420px] rounded-2xl shadow-md bg-brand-gray900/50 backdrop-blur-md">
      <div className="mx-6">
        <h1 className="mt-2 font-serif font-light text-2xl md:text-3xl dark:text-brand-gray50">
          {"It's time to build new cities"}
        </h1>
        <p className="mt-3 text-sm text-stone-600 dark:text-brand-gray100 font-medium">
          Sign in or Sign up below. <br />
        </p>
      </div>
      <div className="mx-auto mt-4 w-full">
        {steps[state] === 'email' && <EmailForm onSubmit={onEmailSubmit} />}
        {steps[state] === 'verify' && <div>verify</div>}
        {steps[state] === 'siwe' && <Siwe />}
        {/* <Siwe /> */}
        {/* <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <LoginButton />
        </Suspense>
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <Siwe />
        </Suspense> */}

      </div>
    </div>
  );
}
