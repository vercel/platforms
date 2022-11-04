import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
// import { useState, useEffect, useCallback } from "react";

import type { Meta, WithChildren } from "@/types";
import Banner from "./banner";

interface LayoutProps extends WithChildren {
  meta?: Meta;
  siteId?: string;
  subdomain?: string;
}

export default function Layout({ meta, children, subdomain }: LayoutProps) {
  //   const [scrolled, setScrolled] = useState(false);

  //   const onScroll = useCallback(() => {
  //     setScrolled(window.pageYOffset > 20);
  //   }, []);

  //   useEffect(() => {
  //     window.addEventListener("scroll", onScroll);
  //     return () => window.removeEventListener("scroll", onScroll);
  //   }, [onScroll]);

  return (
    <div>
      <div
        className={`fixed w-full ${
          false ? "drop-shadow-md" : ""
        }  top-0 left-0 right-0 h-16 bg-white z-30 transition-all ease duration-150 flex`}
      >
        <div className="flex justify-center items-center space-x-5 h-full max-w-screen-xl mx-auto px-10 sm:px-20">
          <Link href="/" className="flex justify-center items-center">
            {meta?.logo && (
              <div className="h-8 w-8 inline-block rounded-full overflow-hidden align-middle">
                <Image
                  alt={meta?.title ?? "Logo"}
                  height={40}
                  src={meta?.logo}
                  width={40}
                />
              </div>
            )}
            <span className="inline-block ml-3 font-medium truncate">
              {meta?.title}
            </span>
          </Link>
        </div>
      </div>
      <div className="mt-20">{children}</div>
      <Banner subdomain="demo" />
    </div>
  );
}
