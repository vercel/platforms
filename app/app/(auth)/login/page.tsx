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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Platforms Starter Kit
        </h2>
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

      <div className="mt-8 mx-auto sm:w-full w-11/12 sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          <LoginButton />
        </div>
      </div>
    </>
  );
}
