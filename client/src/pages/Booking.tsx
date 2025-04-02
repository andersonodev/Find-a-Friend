import { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, Calendar, Clock, ArrowLeft, Check } from "lucide-react";
import { insertBookingSchema } from "@shared/schema";

interface BookingProps {
  user: any | null;
}

const bookingFormSchema = insertBookingSchema.pick({
  clientId: true,
  amigoId: true,
  date: true,
  startTime: true,
  endTime: true,
  location: true,
  totalAmount: true,
}).extend({
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function Booking({ user }: BookingProps) {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(window.location.search);
  const selectedDate = searchParams.get("date");
  const selectedTime = searchParams.get("time");
  
  // Parse the time slot
  const [startTime, endTime] = selectedTime ? selectedTime.split(" - ") : ["", ""];
  
  const { data: amigo, isLoading: isAmigoLoading } = useQuery({
    queryKey: [`/api/amigos/${id}`],
  });
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      clientId: user?.uid ? parseInt(user.uid) : 0,
      amigoId: parseInt(id || "0"),
      date: selectedDate ? new Date(selectedDate) : new Date(),
      startTime: selectedDate && startTime ? new Date(`${selectedDate}T${startTime}`) : new Date(),
      endTime: selectedDate && endTime ? new Date(`${selectedDate}T${endTime}`) : new Date(),
      location: "",
      totalAmount: 0,
      specialRequests: "",
    },
  });
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para fazer uma reserva.",
        variant: "destructive",
      });
      navigate("/login?redirect=/amigos/" + id);
    }
    
    if (amigo) {
      const hourlyRate = amigo.hourlyRate || 0;
      const serviceFee = Math.round(hourlyRate * 0.1);
      const totalAmount = hourlyRate + serviceFee;
      
      form.setValue("totalAmount", totalAmount);
    }
  }, [user, amigo, id, navigate, toast, form]);
  
  const onSubmit = async (data: BookingFormValues) => {
    try {
      // Format the data as needed by the API
      const bookingData = {
        ...data,
        status: "pending",
        paymentStatus: "pending",
      };
      
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      const booking = await response.json();
      
      toast({
        title: "Reserva criada com sucesso!",
        description: "Prossiga para o pagamento para confirmar sua reserva.",
      });
      
      navigate(`/checkout/${booking.id}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Erro ao criar reserva",
        description: "Ocorreu um erro ao processar sua reserva. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  if (isAmigoLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header user={user} />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!amigo) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header user={user} />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Amigo não encontrado</h2>
            <p className="text-gray-600 mb-6">O amigo que você está buscando não foi encontrado. Por favor, tente novamente.</p>
            <Link href="/search">
              <Button>Voltar para busca</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const formattedDate = selectedDate 
    ? format(new Date(selectedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "";
  
  const serviceFee = Math.round(amigo.hourlyRate * 0.1);
  const totalAmount = amigo.hourlyRate + serviceFee;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0" 
          onClick={() => navigate(`/amigos/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para perfil do amigo
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-6">Finalizar reserva</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Detalhes da reserva</h2>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 mt-0.5 mr-3 text-neutral-500" />
                            <div>
                              <h3 className="font-medium">Data</h3>
                              <p className="text-neutral-600">{formattedDate}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Clock className="h-5 w-5 mt-0.5 mr-3 text-neutral-500" />
                            <div>
                              <h3 className="font-medium">Horário</h3>
                              <p className="text-neutral-600">{selectedTime || "Horário não selecionado"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Local do encontro</h2>
                        
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Local</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="Digite o endereço ou nome do estabelecimento"
                                    {...field}
                                    className="pl-10"
                                  />
                                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Informações adicionais</h2>
                        
                        <FormField
                          control={form.control}
                          name="specialRequests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pedidos especiais ou informações adicionais</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Ex: Gostaria de ir a um restaurante específico, tenho restrições alimentares, etc."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" className="w-full md:w-auto">
                          Prosseguir para pagamento
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Resumo da reserva</h2>
                  
                  <div className="flex items-center mb-4">
                    <img 
                      src={amigo.avatar} 
                      alt={amigo.name} 
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h3 className="font-medium">{amigo.name}</h3>
                      <p className="text-sm text-neutral-600">{amigo.location}</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">R$ {amigo.hourlyRate} x 1 hora</span>
                      <span>R$ {amigo.hourlyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Taxa de serviço</span>
                      <span>R$ {serviceFee}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {totalAmount}</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-neutral-50 p-4 text-xs text-neutral-600">
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p>O pagamento será processado apenas após a confirmação da reserva pelo amigo.</p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
