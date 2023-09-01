"use client";
export default function LandingPageForm() {

  return (
    <form className="mt-8 mb-8 w-full max-w-sm from-brand-gray300 to-brand-primary flex items-center rounded bg-gradient-to-r p-0.5">
        <input
          className="bg-brand-gray950 w-full flex-1 rounded p-2"
          placeholder="Enter your email"
          name="email"
          required
        />
        <button
          type="submit"
          className="bg-brand-primary text-brand-gray900 group ml-2 flex items-center rounded p-2 font-semibold transition-colors duration-200"
        >
          Join
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-brand-gray800 inline-block h-6 w-6 align-text-top transition-transform duration-200 group-hover:translate-x-[0.2rem]"
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
