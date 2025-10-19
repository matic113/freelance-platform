import { ReactNode, useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: ReactNode;
  isRTL?: boolean;
  onLanguageToggle?: () => void;
  withFooter?: boolean;
  mainClassName?: string;
}

export function DashboardShell({
  children,
  isRTL = false,
  onLanguageToggle,
  withFooter = true,
  mainClassName,
}: DashboardShellProps) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div
      className={cn("min-h-screen bg-muted/30", isRTL && "rtl")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={cn("transition-transform duration-300", isHeaderVisible ? "translate-y-0" : "-translate-y-full")}>
        <Header isRTL={isRTL} onLanguageToggle={onLanguageToggle} />
      </div>
      <main className={cn("container mx-auto px-4 py-8 mb-20", mainClassName)}>
        {children}
      </main>
      {withFooter && <Footer isRTL={isRTL} />}
    </div>
  );
}

