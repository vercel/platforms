"use client";
import { signIn } from 'next-auth/react';

export default function LandingPageForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    await signIn('email', { email: email });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 mb-8 w-full max-w-sm from-gray-300 to-brand-primary flex items-center rounded bg-gradient-to-r p-0.5">
        <input
          id='email'
          className="bg-gray-950 w-full flex-1 rounded p-2"
          placeholder="Enter your email"
          name="email"
          required
        />
        <button
          type="submit"
          className="bg-brand-primary text-gray-900 group ml-2 flex items-center rounded p-2 font-semibold transition-colors duration-200"
        >
          Join
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-gray-800 inline-block h-6 w-6 align-text-top transition-transform duration-200 group-hover:translate-x-[0.2rem]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
    </form>
  );
}

