import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchForm from "@/components/search/SearchForm";
import FriendCard from "@/components/friend/FriendCard";
import FilterDropdown from "@/components/filters/FilterDropdown";
import LocationSearch from "@/components/maps/LocationSearch";
import MapView from "@/components/maps/MapView";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Map, List, MapPin } from "lucide-react";

// Interface para definir o formato dos amigos retornados da API
interface Amigo {
  id: number;
  name: string;
  location: string;
  bio: string;
  avatar: string;
  isVerified: boolean;
  averageRating: number;
  reviewCount: number;
  interests: string[];
  hourlyRate: number;
  // Outros campos que possam existir
}

export default function Search({ user }: {user?: any}) {
  const [locationRoute, navigate] = useLocation();
  const searchParams = new URLSearchParams(locationRoute.split("?")[1] || "");
  
  const locationParam = searchParams.get("location") || "";
  const interestParam = searchParams.get("interest") || "";
  const dateParam = searchParams.get("date") || "";
  
  // Build the API query URL with params
  let apiUrl = "/api/amigos";
  const queryParams = new URLSearchParams();
  
  if (locationParam) queryParams.append("location", locationParam);
  if (interestParam) queryParams.append("interest", interestParam);
  if (dateParam) queryParams.append("date", dateParam);
  
  const queryString = queryParams.toString();
  if (queryString) {
    apiUrl += `?${queryString}`;
  }
  
  const { data: amigos = [] as Amigo[], isLoading } = useQuery<Amigo[]>({
    queryKey: [apiUrl],
    staleTime: 30000, // 30 seconds
  });
  
  const [sortedAmigos, setSortedAmigos] = useState<Amigo[]>([]);
  const [sortValue, setSortValue] = useState("rating");
  const [filters, setFilters] = useState({
    verified: "all",
    minRating: "0"
  });
  const [visibleCount, setVisibleCount] = useState(8);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [mapCenter, setMapCenter] = useState({ lat: -23.5505, lng: -46.6333 }); // São Paulo
  const [selectedLocation, setSelectedLocation] = useState<{ address: string; lat: number; lng: number } | null>(null);
  
  // Apply sorting and filtering whenever amigos data changes
  useEffect(() => {
    if (!amigos?.length) return;
    
    let filtered = [...amigos];
    
    // Apply filters
    if (filters.verified === "true") {
      filtered = filtered.filter(amigo => amigo.isVerified);
    }
    
    if (parseInt(filters.minRating) > 0) {
      filtered = filtered.filter(amigo => amigo.averageRating >= parseInt(filters.minRating));
    }
    
    // Filter by location distance if we have coordinates
    if (selectedLocation) {
      // Filter amigos based on proximity (fake distance calculation)
      // In a real app, you would use more sophisticated geospatial queries
    }
    
    // Apply sorting
    switch (sortValue) {
    case "rating":
      filtered.sort((a, b) => b.averageRating - a.averageRating);
      break;
    case "price_asc":
      filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
      break;
    case "reviews":
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      filtered.sort((a, b) => b.averageRating - a.averageRating);
    }
    
    setSortedAmigos(filtered);
  }, [amigos, sortValue, filters, selectedLocation]);
  
  const handleSortChange = (value: string) => {
    setSortValue(value);
  };
  
  const handleFilterChange = (filter: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };
  
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 8);
  };
  
  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setSelectedLocation(location);
    setMapCenter({ lat: location.lat, lng: location.lng });
    
    // Update the search URL with the new location
    const newParams = new URLSearchParams(searchParams);
    newParams.set("location", location.address);
    navigate(`/search?${newParams.toString()}`);
  };
  
  // Generate map markers from amigos data
  const mapMarkers = sortedAmigos.map(amigo => {
    // Generate random coordinates near the map center for demo
    // In a real application, you would have actual coordinates from the database
    const randomLat = mapCenter.lat + (Math.random() - 0.5) * 0.05;
    const randomLng = mapCenter.lng + (Math.random() - 0.5) * 0.05;
    
    return {
      position: { lat: randomLat, lng: randomLng },
      title: amigo.name,
      id: amigo.id
    };
  });
  
  const visibleAmigos = sortedAmigos.slice(0, visibleCount);
  const hasMore = visibleCount < sortedAmigos.length;
  
  // Build location display string
  let locationDisplay = "Resultados da busca";
  if (locationParam) {
    locationDisplay = locationParam;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            {/* Unified search form with location */}
            <Card className="p-6 border-0 shadow-lg">
              <h2 className="text-lg font-medium mb-4 text-blue-800">Encontrar amigos por localização</h2>
              <LocationSearch 
                onLocationSelect={handleLocationSelect} 
                initialAddress={locationParam}
              />
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-white flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900">
                {locationParam ? `Amigos disponíveis em ${locationDisplay}` : "Todos os amigos disponíveis"}
              </h2>
              <p className="text-neutral-600 mt-1">
                {isLoading 
                  ? "Buscando amigos..." 
                  : `Mostrando ${sortedAmigos.length} ${sortedAmigos.length === 1 ? 'amigo' : 'amigos'}${interestParam ? ` com interesse em ${interestParam}` : ""}`}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-4 items-center">
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4 mr-2" />
                  Lista
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("map")}
                >
                  <Map className="w-4 h-4 mr-2" />
                  Mapa
                </Button>
              </div>
              
              <FilterDropdown 
                sortValue={sortValue} 
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                currentFilters={filters}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="h-56 bg-gray-200 animate-pulse" />
                  <div className="p-4">
                    <div className="flex justify-between mb-1">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-1/2" />
                    <div className="h-16 bg-gray-200 rounded animate-pulse mb-4" />
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4" />
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedAmigos.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Nenhum amigo encontrado</h3>
              <p className="text-neutral-600 mb-4">Tente ajustar seus filtros ou critérios de busca</p>
            </div>
          ) : (
            <>
              {viewMode === "list" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visibleAmigos.map((amigo) => (
                    <FriendCard
                      key={amigo.id}
                      id={amigo.id}
                      name={amigo.name}
                      location={amigo.location}
                      bio={amigo.bio}
                      avatar={amigo.avatar}
                      verified={amigo.isVerified}
                      rating={amigo.averageRating}
                      reviewCount={amigo.reviewCount}
                      interests={amigo.interests}
                      hourlyRate={amigo.hourlyRate}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-1/3 flex flex-col gap-4 h-[600px] overflow-auto">
                    {visibleAmigos.map((amigo) => (
                      <Card key={amigo.id} className="p-3 hover:shadow-md transition-shadow">
                        <div className="flex gap-3">
                          <div className="rounded-full w-12 h-12 overflow-hidden flex-shrink-0">
                            <img 
                              src={amigo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(amigo.name)}&background=random`} 
                              alt={amigo.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{amigo.name}</h3>
                              <span className="text-sm font-medium text-primary">{`R$${amigo.hourlyRate}/h`}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{amigo.location}</span>
                            </div>
                            <div className="mt-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={() => navigate(`/amigos/${amigo.id}`)}
                              >
                                Ver perfil
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="w-full lg:w-2/3 h-[600px]">
                    <MapView 
                      center={mapCenter}
                      markers={mapMarkers}
                      height="100%"
                      width="100%"
                      onMarkerClick={(marker) => {
                        const amigoId = mapMarkers.find(
                          m => m.position.lat === marker.getPosition()?.lat() &&
                              m.position.lng === marker.getPosition()?.lng()
                        )?.id;
                        
                        if (amigoId) {
                          navigate(`/amigos/${amigoId}`);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
              
              {viewMode === "list" && hasMore && (
                <div className="flex justify-center mt-12">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary-50"
                    onClick={handleLoadMore}
                  >
                    Carregar mais amigos
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
