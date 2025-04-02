import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Star, 
  Clock, 
  Calendar as CalendarIcon,
  Heart,
  Check,
  Phone,
  Mail,
  ArrowLeft
} from "lucide-react";

export default function FriendDetail() {
  const [location, setLocation] = useLocation();
  const amigoId = location.split("/").pop();
  
  const { data: amigo, isLoading } = useQuery({
    queryKey: [`/api/amigos/${amigoId}`],
    staleTime: 60000, // 1 minute
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-600">Carregando informações do amigo...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!amigo) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 flex-grow">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Amigo não encontrado</h2>
            <p className="text-neutral-600 mb-8">O amigo que você está procurando não existe ou foi removido.</p>
            <Link href="/search">
              <Button>Voltar para busca</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };
  
  const handleBookNow = () => {
    if (!selectedDate || !selectedTimeSlot) return;
    
    const bookingData = {
      amigoId: amigo.id,
      date: format(selectedDate, "yyyy-MM-dd"),
      timeSlot: selectedTimeSlot
    };
    
    // Store booking data in localStorage for the next step
    localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
    
    setLocation(`/booking/${amigo.id}?date=${format(selectedDate, "yyyy-MM-dd")}&time=${selectedTimeSlot}`);
  };
  
  // Generate available time slots for the selected date (this would come from the API in a real app)
  const generateTimeSlots = () => {
    // This is simplified for demo purposes
    return [
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00"
    ];
  };
  
  const timeSlots = generateTimeSlots();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0" 
          onClick={() => setLocation("/search")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para resultados
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Friend info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden shadow-md mb-8">
              <div className="relative h-64 md:h-80">
                <img 
                  src={amigo.avatar} 
                  alt={`Foto de perfil de ${amigo.name}`} 
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white text-primary hover:text-primary-600 rounded-full h-10 w-10"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                {amigo.isVerified && (
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="verified" className="px-3 py-1.5 flex items-center gap-1.5">
                      <Check className="h-4 w-4" />
                      Perfil verificado
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-heading font-bold text-neutral-800 mb-1">
                      {amigo.name}
                    </h1>
                    <div className="flex items-center text-sm text-neutral-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {amigo.location}
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-2 md:mt-0">
                    <div className="flex text-[#FFB400]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5"
                          fill={i < Math.round(amigo.averageRating) ? "currentColor" : "none"}
                          strokeWidth={i < Math.round(amigo.averageRating) ? "0" : "1.5"}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-neutral-600 font-medium">
                      {amigo.averageRating.toFixed(1)}
                    </span>
                    <span className="ml-1 text-neutral-500">
                      ({amigo.reviewCount} {amigo.reviewCount === 1 ? "avaliação" : "avaliações"})
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Sobre</h2>
                  <p className="text-neutral-700">{amigo.bio}</p>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Interesses</h2>
                  <div className="flex flex-wrap gap-2">
                    {amigo.interests.map((interest) => (
                      <Badge key={interest} variant="interest" className="px-3 py-1 rounded-full">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Preço</h2>
                  <p className="flex items-center text-xl">
                    <span className="font-bold text-neutral-800">R$ {amigo.hourlyRate}</span>
                    <span className="text-neutral-600 ml-1">/ hora</span>
                  </p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="reviews">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                <TabsTrigger value="details">Detalhes e Políticas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    {amigo.reviews?.length > 0 ? (
                      <div className="space-y-6">
                        {amigo.reviews.map((review) => (
                          <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-0 last:pb-0">
                            <div className="flex items-start">
                              <Avatar className="h-10 w-10 mr-4">
                                <AvatarFallback>
                                  {review.reviewerId.toString().substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                  <h3 className="font-medium">Cliente</h3>
                                  <span className="text-sm text-neutral-500">
                                    {new Date(review.createdAt).toLocaleDateString(
                                      'pt-BR', 
                                      { year: 'numeric', month: 'short', day: 'numeric' }
                                    )}
                                  </span>
                                </div>
                                <div className="flex text-[#FFB400] mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4"
                                      fill={i < review.rating ? "currentColor" : "none"}
                                      strokeWidth={i < review.rating ? "0" : "1.5"}
                                    />
                                  ))}
                                </div>
                                <p className="text-neutral-700">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <h3 className="text-lg font-medium mb-2">Nenhuma avaliação ainda</h3>
                        <p className="text-neutral-600">Este amigo ainda não recebeu avaliações.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Informações de Contato</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 mr-2 text-neutral-500" />
                            <span>Disponível após a confirmação da reserva</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 mr-2 text-neutral-500" />
                            <span>Disponível após a confirmação da reserva</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Políticas de Cancelamento</h3>
                        <p className="text-neutral-700">Cancelamentos com até 24 horas de antecedência recebem reembolso de 100%. Cancelamentos com menos de 24 horas de antecedência não são reembolsáveis.</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Política de Pagamento</h3>
                        <p className="text-neutral-700">O pagamento é processado 48 horas antes do evento. Aceitamos cartões de crédito, débito e PIX.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column - Booking widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Reservar</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Selecione uma data
                </h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  className="rounded border"
                  disabled={{ before: new Date() }}
                />
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Selecione um horário
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTimeSlot === slot ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTimeSlotSelect(slot)}
                      className="text-sm"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-neutral-200 pt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-700">R$ {amigo.hourlyRate} x 1 hora</span>
                  <span className="text-neutral-800 font-medium">R$ {amigo.hourlyRate}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-700">Taxa de serviço</span>
                  <span className="text-neutral-800 font-medium">R$ {Math.round(amigo.hourlyRate * 0.1)}</span>
                </div>
                <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t border-neutral-200 mt-2">
                  <span>Total</span>
                  <span>R$ {amigo.hourlyRate + Math.round(amigo.hourlyRate * 0.1)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full"
                disabled={!selectedDate || !selectedTimeSlot}
                onClick={handleBookNow}
              >
                Reservar agora
              </Button>
              
              <p className="text-center text-xs text-neutral-500 mt-4">
                Você não será cobrado ainda. O pagamento será processado 48 horas antes do evento.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
