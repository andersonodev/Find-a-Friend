import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import FriendCard from "@/components/friend/FriendCard";
import { Heart, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface FavoritesProps {
  user: any | null;
}

export default function Favorites({ user }: FavoritesProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<any[]>([]);

  // Mock sample data for favorites
  const sampleFavorites = [
    {
      id: 1,
      name: "Ana Silva",
      location: "São Paulo, SP",
      bio: "Adoro passear pela cidade, conhecer lugares novos e conversar sobre literatura, cinema e arte.",
      avatar: "https://i.pravatar.cc/300?img=1",
      isVerified: true,
      averageRating: 4.9,
      reviewCount: 27,
      interests: ["Arte", "Literatura", "Café"],
      hourlyRate: 50
    },
    {
      id: 2,
      name: "Carlos Mendes",
      location: "Rio de Janeiro, RJ",
      bio: "Surfista, amante da natureza e de boa conversa. Conheço os melhores pontos do Rio e adoro conhecer pessoas novas.",
      avatar: "https://i.pravatar.cc/300?img=3",
      isVerified: true,
      averageRating: 4.7,
      reviewCount: 18,
      interests: ["Surf", "Praia", "Música"],
      hourlyRate: 60
    },
    {
      id: 3,
      name: "Juliana Costa",
      location: "Belo Horizonte, MG",
      bio: "Apaixonada por gastronomia e cultura local. Posso mostrar os melhores restaurantes e bares da cidade.",
      avatar: "https://i.pravatar.cc/300?img=5",
      isVerified: true,
      averageRating: 4.8,
      reviewCount: 22,
      interests: ["Gastronomia", "Vinhos", "História"],
      hourlyRate: 55
    }
  ];

  // Get favorites from API
  const { data: apiFavorites, isLoading, error } = useQuery({
    queryKey: ['/api/favorites'],
    queryFn: () => apiRequest("GET", "/api/favorites"),
    enabled: !!user // Only fetch if user is logged in
  });

  useEffect(() => {
    // In a real scenario, we would get the favorites from the API
    // For now, use sample data
    if (apiFavorites) {
      setFavorites(apiFavorites);
    } else {
      setFavorites(sampleFavorites);
    }
  }, [apiFavorites]);

  const removeFavorite = (id: number) => {
    // In a real scenario, we would call the API to remove the favorite
    setFavorites(prev => prev.filter(amigo => amigo.id !== id));
    
    toast({
      title: "Removido dos favoritos",
      description: "O amigo foi removido da sua lista de favoritos",
      variant: "default",
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header user={user} />
        
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Faça login para ver seus favoritos</h1>
            <p className="text-neutral-600 mb-8">
              Você precisa estar logado para acessar sua lista de amigos favoritos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setLocation("/login")}>
                Entrar
              </Button>
              <Button variant="outline" onClick={() => setLocation("/register")}>
                Criar conta
              </Button>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary via-primary to-blue-900 py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMzUpIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+')]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Seus Amigos Favoritos
            </h1>
            <p className="text-white/90 text-lg max-w-3xl">
              Aqui você encontra todos os amigos que você adicionou aos favoritos para facilitar futuras reservas.
            </p>
          </div>
        </div>
      </section>
      
      {/* Favorites List */}
      <section className="py-12 md:py-16 bg-white flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((amigo) => (
                <div key={amigo.id} className="relative group">
                  <button 
                    onClick={() => removeFavorite(amigo.id)} 
                    className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label="Remover dos favoritos"
                  >
                    <X className="h-4 w-4 text-neutral-700" />
                  </button>
                  <FriendCard
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
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center max-w-md mx-auto">
              <div className="mb-6 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Sua lista de favoritos está vazia</h2>
              <p className="text-neutral-600 mb-8">
                Você ainda não adicionou nenhum amigo aos seus favoritos. Explore nossa plataforma e adicione amigos para facilitar futuras reservas.
              </p>
              <Button onClick={() => setLocation("/search")}>
                Encontrar amigos
              </Button>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}