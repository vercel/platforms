import dynamic from "next/dynamic";
import { Suspense } from "react";
import PrimaryOutlineButton from "./primary-outline-button";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";


const Globe = dynamic(() => import("./globe"), { ssr: false });
// const ThreeGlobe = dynamic(() => import("./three-globe/index"), { ssr: false });

const LandingPage = () => {
  return (
    <>
      <div className="min-w-screen flex min-h-screen flex-col bg-gray-900 pt-[6rem]">
        <div className="flex w-full flex-col items-center justify-center p-6 md:p-8 lg:p-10">
          <h1 className="text-center font-serif text-3xl font-extralight leading-snug text-gray-200 md:text-5xl lg:text-5xl">
            <span>Crowdfund, run, and grow</span>
            <br />
            <span>your startup city.</span>
          </h1>
          <p className="lg:text-md mt-4 font-sans text-lg leading-normal text-gray-200 md:mt-6 md:text-xl lg:mt-8">
            <span>
              Fora is an open-source suite of tools for startup city builders.
            </span>
            {/* <br />
            <span>
              For startup city founder. Start, fund, and grow launch, and manage
            </span> */}
          </p>
          <div className="mb-8 mt-8">
            {/* <Link href={`${process.env.NEXTAUTH_URL}/login`}>
              <PrimaryOutlineButton>Start your city</PrimaryOutlineButton>
            </Link> */}
          </div>
          <div className="flex items-center">
            <Input
              id="email"
              className="h-10 w-full mr-6 px-3 py-2 rounded border border-gray-800 dark:border-gray-300 bg-transparent text-gray-200 transition-all duration-300 placeholder:text-gray-700 placeholder:dark:text-gray-600 hover:border-brand-primary/40 focus:border-brand-primary/50 focus:ring-brand-primary/50"
              placeholder="Email"
              name="email"
              required
            />
            <PrimaryOutlineButton
              type="submit"
              className="group flex h-10 w-full items-center justify-center rounded border border-gray-300/30 p-2 px-4 font-semibold text-gray-200 transition-colors duration-200 hover:border-brand-primary/60 hover:text-brand-primary/60"
            >
              Stay posted
            </PrimaryOutlineButton>
          </div>
        </div>
        <div className="flex w-full flex-col items-center overflow-hidden min-h-[900px]">
          <Suspense>
            <>
              <Globe />
              {/* <ChevronDown className="mx-auto h-8 w-8 stroke-gray-200" /> */}
            </>
          </Suspense>
        </div>
        {/* <HowItWorks /> */}
      </div>
    </>
  );
};

export default LandingPage;
