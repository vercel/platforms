import { useEffect, useState } from "react";

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    height: number | undefined;
    width: number | undefined;
  }>({
    height: undefined,
    width: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return {
    isDesktop:
      typeof windowSize?.width === "number" && windowSize?.width >= 768,
    isMobile: typeof windowSize?.width === "number" && windowSize?.width < 768,
    windowSize,
  };
}
