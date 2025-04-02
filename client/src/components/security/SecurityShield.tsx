import { useState, useEffect } from "react";

export default function SecurityShield() {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  useEffect(() => {
    function detectDevTools() {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      setDevToolsOpen(widthThreshold || heightThreshold);
    }

    const intervalId = setInterval(detectDevTools, 1000);

    window.addEventListener("resize", detectDevTools);

    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    document.addEventListener("keydown", (e) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "U") ||
        (e.metaKey && e.altKey && e.key === "I") ||
        (e.metaKey && e.key === "U") ||
        e.key === "F12"
      ) {
        e.preventDefault();
        setDevToolsOpen(true);
      }
    });

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", detectDevTools);
    };
  }, []);

  if (devToolsOpen) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] text-white p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-16 h-16 mb-4 text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <h1 className="text-2xl font-bold mb-2">Acesso Não Autorizado Detectado</h1>
        <p className="text-center mb-6">
          Por razões de segurança, esta aplicação não permite o uso de ferramentas de desenvolvedor ou inspeção de código.
        </p>
        <p className="text-center mb-8">
          Por favor, feche as ferramentas de desenvolvedor e atualize a página para continuar.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-8 rounded"
        >
          Atualizar
        </button>
      </div>
    );
  }

  return null;
}