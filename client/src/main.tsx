import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initSecurity } from "./lib/security";

// Setup for proper font configuration
document.documentElement.classList.add('font-sans');

// Inicializar medidas de segurança
// Ativa proteções contra captura de tela e visualização de código fonte
if (import.meta.env.PROD) {
  // Só ativamos em produção para facilitar o desenvolvimento
  initSecurity();
} else {
  console.log('Medidas de segurança não ativadas em ambiente de desenvolvimento');
}

createRoot(document.getElementById("root")!).render(<App />);
