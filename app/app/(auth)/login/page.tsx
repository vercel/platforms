import Image from "next/image";
import LoginButton from "./login-button";

export default function LoginPage() {
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          alt="Platforms Starter Kit"
          width={100}
          height={100}
          className="relative mx-auto h-12 w-auto"
          src="/logo.png"
        />
        <h1 className="mt-6 text-center font-cal text-3xl text-gray-900">
          Platforms Starter Kit
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Build multi-tenant applications with custom domains. <br /> Read the{" "}
          <a
            className="font-medium text-black hover:text-gray-800"
            href="https://demo.vercel.pub/platforms-starter-kit"
            rel="noreferrer"
            target="_blank"
          >
            blog post
          </a>
        </p>
      </div>

      <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
        <LoginButton />
      </div>
    </>
  );
}
