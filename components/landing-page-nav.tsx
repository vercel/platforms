"use client";
import Link from "next/link";
import styles from "./landing-page-nav.module.css";
import { useModal } from "./modal/provider";
import JoinACityModal from "./modal/join-a-city";
import FoundACityModal from "./modal/found-a-city";
import PrimaryOutlineButton from "./buttons/primary-outline-button";

export default function LandingPageNav() {
  const modal = useModal();
  const openJoinACity = () => {
    modal?.show(<JoinACityModal />);
  };

  const openFoundACity = () => {
    modal?.show(<FoundACityModal />);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 mx-auto h-14 overflow-clip  border-b border-gray-500/10">
      <div className={`${styles["landing-page-nav-backdrop"]}`}>
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center  justify-between px-5">
          <Link
            href={"/"}
            className="font-serif text-xl font-light text-gray-300"
          >
            Fora
          </Link>

          <div className="flex">
            <button
              onClick={openJoinACity}
              className="px-2 mr-2 font-sans font-medium text-gray-300"
            >
              Join
            </button>
            <PrimaryOutlineButton
              onClick={openFoundACity}
            >
              Found a city
            </PrimaryOutlineButton>
          </div>
        </div>
      </div>
    </nav>
  );
}
