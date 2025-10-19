import { useState, useEffect, useRef, useCallback } from "react";

export const useHeaderScroll = () => {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 100) {
      if (currentScrollY > lastScrollYRef.current) {
        setIsHeaderHidden(true);
      } else {
        setIsHeaderHidden(false);
      }
    } else {
      setIsHeaderHidden(false);
    }
    lastScrollYRef.current = currentScrollY;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return { isHeaderHidden };
};
