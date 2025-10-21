import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface FooterProps {
  isRTL?: boolean;
}

export const Footer = ({ isRTL = false }: FooterProps) => {
  return (
    <footer className="bg-[#0A2540] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Company Info */}
          <div className={cn("space-y-4", isRTL && "text-right")}>
            <div className="italic text-2xl font-bold text-white">
              {isRTL ? "فريينت" : "Freint"}
            </div>

            <p className="text-[#E0E6ED] leading-relaxed">
              {isRTL 
                ? "منصة رائدة تربط بين أفضل المستقلين والعملاء في العالم العربي. نقدم خدمات عالية الجودة بأفضل الأسعار."
                : "A leading platform connecting the best freelancers and clients in the Arab world. We provide high-quality services at the best prices."
              }
            </p>

            {/* Social Links */}
            <div className={cn("flex space-x-3", isRTL && "space-x-reverse")}>
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon"
                  className="text-[#E0E6ED]/80 hover:text-[#00E0B8] hover:bg-white/10 transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={cn("space-y-4", isRTL && "text-right")}>
            <h3 className="italic text-lg font-semibold text-[#00C897]">
              {isRTL ? "روابط سريعة" : "Quick Links"}
            </h3>
            <nav className="space-y-2">
              {[
                { text: isRTL ? "المشاريع" : "Projects", path: "/projects" },
                { text: isRTL ? "المستقلين" : "Freelancers", path: "/freelancers" },
                { text: isRTL ? "حولنا" : "About Us", path: "/about" },
                { text: isRTL ? "اتصل بنا" : "Contact", path: "/contact-us" },
                { text: isRTL ? "الأسئلة الشائعة" : "FAQ", path: "/help" }
              ].map((link) => (
                <Link
                  key={link.text}
                  to={link.path}
                  className="block text-[#E0E6ED]/80 hover:text-[#00E0B8] transition-all duration-300 ease-in-out transform hover:translate-x-1"
                >
                  {link.text}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div className={cn("space-y-4", isRTL && "text-right")}>
            <h3 className="italic text-lg font-semibold text-[#00C897]">
              {isRTL ? "فئات الخدمات" : "Service Categories"}
            </h3>
            <nav className="space-y-2">
              {[
                { text: isRTL ? "تطوير المواقع" : "Web Development", path: "/projects?category=web-development" },
                { text: isRTL ? "تصميم جرافيك" : "Graphic Design", path: "/projects?category=graphic-design" },
                { text: isRTL ? "كتابة محتوى" : "Content Writing", path: "/projects?category=content-writing" },
                { text: isRTL ? "ترجمة" : "Translation", path: "/projects?category=translation" },
                { text: isRTL ? "تسويق رقمي" : "Digital Marketing", path: "/projects?category=digital-marketing" },
                { text: isRTL ? "برمجة التطبيقات" : "App Development", path: "/projects?category=app-development" }
              ].map((category) => (
                <Link
                  key={category.text}
                  to={category.path}
                  className="block text-[#E0E6ED]/80 hover:text-[#00E0B8] transition-all duration-300 ease-in-out transform hover:translate-x-1"
                >
                  {category.text}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className={cn("space-y-4", isRTL && "text-right")}>
            <h3 className="italic text-lg font-semibold text-[#00C897]">
              {isRTL ? "تواصل معنا" : "Contact Us"}
            </h3>
            <div className="space-y-3">
              <div className={cn("flex items-center space-x-3", isRTL && "space-x-reverse")}>
                <Mail className="w-5 h-5 text-[#00C897] flex-shrink-0" />
               <a href="mailto:info@freint.com" className="text-[#E0E6ED]/80 hover:text-[#00E0B8] transition-colors duration-300">
                   info@freint.com
                 </a>
              </div>
              <div className={cn("flex items-center space-x-3", isRTL && "space-x-reverse")}>
                <Phone className="w-5 h-5 text-[#00C897] flex-shrink-0" />
                <a href="tel:+966501234567" className="text-[#E0E6ED]/80 hover:text-[#00E0B8] transition-colors duration-300">
                  +966 50 123 4567
                </a>
              </div>
              <div className={cn("flex items-start space-x-3", isRTL && "space-x-reverse")}>
                <MapPin className="w-5 h-5 text-[#00C897] flex-shrink-0 mt-0.5" />
                <span className="text-[#E0E6ED]/80">
                  {isRTL 
                    ? "الرياض، المملكة العربية السعودية"
                    : "Riyadh, Saudi Arabia"
                  }
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-4">
              <h4 className="italic font-medium mb-2 text-[#00C897]">
                {isRTL ? "اشترك في نشرتنا البريدية" : "Subscribe to Newsletter"}
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={isRTL ? "بريدك الإلكتروني" : "Your email"}
                  className={cn(
                    "flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60",
                    "focus:outline-none focus:ring-2 focus:ring-[#00C897] transition-colors duration-300",
                    isRTL && "text-right"
                  )}
                />
                <Button variant="success" size="sm" className="bg-[#00C897] hover:bg-[#00E0B8] text-white transition-colors duration-300">
                  {isRTL ? "اشترك" : "Subscribe"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={cn(
          "border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0",
          isRTL && "md:flex-row-reverse"
        )}>
           <div className="text-[#E0E6ED]/60 text-sm">
             {isRTL 
               ? "© 2025 منصة فريينت. جميع الحقوق محفوظة."
               : "© 2025 Freint Platform. All rights reserved."
             }
           </div>
          
          <div className={cn("flex space-x-6", isRTL && "space-x-reverse")}>
            <Link to="/privacy-policy" className="text-[#E0E6ED]/60 hover:text-[#00E0B8] text-sm transition-colors duration-300">
              {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <Link to="/terms-of-use" className="text-[#E0E6ED]/60 hover:text-[#00E0B8] text-sm transition-colors duration-300">
              {isRTL ? "شروط الاستخدام" : "Terms of Use"}
            </Link>
            <Link to="/cookie-policy" className="text-[#E0E6ED]/60 hover:text-[#00E0B8] text-sm transition-colors duration-300">
              {isRTL ? "سياسة ملفات تعريف الارتباط" : "Cookie Policy"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
