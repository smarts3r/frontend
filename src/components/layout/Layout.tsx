import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";

import { Outlet } from "react-router-dom";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";

  // Update HTML attributes when language changes
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [currentLang, isRTL]);

  return (
    <div className={`min-h-screen flex flex-col ${isRTL ? "font-arabic" : "font-latin"}`}>
      <Navbar />
      <main className="grow">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
