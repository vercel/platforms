import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";

export default function Leaflet({
  children,
  setShow,
}: {
  children: ReactNode;
  setShow: Dispatch<SetStateAction<boolean>>;
}) {
  const leafletRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const transitionProps = { damping: 30, stiffness: 500, type: "spring" };
  useEffect(() => {
    controls.start({
      transition: transitionProps,
      y: 20,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDragEnd(_: any, info: any) {
    const offset = info.offset.y;
    const velocity = info.velocity.y;
    const height = leafletRef.current?.getBoundingClientRect().height || 0;
    if (offset > height / 2 || velocity > 800) {
      await controls.start({ transition: transitionProps, y: "100%" });
      setShow(false);
    } else {
      controls.start({ transition: transitionProps, y: 0 });
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        animate={controls}
        className="group fixed inset-x-0 bottom-0 z-40 w-screen cursor-grab bg-white pb-5 active:cursor-grabbing sm:hidden"
        drag="y"
        dragConstraints={{ bottom: 0, top: 0 }}
        dragDirectionLock
        dragElastic={{ bottom: 1, top: 0 }}
        exit={{ y: "100%" }}
        initial={{ y: "100%" }}
        key="leaflet"
        onDragEnd={handleDragEnd}
        ref={leafletRef}
        transition={transitionProps}
      >
        <div
          className={`rounded-t-4xl -mb-1 flex h-7 w-full items-center justify-center border-t border-gray-200`}
        >
          <div className="-mr-1 h-1 w-6 rounded-full bg-gray-300 transition-all group-active:rotate-12" />
          <div className="h-1 w-6 rounded-full bg-gray-300 transition-all group-active:-rotate-12" />
        </div>
        {children}
      </motion.div>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-30 bg-gray-100 bg-opacity-10 backdrop-blur"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        key="leaflet-backdrop"
        onClick={() => setShow(false)}
      />
    </AnimatePresence>
  );
}
