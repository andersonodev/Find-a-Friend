import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Search, Loader2 } from "lucide-react";
import { loadGoogleMapsApi, isGoogleMapsLoaded } from "@/lib/googleMaps";

// Tipos para o Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: {
              types?: string[];
              componentRestrictions?: { country: string };
            }
          ) => {
            addListener: (event: string, callback: () => void) => void;
            getPlace: () => {
              formatted_address?: string;
              geometry?: {
                location?: {
                  lat: () => number;
                  lng: () => number;
                };
              };
            };
          };
        };
        Geocoder: new () => {
          geocode: (
            request: { 
              address?: string; 
              location?: {
                lat: number;
                lng: number;
              };
            }
          ) => Promise<{
            results: Array<{
              formatted_address: string;
              geometry: {
                location: {
                  lat: () => number;
                  lng: () => number;
                };
              };
            }>;
          }>;
        };
      };
    };
  }
}

interface LocationSearchProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  initialAddress?: string;
}

// Definir tipo para as sugestões de localização
interface LocationSuggestion {
  address: string;
  lat: number;
  lng: number;
}

export default function LocationSearch({ onLocationSelect, initialAddress = "" }: LocationSearchProps) {
  const [address, setAddress] = useState(initialAddress);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);

  // Carregar a API do Google Maps
  useEffect(() => {
    const loadApi = async () => {
      try {
        await loadGoogleMapsApi();
        setIsApiLoaded(true);
      } catch (error) {
        console.error("Erro ao carregar a API do Google Maps:", error);
      }
    };

    loadApi();
  }, []);

  // Inicializar o Autocomplete e o Geocoder quando a API estiver carregada
  useEffect(() => {
    if (!isApiLoaded || !inputRef.current || !isGoogleMapsLoaded()) return;

    try {
      // Inicializar Autocomplete
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "br" } // Restringir ao Brasil
      });

      // Inicializar Geocoder
      geocoderRef.current = new window.google.maps.Geocoder();

      // Adicionar listener para quando o usuário selecionar um lugar
      autoCompleteRef.current.addListener("place_changed", () => {
        const place = autoCompleteRef.current?.getPlace();
        
        if (place && place.formatted_address) {
          const location = {
            address: place.formatted_address,
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0
          };
          
          setAddress(location.address);
          setSuggestions([]);
          setShowSuggestions(false);
          onLocationSelect(location);
        }
      });
    } catch (error) {
      console.error("Erro ao inicializar Google Maps Autocomplete:", error);
    }
  }, [isApiLoaded, onLocationSelect]);

  // Função para buscar sugestões de endereço
  const searchAddress = async () => {
    if (!address.trim() || !isApiLoaded || !geocoderRef.current) return;

    setIsLoading(true);
    
    try {
      const result = await geocoderRef.current.geocode({ address });
      
      if (result.results && result.results.length > 0) {
        const newSuggestions = result.results.map((item: any) => ({
          address: item.formatted_address,
          lat: item.geometry.location.lat(),
          lng: item.geometry.location.lng()
        }));
        
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para obter a localização atual do usuário
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocalização não é suportada pelo seu navegador");
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          if (!geocoderRef.current) {
            setIsLoading(false);
            return;
          }
          
          const result = await geocoderRef.current.geocode({
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
          
          if (result.results && result.results.length > 0) {
            const location = {
              address: result.results[0].formatted_address,
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            setAddress(location.address);
            onLocationSelect(location);
          }
        } catch (error) {
          console.error("Erro ao obter endereço da localização atual:", error);
        } finally {
          setIsLoading(false);
          setShowSuggestions(false);
        }
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        setIsLoading(false);
      }
    );
  };

  // Manipular a seleção de uma sugestão
  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    setAddress(suggestion.address);
    setShowSuggestions(false);
    onLocationSelect(suggestion);
  };

  // Manipular o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchAddress();
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Digite um endereço ou localização"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            disabled={!isApiLoaded || isLoading}
            className="pr-10"
          />
          {isLoading ? (
            <Loader2 className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" />
          ) : (
            <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          )}
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          disabled={!isApiLoaded || isLoading}
          onClick={getCurrentLocation}
          title="Usar minha localização atual"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </form>

      {/* Sugestões de endereços */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto shadow-lg">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index}
                className="px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.address}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}