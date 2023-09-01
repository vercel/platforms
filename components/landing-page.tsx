import dynamic from "next/dynamic";
import LandingPageForm from "./landing-page-form";
import { Suspense } from "react";
import PrimaryOutlineButton from "./primary-outline-button";

const Globe = dynamic(() => import("./globe"), { ssr: false });

const LandingPage = () => {
  return (
    <div className="min-w-screen flex min-h-screen flex-col bg-brand-gray950 pt-[6rem] md:flex-row md:pt-0">
      <div className="flex w-full flex-col items-start justify-center p-6 md:w-1/2 md:p-8 lg:p-10">
        <h1 className="font-serif text-4xl font-light leading-none text-brand-gray100 md:text-5xl lg:text-[3.5rem] lg:font-light">
          Radical Sovereignty
        </h1>
        <p className="mt-4 font-sans text-xl  leading-normal text-brand-gray100 md:mt-6 lg:mt-8 lg:text-2xl">
          Fora is an open source platform to start and run
          <span> new cities.</span>
        </p>
        {/* <LandingPageForm /> */}
        <div className="my-8">
          <PrimaryOutlineButton>Connect Passport</PrimaryOutlineButton>
        </div>
      </div>
      <div className="flex w-full items-center overflow-hidden md:w-1/2">
        <Suspense fallback="loading...">
          <Globe />
        </Suspense>
      </div>
    </div>
  );
};

export default LandingPage;
