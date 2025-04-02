import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CalendarClock, User2, Star, ChevronRight, Calendar, MapPin, Clock, ArrowUpRight } from "lucide-react";

interface BookingsProps {
  user: any | null;
}

export default function Bookings({ user }: BookingsProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");

  // Mock sample data for bookings
  const sampleBookings = {
    upcoming: [
      {
        id: 1,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        time: "14:00",
        duration: 2,
        location: "Parque Ibirapuera, São Paulo",
        status: "confirmed",
        amigo: {
          id: 1,
          name: "Ana Silva",
          avatar: "https://i.pravatar.cc/300?img=1",
          rating: 4.9,
          hourlyRate: 50
        }
      },
      {
        id: 2,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        time: "19:30",
        duration: 3,
        location: "Restaurante Vila Madalena, São Paulo",
        status: "pending",
        amigo: {
          id: 2,
          name: "Carlos Mendes",
          avatar: "https://i.pravatar.cc/300?img=3",
          rating: 4.7,
          hourlyRate: 60
        }
      }
    ],
    past: [
      {
        id: 3,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        time: "10:00",
        duration: 4,
        location: "Praia de Copacabana, Rio de Janeiro",
        status: "completed",
        reviewed: true,
        amigo: {
          id: 2,
          name: "Carlos Mendes",
          avatar: "https://i.pravatar.cc/300?img=3",
          rating: 4.7,
          hourlyRate: 60
        }
      },
      {
        id: 4,
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        time: "16:00",
        duration: 2,
        location: "Mercado Central, Belo Horizonte",
        status: "completed",
        reviewed: false,
        amigo: {
          id: 3,
          name: "Juliana Costa",
          avatar: "https://i.pravatar.cc/300?img=5",
          rating: 4.8,
          hourlyRate: 55
        }
      }
    ],
    cancelled: [
      {
        id: 5,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        time: "20:00",
        duration: 3,
        location: "Teatro Municipal, São Paulo",
        status: "cancelled",
        cancelledBy: "user",
        amigo: {
          id: 4,
          name: "Rafael Souza",
          avatar: "https://i.pravatar.cc/300?img=8",
          rating: 4.6,
          hourlyRate: 65
        }
      }
    ]
  };

  // Get bookings from API
  const { data: apiBookings, isLoading, error } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: () => apiRequest("GET", "/api/bookings"),
    enabled: !!user // Only fetch if user is logged in
  });

  // Use API data if available, otherwise use sample data
  const bookings = apiBookings || sampleBookings;

  const cancelBooking = (bookingId: number) => {
    // In a real scenario, we would call the API to cancel the booking
    toast({
      title: "Reserva cancelada",
      description: "Sua reserva foi cancelada com sucesso",
      variant: "default",
    });
  };

  const reviewBooking = (bookingId: number) => {
    setLocation(`/review/${bookingId}`);
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header user={user} />
        
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CalendarClock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Faça login para ver suas reservas</h1>
            <p className="text-neutral-600 mb-8">
              Você precisa estar logado para acessar suas reservas e histórico de atividades.
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
              Suas Reservas
            </h1>
            <p className="text-white/90 text-lg max-w-3xl">
              Gerencie suas reservas passadas, atuais e futuras com amigos da plataforma.
            </p>
          </div>
        </div>
      </section>
      
      {/* Bookings Content */}
      <section className="py-12 md:py-16 bg-white flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs 
            defaultValue="upcoming" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-10">
              <TabsTrigger value="upcoming">Próximas</TabsTrigger>
              <TabsTrigger value="past">Passadas</TabsTrigger>
              <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : bookings.upcoming && bookings.upcoming.length > 0 ? (
                <div className="space-y-6">
                  {bookings.upcoming.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="md:col-span-1 bg-neutral-50 p-6 flex flex-col justify-between">
                          <div>
                            <div className="text-sm font-medium text-neutral-500 mb-1">
                              Data
                            </div>
                            <div className="text-lg font-bold">
                              {formatDate(booking.date)}
                            </div>
                            <div className="text-neutral-600 mt-1">
                              {booking.time} • {booking.duration} {booking.duration > 1 ? "horas" : "hora"}
                            </div>
                          </div>
                          
                          <div className={`mt-4 inline-flex items-center ${
                            booking.status === 'confirmed' ? 'text-green-600 bg-green-50' :
                            booking.status === 'pending' ? 'text-yellow-600 bg-yellow-50' :
                            'text-neutral-600 bg-neutral-100'
                          } px-2.5 py-1 rounded-full text-xs font-medium`}>
                            {booking.status === 'confirmed' ? 'Confirmado' :
                             booking.status === 'pending' ? 'Pendente' : 'Agendado'}
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div className="flex items-center">
                              <div className="relative">
                                <div className="w-14 h-14 rounded-full overflow-hidden">
                                  <img 
                                    src={booking.amigo.avatar} 
                                    alt={booking.amigo.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-bold">{booking.amigo.name}</h3>
                                <div className="flex items-center text-neutral-600">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                                  <span>{booking.amigo.rating}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-full"
                                onClick={() => setLocation(`/amigos/${booking.amigo.id}`)}
                              >
                                Ver perfil
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-full text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700"
                                onClick={() => cancelBooking(booking.id)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-neutral-500">Local</div>
                                <div className="text-neutral-800">{booking.location}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <Calendar className="h-5 w-5 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-neutral-500">Data</div>
                                <div className="text-neutral-800">{formatDate(booking.date)}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <Clock className="h-5 w-5 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-neutral-500">Horário</div>
                                <div className="text-neutral-800">{booking.time} - {booking.duration} {booking.duration > 1 ? "horas" : "hora"}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium text-neutral-500">Valor total</div>
                              <div className="text-xl font-bold">R$ {booking.amigo.hourlyRate * booking.duration}</div>
                            </div>
                            
                            <Button 
                              onClick={() => setLocation(`/booking-details/${booking.id}`)}
                              className="rounded-full"
                            >
                              Ver detalhes <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center max-w-md mx-auto">
                  <div className="mb-6 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <CalendarClock className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Nenhuma reserva futura</h2>
                  <p className="text-neutral-600 mb-8">
                    Você não possui reservas agendadas. Explore nossa plataforma e reserve um amigo para sua próxima atividade ou evento.
                  </p>
                  <Button onClick={() => setLocation("/search")}>
                    Encontrar amigos
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : bookings.past && bookings.past.length > 0 ? (
                <div className="space-y-6">
                  {bookings.past.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="md:col-span-1 bg-neutral-50 p-6 flex flex-col justify-between">
                          <div>
                            <div className="text-sm font-medium text-neutral-500 mb-1">
                              Data
                            </div>
                            <div className="text-lg font-bold">
                              {formatDate(booking.date)}
                            </div>
                            <div className="text-neutral-600 mt-1">
                              {booking.time} • {booking.duration} {booking.duration > 1 ? "horas" : "hora"}
                            </div>
                          </div>
                          
                          <div className="mt-4 inline-flex items-center text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium">
                            Concluído
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div className="flex items-center">
                              <div className="relative">
                                <div className="w-14 h-14 rounded-full overflow-hidden">
                                  <img 
                                    src={booking.amigo.avatar} 
                                    alt={booking.amigo.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-bold">{booking.amigo.name}</h3>
                                <div className="flex items-center text-neutral-600">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                                  <span>{booking.amigo.rating}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-full"
                                onClick={() => setLocation(`/amigos/${booking.amigo.id}`)}
                              >
                                Ver perfil
                              </Button>
                              {!booking.reviewed && (
                                <Button 
                                  size="sm" 
                                  className="rounded-full"
                                  onClick={() => reviewBooking(booking.id)}
                                >
                                  Avaliar
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-neutral-500">Local</div>
                                <div className="text-neutral-800">{booking.location}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <Calendar className="h-5 w-5 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-neutral-500">Data</div>
                                <div className="text-neutral-800">{formatDate(booking.date)}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <Clock className="h-5 w-5 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-neutral-500">Horário</div>
                                <div className="text-neutral-800">{booking.time} - {booking.duration} {booking.duration > 1 ? "horas" : "hora"}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium text-neutral-500">Valor pago</div>
                              <div className="text-xl font-bold">R$ {booking.amigo.hourlyRate * booking.duration}</div>
                            </div>
                            
                            <Button 
                              variant="outline"
                              onClick={() => setLocation(`/booking-details/${booking.id}`)}
                              className="rounded-full"
                            >
                              Ver detalhes <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center max-w-md mx-auto">
                  <div className="mb-6 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <CalendarClock className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Nenhuma reserva anterior</h2>
                  <p className="text-neutral-600 mb-8">
                    Você ainda não realizou nenhuma reserva. Explore nossa plataforma e reserve um amigo para sua próxima atividade ou evento.
                  </p>
                  <Button onClick={() => setLocation("/search")}>
                    Encontrar amigos
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="cancelled">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : bookings.cancelled && bookings.cancelled.length > 0 ? (
                <div className="space-y-6">
                  {bookings.cancelled.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="md:col-span-1 bg-neutral-50 p-6 flex flex-col justify-between">
                          <div>
                            <div className="text-sm font-medium text-neutral-500 mb-1">
                              Data
                            </div>
                            <div className="text-lg font-bold">
                              {formatDate(booking.date)}
                            </div>
                            <div className="text-neutral-600 mt-1">
                              {booking.time} • {booking.duration} {booking.duration > 1 ? "horas" : "hora"}
                            </div>
                          </div>
                          
                          <div className="mt-4 inline-flex items-center text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-medium">
                            Cancelado
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <div className="flex items-center">
                              <div className="relative">
                                <div className="w-14 h-14 rounded-full overflow-hidden">
                                  <img 
                                    src={booking.amigo.avatar} 
                                    alt={booking.amigo.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-bold">{booking.amigo.name}</h3>
                                <div className="flex items-center text-neutral-600">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                                  <span>{booking.amigo.rating}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-full"
                                onClick={() => setLocation(`/amigos/${booking.amigo.id}`)}
                              >
                                Ver perfil
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-neutral-500">Local</div>
                                <div className="text-neutral-800">{booking.location}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <Calendar className="h-5 w-5 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-neutral-500">Data</div>
                                <div className="text-neutral-800">{formatDate(booking.date)}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <Clock className="h-5 w-5 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-neutral-500">Horário</div>
                                <div className="text-neutral-800">{booking.time} - {booking.duration} {booking.duration > 1 ? "horas" : "hora"}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <User2 className="h-5 w-5 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-neutral-500">Cancelado por</div>
                                <div className="text-neutral-800">
                                  {booking.cancelledBy === 'user' ? 'Você' : 'Amigo'}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium text-neutral-500">Valor (não cobrado)</div>
                              <div className="text-xl font-bold">R$ {booking.amigo.hourlyRate * booking.duration}</div>
                            </div>
                            
                            <Button 
                              variant="outline"
                              className="rounded-full"
                              onClick={() => setLocation(`/search`)}
                            >
                              Reservar novamente <ArrowUpRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center max-w-md mx-auto">
                  <div className="mb-6 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <CalendarClock className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Nenhuma reserva cancelada</h2>
                  <p className="text-neutral-600 mb-8">
                    Você não possui reservas canceladas. Continue aproveitando nossos serviços!
                  </p>
                  <Button onClick={() => setActiveTab("upcoming")}>
                    Ver reservas ativas
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}