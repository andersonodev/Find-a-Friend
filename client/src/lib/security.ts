/**
 * Utilitários de segurança para proteger a aplicação
 */

/**
 * Desabilita a captura de tela (não funciona em todos os navegadores)
 * Esta funcionalidade tem várias limitações:
 * - Não impede completamente capturas de tela no desktop
 * - Mais efetivo em alguns dispositivos móveis (principalmente iOS)
 * - Não funciona em todos os navegadores
 */
export function preventScreenCapture() {
  try {
    // Impedir impressão e salvar como PDF
    document.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey && e.key === 'p') ||
        (e.metaKey && e.key === 'p') ||
        (e.ctrlKey && e.key === 's') ||
        (e.metaKey && e.key === 's')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });

    // Esta função CSS experimental pode desativar capturas de tela em alguns navegadores
    if ('userAgentData' in navigator) {
      document.documentElement.style.setProperty('-webkit-user-select', 'none');
      document.documentElement.style.setProperty('-webkit-touch-callout', 'none');
    }

    // Eventos para detectar captura de tela
    document.addEventListener('copy', (e) => {
      const selection = window.getSelection()?.toString();
      if (selection && selection.length > 100) {
        e.clipboardData?.setData('text/plain', 'Cópia não permitida por razões de segurança.');
        e.preventDefault();
      }
    });
  } catch (error) {
    console.error('Erro ao configurar medidas contra captura de tela:', error);
  }
}

/**
 * Previne a visualização do código fonte da página
 * Esta função dificulta, mas não impede completamente o acesso ao código
 */
export function preventViewSource() {
  try {
    // Desabilitar menu de contexto
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });

    // Desabilitar visualização de código fonte
    document.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey && e.key === 'u') ||
        (e.metaKey && e.key === 'u') ||
        (e.key === 'F12') ||
        (e.ctrlKey && e.shiftKey && e.key === 'i') ||
        (e.metaKey && e.altKey && e.key === 'i')
      ) {
        e.preventDefault();
        return false;
      }
    });

    // Verificar periodicamente e detectar ferramentas de desenvolvedor
    setInterval(() => {
      if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
        // Ferramentas de desenvolvedor possivelmente abertas
        document.body.innerHTML = `
          <div style="background: black; color: white; height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px; text-align: center;">
            <h1 style="margin-bottom: 20px;">Acesso Não Autorizado Detectado</h1>
            <p style="margin-bottom: 20px;">Por razões de segurança, a aplicação não pode ser acessada com ferramentas de desenvolvedor abertas.</p>
            <button onclick="window.location.reload()" style="padding: 10px 20px; background: blue; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Recarregar Página
            </button>
          </div>
        `;
      }
    }, 1000);
  } catch (error) {
    console.error('Erro ao configurar medidas contra visualização de código:', error);
  }
}

/**
 * Inicializar todas as medidas de segurança
 */
export function initSecurity() {
  const isProd = import.meta.env.PROD;
  const forceSecurity = localStorage.getItem('forceSecurity') === 'true';
  
  // Ativar medidas de segurança apenas em ambiente de produção
  // ou quando explicitamente solicitado via localStorage
  if (isProd || forceSecurity) {
    console.log("Inicializando medidas de segurança");
    
    try {
      preventScreenCapture();
      preventViewSource();

      console.log("Medidas de segurança inicializadas com sucesso");
    } catch (error) {
      console.error("Erro ao inicializar medidas de segurança:", error);
    }
  } else {
    console.log("Medidas de segurança não ativadas em ambiente de desenvolvimento");
  }
}