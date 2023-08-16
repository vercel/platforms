"use client";

import FocusTrap from "focus-trap-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";

import useWindowSize from "@/lib/hooks/use-window-size";

import Leaflet from "./leaflet";

export default function Modal({
  children,
  setShowModal,
  showModal,
}: {
  children: React.ReactNode;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
}) {
  const desktopModalRef = useRef(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    },
    [setShowModal],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const { isDesktop, isMobile } = useWindowSize();

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {isMobile && <Leaflet setShow={setShowModal}>{children}</Leaflet>}
          {isDesktop && (
            <>
              <FocusTrap focusTrapOptions={{ initialFocus: false }}>
                <motion.div
                  animate={{ scale: 1 }}
                  className="fixed inset-0 z-40 hidden min-h-screen items-center justify-center md:flex"
                  exit={{ scale: 0.95 }}
                  initial={{ scale: 0.95 }}
                  key="desktop-modal"
                  onMouseDown={(e) => {
                    if (desktopModalRef.current === e.target) {
                      setShowModal(false);
                    }
                  }}
                  ref={desktopModalRef}
                >
                  {children}
                </motion.div>
              </FocusTrap>
              <motion.div
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-30 bg-gray-100 bg-opacity-10 backdrop-blur"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="desktop-backdrop"
                onClick={() => setShowModal(false)}
              />
            </>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
