import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Import super admin creator utilities
import "./utils/createSuperAdmin";
import "./utils/createSuperAdminStandalone";
import "./utils/updateUserToAdmin";

createRoot(document.getElementById("root")!).render(<App />);
