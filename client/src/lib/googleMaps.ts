// Declare google maps types to fix TypeScript errors
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

let googleMapsLoaded = false;

/**
 * Carrega a API do Google Maps dinamicamente
 */
export const loadGoogleMapsApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Se já foi carregado, resolve imediatamente
    if (window.google && window.google.maps) {
      googleMapsLoaded = true;
      resolve();
      return;
    }

    // Se já existe um script carregando, aguarda
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      // Espera o carregamento
      window.initMap = () => {
        googleMapsLoaded = true;
        resolve();
      };
      return;
    }

    // Callback para quando a API for carregada
    window.initMap = () => {
      googleMapsLoaded = true;
      resolve();
    };

    // Cria o script e adiciona ao head
    try {
      const apiKey = import.meta.env.GOOGLE_MAPS_API_KEY || '';
      if (!apiKey) {
        console.warn("Chave da API do Google Maps não encontrada. Adicione GOOGLE_MAPS_API_KEY ao seu .env");
        reject(new Error("Chave da API do Google Maps não encontrada"));
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        reject(new Error("Falha ao carregar a API do Google Maps"));
      };
      
      document.head.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Verifica se a API do Google Maps foi carregada
 */
export const isGoogleMapsLoaded = (): boolean => {
  return googleMapsLoaded && !!window.google && !!window.google.maps;
};