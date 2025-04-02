import { useState, useEffect } from 'react';

interface DynamicWatermarkProps {
  text?: string;
  email?: string;
}

/**
 * Componente que renderiza uma marca d'água dinâmica em toda a aplicação
 * para desencorajar capturas de tela, usando informações do usuário
 */
export default function DynamicWatermark({ text, email }: DynamicWatermarkProps) {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // A marca d'água padrão inclui informações do usuário (se disponível) e um timestamp
  const watermarkText = text || (email ? `${email} - ${timestamp}` : timestamp);
  
  // Atualizar o timestamp a cada segundo
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Atualizar a posição do mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // O estilo da marca d'água é semi-transparente e segue o mouse
  return (
    <>
      {/* Marca d'água fixa em toda a tela, extremamente difícil de remover */}
      <div className="fixed inset-0 pointer-events-none select-none" style={{ zIndex: 9998 }}>
        <div className="w-full h-full flex items-center justify-center">
          <div 
            className="text-black opacity-5 text-6xl font-bold"
            style={{ transform: 'rotate(-45deg)' }}
          >
            {watermarkText}
          </div>
        </div>
      </div>
      
      {/* Marca d'água que segue o cursor (visível apenas quando o cursor se move) */}
      <div 
        className="fixed pointer-events-none select-none text-xs text-black/20"
        style={{ 
          left: `${position.x + 20}px`, 
          top: `${position.y + 10}px`,
          zIndex: 9999,
          transition: 'transform 0.1s ease',
        }}
      >
        {watermarkText}
      </div>
    </>
  );
}