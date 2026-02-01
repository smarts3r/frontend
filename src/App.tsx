import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { router } from "./router";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.dir(i18n.language);
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n, i18n.language]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
