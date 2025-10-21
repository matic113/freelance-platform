import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhyFreintDropdownProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isRTL?: boolean;
  textColor?: string;
}

const whyFreintMegaMenu = [
  {
    category: (isRTL: boolean) => (isRTL ? "قصص وتجارب" : "Stories & Experiences"),
    links: [
      { text: (isRTL: boolean) => (isRTL ? "قصص النجاح" : "Success Stories"), path: "/success-stories" },
      { text: (isRTL: boolean) => (isRTL ? "تجارب العملاء" : "Client Experiences"), path: "/client-experiences" },
      { text: (isRTL: boolean) => (isRTL ? "تقييمات" : "Reviews"), path: "/reviews" },
    ],
  },
  {
    category: (isRTL: boolean) => (isRTL ? "الإرشادات" : "Guides"),
    links: [
      { text: (isRTL: boolean) => (isRTL ? "كيفية التوظيف" : "How to Hire"), path: "/how-to-hire" },
      { text: (isRTL: boolean) => (isRTL ? "كيفية العثور على عمل" : "How to Find Work"), path: "/how-to-find-work" },
    ],
  },
];

export const WhyFreintDropdown = ({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  isRTL = false,
  textColor = "#0A2540",
}: WhyFreintDropdownProps) => {
  return (
    <div
      className="relative font-medium transition-colors cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="flex items-center gap-1 font-medium hover:opacity-80"
        style={{ color: textColor }}
      >
        {isRTL ? "لماذا فريينت" : "Why Freint"}
        <ChevronDown className="w-4 h-4" stroke={textColor} />
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-2 w-[400px] bg-white border border-border rounded-md z-50 shadow-xl p-6 grid grid-cols-2 gap-6 animate-fade-in",
            isRTL ? "right-0 text-right" : "left-0 text-left"
          )}
        >
          {whyFreintMegaMenu.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-semibold mb-2 text-[#0A2540]">
                {typeof section.category === 'function' ? section.category(isRTL) : section.category}
              </h4>
              <ul className="space-y-2 leading-relaxed">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.path}
                      className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {typeof link.text === 'function' ? link.text(isRTL) : link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
