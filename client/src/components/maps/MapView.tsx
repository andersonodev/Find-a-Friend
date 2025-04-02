import { useEffect, useRef, useState } from "react";
import { loadGoogleMapsApi, isGoogleMapsLoaded } from "@/lib/googleMaps";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Tipo para o marcador do Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (
          mapDiv: HTMLElement,
          options?: {
            center: { lat: number; lng: number };
            zoom: number;
            mapTypeControl?: boolean;
            streetViewControl?: boolean;
            fullscreenControl?: boolean;
            zoomControl?: boolean;
          }
        ) => {
          setCenter: (position: { lat: number; lng: number }) => void;
        };
        Marker: new (options: {
          position: { lat: number; lng: number };
          map: any;
          title?: string;
          animation?: number;
        }) => {
          setMap: (map: any | null) => void;
          addListener: (event: string, callback: () => void) => void;
          getPosition: () => {
            lat: () => number;
            lng: () => number;
          };
        };
        Animation: {
          DROP: number;
        };
      };
    };
  }
}

// Tipo customizado para o marcador
interface GoogleMapMarker {
  position: { lat: number; lng: number };
  title?: string;
  id?: number | string;
}

interface MapViewProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: GoogleMapMarker[];
  height?: string;
  width?: string;
  onMarkerClick?: (marker: any) => void;
}

export default function MapView({
  center,
  zoom = 15,
  markers = [],
  height = "400px",
  width = "100%",
  onMarkerClick
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const markerRefs = useRef<any[]>([]);

  // Carregar a API do Google Maps
  useEffect(() => {
    const loadMap = async () => {
      try {
        await loadGoogleMapsApi();
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar a API do Google Maps:", error);
      }
    };

    loadMap();
  }, []);

  // Inicializar o mapa quando a API estiver carregada
  useEffect(() => {
    if (isLoading || !mapRef.current || !isGoogleMapsLoaded()) return;

    try {
      // Inicializar o mapa
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });

      // Limpar marcadores anteriores
      markerRefs.current.forEach(marker => marker.setMap(null));
      markerRefs.current = [];

      // Adicionar novos marcadores
      markers.forEach(markerData => {
        const marker = new window.google.maps.Marker({
          position: markerData.position,
          map: googleMapRef.current,
          title: markerData.title || "",
          animation: window.google.maps.Animation.DROP,
        });

        // Adicionar evento de clique se o callback existir
        if (onMarkerClick) {
          marker.addListener("click", () => {
            onMarkerClick(marker);
          });
        }

        markerRefs.current.push(marker);
      });
    } catch (error) {
      console.error("Erro ao inicializar o mapa:", error);
    }
  }, [isLoading, center, zoom, markers, onMarkerClick]);

  // Atualizar o centro do mapa quando o center prop mudar
  useEffect(() => {
    if (!googleMapRef.current || !isGoogleMapsLoaded()) return;
    
    googleMapRef.current.setCenter(center);
  }, [center]);

  return (
    <Card className="relative overflow-hidden" style={{ height, width }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </Card>
  );
}