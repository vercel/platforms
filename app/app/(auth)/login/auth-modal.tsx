"use client"
import Siwe from "@/components/siwe";
import EmailForm from "./email-form";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const steps = ['email', 'verify', 'siwe'];
export default function AuthModal() {
    // const params = useParams();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [state, setState] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const nextStep = () => {
      setState((prev) => (prev + 1));
    };

    const onEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // get email from form
        e.preventDefault();
        setLoading(true);
        const email = (e.target as HTMLFormElement).email.value;
        const response = await signIn('email', { email: email, redirect: false });
        if (response?.ok) {
            nextStep();
        }
    };


  return (
    <div className="mx-auto border border-stone-200 py-10 dark:border-stone-700 w-full max-w-[420px] rounded-2xl shadow-md bg-brand-gray900/50 backdrop-blur-md">
      <div className="mx-6">
        <h1 className="mt-2 font-serif font-light text-2xl md:text-3xl dark:text-brand-gray50">
        {steps[state] === 'email' && "It's time to build new cities"}
        {steps[state] === 'verify' && "We sent you an email"}
        </h1>
        <p className="mt-3 text-sm text-stone-600 dark:text-brand-gray100 font-medium">
        {steps[state] === 'email' && "Sign in or Sign up below."}
        {steps[state] === 'verify' && "Click the link in the email we sent you to continue."}
        </p>
      </div>
      <div className="mx-auto mt-4 w-full">
        {steps[state] === 'email' && <EmailForm onSubmit={onEmailSubmit} loading={loading} />}
        {/* {steps[state] === 'verify' && <div>verify</div>} */}
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
