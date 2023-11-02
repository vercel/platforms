import dynamic from "next/dynamic";
import { Suspense } from "react";
import PrimaryOutlineButton from "./primary-outline-button";
import Link from "next/link";
// import { ChevronDown } from "lucide-react";
// import HowItWorks from "./how-it-works";

const Globe = dynamic(() => import("./globe"), { ssr: false });
// const ThreeGlobe = dynamic(() => import("./three-globe/index"), { ssr: false });

const LandingPage = () => {
  return (
    <>
      <div className="min-w-screen flex min-h-screen flex-col bg-brand-gray900 pt-[6rem]">
        <div className="flex w-full flex-col items-center justify-center p-6 md:p-8 lg:p-10">
          <h1 className="text-center font-serif text-3xl font-extralight leading-snug text-brand-gray200 md:text-5xl lg:text-5xl">
            <span>Crowdfund, run, and grow</span>
            <br />
            <span>your startup city.</span>
          </h1>
          <p className="lg:text-md mt-4 font-sans text-lg leading-normal text-brand-gray200 md:mt-6 md:text-xl lg:mt-8">
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
        <div className="flex w-full flex-col items-center overflow-hidden min-h-[900px]">
          <Suspense>
            <>
              <Globe />
              {/* <ChevronDown className="mx-auto h-8 w-8 stroke-warmGray-200" /> */}
            </>
          </Suspense>
        </div>
        {/* <HowItWorks /> */}
      </div>
    </>
  );
};

export default LandingPage;
