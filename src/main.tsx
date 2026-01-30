import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <React.Suspense fallback={<div className="flex items-center justify-center h-screen text-xl">Loading Application...</div>}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
);
