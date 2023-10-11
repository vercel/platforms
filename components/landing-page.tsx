import dynamic from "next/dynamic";
import { Suspense } from "react";
import PrimaryOutlineButton from "./primary-outline-button";
import Link from "next/link";

const Globe = dynamic(() => import("./globe"), { ssr: false });

const LandingPage = () => {
  return (
    <>
      <div className="min-w-screen flex min-h-screen flex-col bg-brand-gray950 pt-[6rem]">
        <div className="flex w-full flex-col items-center justify-center p-6 md:p-8 lg:p-10">
          <h1 className="text-center font-serif font-thin text-3xl text-brand-gray100 md:text-5xl lg:text-5xl leading-snug">
            <span>Fund, manage, and grow</span>
            <br />
            <span>your startup city.</span>
          </h1>
          <p className="mt-4 font-sans text-lg md:text-xl  leading-normal text-brand-gray100 md:mt-6 lg:mt-8 lg:text-md">
            <span>
              Fora is an open source suite of tools for startup city builders.
            </span>
            {/* <br />
            <span>
              For startup city founder. Start, fund, and grow launch, and manage
            </span> */}
          </p>
          <div className="mb-8 mt-8">
            <Link href={`${process.env.NEXTAUTH_URL}/login`}>
              <PrimaryOutlineButton>Start your city</PrimaryOutlineButton>
            </Link>
          </div>
        </div>
        <div className="flex flex-col w-full items-center overflow-hidden">
          <Suspense>
            <Globe />
          </Suspense>
        </div>
      </div>
      {/* <div className="min-w-screen flex min-h-screen flex-col bg-brand-gray950 pt-[6rem] md:flex-row md:pt-0">
        <div className="flex w-full flex-col items-start p-6 md:w-1/2 md:p-8 lg:p-10">
          <h1 className="font-serif text-3xl font-light leading-none text-brand-gray100 md:text-3xl lg:text-4xl lg:font-light">
            Built by and for <span className="italic">the</span> world leading
            startup cities.
          </h1>
        </div>
      </div> */}
    </>
  );
};

export default LandingPage;
