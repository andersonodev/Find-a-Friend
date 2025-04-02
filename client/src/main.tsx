import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Setup for proper font configuration
document.documentElement.classList.add('font-sans');

createRoot(document.getElementById("root")!).render(<App />);
