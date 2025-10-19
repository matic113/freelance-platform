import { ReactNode } from "react";
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
  return (
    <div
      className={cn("min-h-screen bg-muted/30", isRTL && "rtl")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Header isRTL={isRTL} onLanguageToggle={onLanguageToggle} />
      <main className={cn("container mx-auto px-4 py-8 mb-20", mainClassName)}>
        {children}
      </main>
      {withFooter && <Footer isRTL={isRTL} />}
    </div>
  );
}

