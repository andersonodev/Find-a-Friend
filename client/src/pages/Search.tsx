import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchForm from "@/components/search/SearchForm";
import FriendCard from "@/components/friend/FriendCard";
import FilterDropdown from "@/components/filters/FilterDropdown";
import { Button } from "@/components/ui/button";

export default function Search() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  
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
  
  const { data: amigos = [], isLoading } = useQuery({
    queryKey: [apiUrl],
    staleTime: 30000, // 30 seconds
  });
  
  const [sortedAmigos, setSortedAmigos] = useState([]);
  const [sortValue, setSortValue] = useState("rating");
  const [filters, setFilters] = useState({
    verified: "all",
    minRating: "0"
  });
  const [visibleCount, setVisibleCount] = useState(8);
  
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
  }, [amigos, sortValue, filters]);
  
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
  
  const visibleAmigos = sortedAmigos.slice(0, visibleCount);
  const hasMore = visibleCount < sortedAmigos.length;
  
  // Build location display string
  let locationDisplay = "Resultados da busca";
  if (locationParam) {
    locationDisplay = locationParam;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SearchForm />
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
            
            <div className="mt-4 md:mt-0">
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
              
              {hasMore && (
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
