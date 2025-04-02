import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Check, Edit, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchForm from "@/components/search/SearchForm";
import FriendCard from "@/components/friend/FriendCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { data: amigos = [], isLoading } = useQuery({
    queryKey: ['/api/amigos'],
    staleTime: 60000, // 1 minute
  });

  // Show only the first 4 friends on the homepage
  const featuredAmigos = amigos.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
              Encontre o amigo perfeito para qualquer ocasião
            </h1>
            <p className="text-white text-lg md:text-xl opacity-90">
              Companhia para eventos, shows, jantares ou apenas para conversar
            </p>
          </div>

          {/* Search Form */}
          <SearchForm />
        </div>
      </section>
      
      {/* Featured Friends Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900">Amigos em destaque</h2>
              <p className="text-neutral-600 mt-1">Conheça alguns dos nossos amigos melhor avaliados</p>
            </div>
            
            <Link href="/search">
              <Button variant="outline" className="mt-4 md:mt-0">
                Ver todos os amigos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-56 bg-gray-200 animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-1/2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-full" />
                    <div className="flex gap-2 mb-4">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredAmigos.map((amigo) => (
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
          )}
          
          <div className="flex justify-center mt-12">
            <Link href="/search">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary-50">
                Ver mais amigos
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900 mb-3">Como o RentAFriend funciona</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">Simples e seguro, encontre a companhia perfeita em três passos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-neutral-800 mb-2">Busque</h3>
              <p className="text-neutral-600">Pesquise amigos por localização, interesses e disponibilidade para encontrar a combinação perfeita.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-neutral-800 mb-2">Reserve</h3>
              <p className="text-neutral-600">Escolha o amigo, defina a data, hora e local do encontro, e faça sua reserva com segurança.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-neutral-800 mb-2">Avalie</h3>
              <p className="text-neutral-600">Após a experiência, deixe sua avaliação para ajudar a comunidade e melhorar o serviço.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900 mb-3">O que nossos usuários dizem</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">Experiências reais de pessoas que usaram o RentAFriend</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-neutral-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-[#FFB400]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5" fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-neutral-700 mb-4">"Precisava de companhia para um evento corporativo e encontrei o Carlos que conhecia muito sobre tecnologia. Foi uma excelente escolha!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                  <span className="text-neutral-700 font-medium text-sm">RM</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800">Ricardo Martins</h4>
                  <p className="text-neutral-500 text-sm">São Paulo, SP</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-[#FFB400]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5" fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-neutral-700 mb-4">"A Ana foi incrível! Estava na cidade a trabalho e ela me mostrou os melhores lugares. Conhecimento sobre música e arte impressionantes."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                  <span className="text-neutral-700 font-medium text-sm">JS</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800">Julia Santos</h4>
                  <p className="text-neutral-500 text-sm">Rio de Janeiro, RJ</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-[#FFB400]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5" fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-neutral-700 mb-4">"Como recém-chegado em São Paulo, o Rafael me ajudou a entender melhor a cidade e a cultura local. Hoje somos bons amigos!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                  <span className="text-neutral-700 font-medium text-sm">LF</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800">Lucas Ferreira</h4>
                  <p className="text-neutral-500 text-sm">Brasília, DF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-4">
              Pronto para encontrar seu amigo perfeito?
            </h2>
            <p className="text-white text-lg opacity-90 mb-8">
              Cadastre-se hoje e tenha acesso a centenas de amigos verificados para qualquer ocasião.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/search">
                <Button className="bg-white text-primary-600 hover:bg-neutral-100 font-medium py-3 px-8 rounded-md transition w-full sm:w-auto">
                  Buscar Amigos
                </Button>
              </Link>
              <Link href="/become-amigo">
                <Button variant="outline" className="bg-transparent text-white border border-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-md transition w-full sm:w-auto">
                  Tornar-se um Amigo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

// Star component for testimonials
function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
