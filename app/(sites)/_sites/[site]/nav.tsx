"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";

export default function Nav({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(window.pageYOffset > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  return (
    <div
      className={`fixed w-full ${
        scrolled ? "drop-shadow-md" : ""
      }  top-0 left-0 right-0 h-16 bg-white z-30 transition-all ease duration-150 flex`}
    >
      {children}
    </div>
  );
}
