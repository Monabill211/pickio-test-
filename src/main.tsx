import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { HelmetProvider } from "react-helmet-async";

import "./utils/createSuperAdmin";
import "./utils/createSuperAdminStandalone";
import "./utils/updateUserToAdmin";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);