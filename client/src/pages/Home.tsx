import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Check, 
  Edit, 
  Search,
  Plane,
  Briefcase,
  Mountain,
  Utensils,
  Trophy,
  Laptop,
  Dumbbell,
  Trees,
  Users,
  Wine,
  Mic,
  Beer,
  MessageCircle,
  Phone,
  Camera,
  Building,
  GraduationCap,
  ShoppingCart,
  Music2,
  Heart,
  Ship,
  Car,
  Snowflake,
  PartyPopper,
  Footprints,
  Library,
  UtensilsCrossed,
  Gamepad2,
  Bike,
  Waves,
  Wrench,
  Sparkles,
  BookOpen,
  Users2,
  PenLine,
  MapPin
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchForm from "@/components/search/SearchForm";
import FriendCard from "@/components/friend/FriendCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HomeProps {
  user?: any | null;
}

export default function Home({ user }: HomeProps) {
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
  }

  const { data: amigos = [], isLoading } = useQuery<Amigo[]>({
    queryKey: ['/api/amigos'],
    staleTime: 60000, // 1 minute
  });

  // Show only the first 4 friends on the homepage
  const featuredAmigos = amigos.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-14 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMzUpIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+')]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <div className="inline-block mb-6 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white font-medium text-sm">
              A forma mais fácil de encontrar companhia para qualquer momento
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Encontre o <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">amigo perfeito</span> para qualquer ocasião
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Companhia para eventos, shows, jantares, viagens ou apenas para conversar.
              Milhares de amigos verificados prontos para tornar seu dia especial.
            </p>
          </div>

          {/* Search Form */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-sky-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
            <SearchForm />
          </div>
          
          <div className="mt-10 flex justify-center space-x-6">
            <div className="flex items-center text-white">
              <Check className="h-5 w-5 mr-2 text-cyan-300" />
              <span>Amigos verificados</span>
            </div>
            <div className="flex items-center text-white">
              <Check className="h-5 w-5 mr-2 text-cyan-300" />
              <span>Pagamento seguro</span>
            </div>
            <div className="flex items-center text-white">
              <Check className="h-5 w-5 mr-2 text-cyan-300" />
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Friends Section */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-neutral-50/80 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <span className="text-primary font-medium text-sm mb-2 block">Amigos em Destaque</span>
              <h2 className="text-2xl md:text-4xl font-heading font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent mb-2">
                Conheça nossos amigos melhor avaliados
              </h2>
              <p className="text-neutral-600 text-lg max-w-2xl">Companhia para qualquer momento, com interesses variados e experiências enriquecedoras</p>
            </div>
            
            <Link href="/search">
              <Button variant="outline" className="mt-4 md:mt-0 border-primary text-primary hover:bg-primary/5 rounded-full px-6 font-medium">
                Ver todos os amigos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full">
                  <div className="relative">
                    <div className="w-full h-56 bg-gray-100 animate-pulse" />
                    <div className="absolute top-3 right-3">
                      <div className="w-14 h-6 bg-gray-100 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-8 bg-gray-100 rounded animate-pulse mb-2 w-3/4" />
                      <div className="h-6 w-20 bg-gray-100 rounded-md animate-pulse" />
                    </div>
                    <div className="h-5 bg-gray-100 rounded animate-pulse mb-4 w-2/3" />
                    <div className="h-14 bg-gray-100 rounded animate-pulse mb-4" />
                    <div className="flex gap-2 mb-5">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-7 bg-gray-100 rounded-full animate-pulse w-16" />
                      ))}
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                      <div className="h-6 bg-gray-100 rounded animate-pulse w-24" />
                      <div className="h-10 bg-gray-100 rounded-lg animate-pulse w-28" />
                    </div>
                  </div>
                </div>
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
          
          <div className="flex justify-center mt-12 md:mt-16">
            <Link href="/search">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 shadow-sm hover:shadow rounded-full py-2.5 px-8 text-base font-medium transition-all duration-300">
                Ver mais amigos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Activities Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
              As pessoas estão usando Rent A Friend.com para todos os tipos de atividades
            </h2>
            <p className="text-neutral-700 text-lg leading-relaxed mb-6">
              As pessoas estão contratando amigos platônicos para todos os tipos de atividades excelentes. Abaixo estão 
              apenas algumas das muitas maneiras pelas quais as pessoas estão aproveitando o RentAFriend.
            </p>
            <p className="text-neutral-700 mb-8">
              Visite nossa página de <Link href="/atividades" className="text-primary font-medium hover:underline">atividades</Link> para ler mais.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            <ActivityItem icon={<Plane size={16} />} label="Viagem" />
            <ActivityItem icon={<Briefcase size={16} />} label="Eventos Empresariais" />
            <ActivityItem icon={<Mountain size={16} />} label="Eventos ao ar livre" />
            <ActivityItem icon={<Utensils size={16} />} label="Assar/Cozinhar" />
            <ActivityItem icon={<Trophy size={16} />} label="Eventos esportivos" />
            <ActivityItem icon={<Snowflake size={16} />} label="Snowboard" />
            <ActivityItem icon={<Laptop size={16} />} label="Amigos virtuais" />
            <ActivityItem icon={<Dumbbell size={16} />} label="Praticando esportes" />
            <ActivityItem icon={<Trees size={16} />} label="Indo para o parque" />
            <ActivityItem icon={<Users size={16} />} label="Conheça amigos" />
            <ActivityItem icon={<Wine size={16} />} label="Degustação de vinhos" />
            <ActivityItem icon={<Mic size={16} />} label="Clube de Comédia" />
            <ActivityItem icon={<Beer size={16} />} label="Indo para o bar" />
            <ActivityItem icon={<MessageCircle size={16} />} label="Saindo" />
            <ActivityItem icon={<Phone size={16} />} label="Amigo do telefone" />
            <ActivityItem icon={<Camera size={16} />} label="Fotografia" />
            <ActivityItem icon={<Building size={16} />} label="Dando passeios" />
            <ActivityItem icon={<MapPin size={16} />} label="Passeio turístico" />
            <ActivityItem icon={<Heart size={16} />} label="Datas de baile" />
            <ActivityItem icon={<Building size={16} />} label="Casamentos" />
            <ActivityItem icon={<Library size={16} />} label="Museus" />
            <ActivityItem icon={<BookOpen size={16} />} label="Religioso" />
            <ActivityItem icon={<ShoppingCart size={16} />} label="Compras" />
            <ActivityItem icon={<GraduationCap size={16} />} label="Tutoria" />
            <ActivityItem icon={<Ship size={16} />} label="Boate" />
            <ActivityItem icon={<Car size={16} />} label="Boliche" />
            <ActivityItem icon={<Utensils size={16} />} label="Jantar" />
            <ActivityItem icon={<Gamepad2 size={16} />} label="Arcada" />
            <ActivityItem icon={<Bike size={16} />} label="Ciclismo" />
            <ActivityItem icon={<Waves size={16} />} label="Praia" />
            <ActivityItem icon={<Snowflake size={16} />} label="Esquiar" />
            <ActivityItem icon={<PartyPopper size={16} />} label="Festas" />
            <ActivityItem icon={<Footprints size={16} />} label="Caminhada" />
            <ActivityItem icon={<Music2 size={16} />} label="Música" />
            <ActivityItem icon={<Wrench size={16} />} label="Projetos DIY" />
            <ActivityItem icon={<Sparkles size={16} />} label="Funções" />
            <ActivityItem icon={<PenLine size={16} />} label="Treinos" />
            <ActivityItem icon={<Sparkles size={16} />} label="Atenção plena" />
            <ActivityItem icon={<BookOpen size={16} />} label="Cultura" />
            <ActivityItem icon={<Users2 size={16} />} label="Apresentações" />
            <ActivityItem icon={<Sparkles size={16} />} label="Ala" />
            <ActivityItem icon={<Mountain size={16} />} label="Parques" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-neutral-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full transform translate-x-32 -translate-y-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/5 rounded-full transform -translate-x-32 translate-y-32 blur-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-primary/10 text-primary font-medium text-sm px-4 py-1.5 rounded-full mb-4">
              É muito simples começar
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Como o RentAFriend funciona
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
              Simples e seguro, encontre a companhia perfeita em apenas três passos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 hidden md:block"></div>
            
            <div className="relative text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/20 group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                <div className="absolute inset-0 bg-primary opacity-0 rounded-full group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <Search size={24} />
                </div>
              </div>
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-primary/20 shadow-sm text-primary font-bold flex items-center justify-center z-10">
                1
              </div>
              <h3 className="text-xl font-heading font-bold text-neutral-800 mb-3">Busque</h3>
              <p className="text-neutral-600">Pesquise amigos por localização, interesses e disponibilidade para encontrar a combinação perfeita.</p>
            </div>

            <div className="relative text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/20 group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                <div className="absolute inset-0 bg-primary opacity-0 rounded-full group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <Check size={24} />
                </div>
              </div>
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-primary/20 shadow-sm text-primary font-bold flex items-center justify-center z-10">
                2
              </div>
              <h3 className="text-xl font-heading font-bold text-neutral-800 mb-3">Reserve</h3>
              <p className="text-neutral-600">Escolha o amigo, defina a data, hora e local do encontro, e faça sua reserva com segurança.</p>
            </div>

            <div className="relative text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/20 group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                <div className="absolute inset-0 bg-primary opacity-0 rounded-full group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <Edit size={24} />
                </div>
              </div>
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-primary/20 shadow-sm text-primary font-bold flex items-center justify-center z-10">
                3
              </div>
              <h3 className="text-xl font-heading font-bold text-neutral-800 mb-3">Avalie</h3>
              <p className="text-neutral-600">Após a experiência, deixe sua avaliação para ajudar a comunidade e melhorar o serviço.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 to-white relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjUiIGN5PSI1IiByPSIxIiBmaWxsPSJyZ2JhKDAsIDAsIDAsIDAuMDIpIi8+PC9nPjwvc3ZnPg==')]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-block text-primary font-medium text-sm px-4 py-1.5 rounded-full bg-primary/10 mb-4">
              Depoimentos verificados
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              O que nossos usuários dizem
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
              Experiências reais de pessoas que usaram o RentAFriend
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/10 relative group">
              <div className="absolute -top-5 left-10 w-10 h-10 rounded-full bg-primary/10 hidden md:block"></div>
              <div className="absolute -bottom-5 right-10 w-8 h-8 rounded-full bg-primary/5 hidden md:block"></div>
              <div className="absolute top-6 right-8 text-primary opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.13456 9C9.22749 7.1195 8.32805 5.03507 6.44022 3.64568C6.1592 3.44446 6.35119 3 6.70356 3H10.5237C13.5383 3 15.0399 5.64568 14.9423 9C14.8448 12.3543 13.0091 15 9.99451 15C7.95249 15 6.58006 13.4774 6.58006 11.5021C6.58006 10.1487 7.56253 9 9.13456 9Z" fill="currentColor"/>
                  <path d="M18.2873 9C18.3802 7.1195 17.4808 5.03507 15.5929 3.64568C15.3119 3.44446 15.5039 3 15.8563 3H19.6764C22.691 3 24.1926 5.64568 24.095 9C23.9975 12.3543 22.1618 15 19.1472 15C17.1052 15 15.7328 13.4774 15.7328 11.5021C15.7328 10.1487 16.7153 9 18.2873 9Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex items-center mb-6">
                <div className="flex text-[#FFB400]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill="currentColor" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-neutral-600">5.0</span>
              </div>
              <p className="text-neutral-700 mb-8 text-lg font-light italic leading-relaxed">"Precisava de companhia para um evento corporativo e encontrei o Carlos que conhecia muito sobre tecnologia. Foi uma excelente escolha!"</p>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mr-4 text-primary font-semibold border-2 border-white shadow-sm">
                  <span>RM</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 text-lg">Ricardo Martins</h4>
                  <p className="text-neutral-500 text-sm">São Paulo, SP</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/10 relative group">
              <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-primary/10 hidden md:block"></div>
              <div className="absolute -bottom-4 right-8 w-6 h-6 rounded-full bg-primary/5 hidden md:block"></div>
              <div className="absolute top-6 right-8 text-primary opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.13456 9C9.22749 7.1195 8.32805 5.03507 6.44022 3.64568C6.1592 3.44446 6.35119 3 6.70356 3H10.5237C13.5383 3 15.0399 5.64568 14.9423 9C14.8448 12.3543 13.0091 15 9.99451 15C7.95249 15 6.58006 13.4774 6.58006 11.5021C6.58006 10.1487 7.56253 9 9.13456 9Z" fill="currentColor"/>
                  <path d="M18.2873 9C18.3802 7.1195 17.4808 5.03507 15.5929 3.64568C15.3119 3.44446 15.5039 3 15.8563 3H19.6764C22.691 3 24.1926 5.64568 24.095 9C23.9975 12.3543 22.1618 15 19.1472 15C17.1052 15 15.7328 13.4774 15.7328 11.5021C15.7328 10.1487 16.7153 9 18.2873 9Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex items-center mb-6">
                <div className="flex text-[#FFB400]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill="currentColor" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-neutral-600">5.0</span>
              </div>
              <p className="text-neutral-700 mb-8 text-lg font-light italic leading-relaxed">"A Ana foi incrível! Estava na cidade a trabalho e ela me mostrou os melhores lugares. Conhecimento sobre música e arte impressionantes."</p>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mr-4 text-primary font-semibold border-2 border-white shadow-sm">
                  <span>JS</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 text-lg">Julia Santos</h4>
                  <p className="text-neutral-500 text-sm">Rio de Janeiro, RJ</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/10 relative group">
              <div className="absolute -top-5 left-10 w-6 h-6 rounded-full bg-primary/10 hidden md:block"></div>
              <div className="absolute -bottom-3 right-12 w-8 h-8 rounded-full bg-primary/5 hidden md:block"></div>
              <div className="absolute top-6 right-8 text-primary opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.13456 9C9.22749 7.1195 8.32805 5.03507 6.44022 3.64568C6.1592 3.44446 6.35119 3 6.70356 3H10.5237C13.5383 3 15.0399 5.64568 14.9423 9C14.8448 12.3543 13.0091 15 9.99451 15C7.95249 15 6.58006 13.4774 6.58006 11.5021C6.58006 10.1487 7.56253 9 9.13456 9Z" fill="currentColor"/>
                  <path d="M18.2873 9C18.3802 7.1195 17.4808 5.03507 15.5929 3.64568C15.3119 3.44446 15.5039 3 15.8563 3H19.6764C22.691 3 24.1926 5.64568 24.095 9C23.9975 12.3543 22.1618 15 19.1472 15C17.1052 15 15.7328 13.4774 15.7328 11.5021C15.7328 10.1487 16.7153 9 18.2873 9Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex items-center mb-6">
                <div className="flex text-[#FFB400]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill="currentColor" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-neutral-600">5.0</span>
              </div>
              <p className="text-neutral-700 mb-8 text-lg font-light italic leading-relaxed">"Como recém-chegado em São Paulo, o Rafael me ajudou a entender melhor a cidade e a cultura local. Hoje somos bons amigos!"</p>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mr-4 text-primary font-semibold border-2 border-white shadow-sm">
                  <span>LF</span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 text-lg">Lucas Ferreira</h4>
                  <p className="text-neutral-500 text-sm">Brasília, DF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-primary via-primary to-blue-700 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full transform translate-x-32 -translate-y-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full transform -translate-x-32 translate-y-32 blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMzUpIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+')]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm text-white font-medium text-sm px-4 py-1.5 rounded-full mb-6">
              Comece sua jornada hoje
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Pronto para encontrar seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-300">amigo perfeito</span>?
            </h2>
            <p className="text-white text-lg md:text-xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Cadastre-se hoje e tenha acesso a centenas de amigos verificados para qualquer ocasião.
              Eventos sociais, tours pela cidade ou apenas para conversar.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-5 sm:space-y-0 sm:space-x-6">
              <Link href="/search">
                <Button className="bg-white text-primary-600 hover:bg-yellow-50 font-semibold text-lg py-5 px-10 rounded-lg transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Buscar Amigos
                </Button>
              </Link>
              <Link href="/become-amigo">
                <Button variant="outline" className="bg-transparent text-white border-2 border-white hover:bg-white/10 backdrop-blur-sm font-semibold text-lg py-5 px-10 rounded-lg transition-all duration-300 w-full sm:w-auto shadow-md hover:shadow-lg">
                  Tornar-se um Amigo
                </Button>
              </Link>
            </div>
            
            <div className="mt-14 flex justify-center items-center space-x-8">
              <div className="flex items-center text-white">
                <Check className="h-5 w-5 mr-2 text-yellow-300" />
                <span>Rápido e fácil</span>
              </div>
              <div className="flex items-center text-white">
                <Check className="h-5 w-5 mr-2 text-yellow-300" />
                <span>100% seguro</span>
              </div>
              <div className="flex items-center text-white">
                <Check className="h-5 w-5 mr-2 text-yellow-300" />
                <span>Cancelamento flexível</span>
              </div>
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

// Activity item component
interface ActivityItemProps {
  icon: React.ReactNode;
  label: string;
}

function ActivityItem({ icon, label }: ActivityItemProps) {
  return (
    <div className="flex flex-col items-center space-y-2 hover:transform hover:scale-105 transition-all duration-300 p-2 rounded-lg hover:bg-primary/5">
      <div className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary">
        {icon}
      </div>
      <span className="text-xs text-center text-neutral-600 font-medium">{label}</span>
    </div>
  );
}
