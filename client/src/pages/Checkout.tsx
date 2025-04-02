import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useStripe, Elements, PaymentElement, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface CheckoutProps {
  user: any | null;
}

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ bookingId }: { bookingId: string }) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/bookings",
      },
    });

    if (error) {
      setMessage(error.message || "An error occurred during payment.");
      toast({
        title: "Falha no pagamento",
        description: error.message || "Um erro ocorreu durante o processamento do pagamento.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Pagamento realizado com sucesso",
        description: "Sua reserva foi confirmada!",
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {message && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}
      
      <Button 
        disabled={isProcessing || !stripe || !elements} 
        className="w-full"
        type="submit"
      >
        {isProcessing ? "Processando..." : "Confirmar pagamento"}
      </Button>
      
      <p className="text-center text-sm text-neutral-600">
        O valor total será cobrado apenas 48 horas antes da data do evento.
      </p>
    </form>
  );
}

export default function Checkout({ user }: CheckoutProps) {
  const [, navigate] = useLocation();
  const { id: bookingId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");

  const { data: booking, isLoading: isBookingLoading } = useQuery({
    queryKey: [`/api/bookings/${bookingId}`],
    enabled: !!bookingId,
  });

  const { data: amigo, isLoading: isAmigoLoading } = useQuery({
    queryKey: booking ? [`/api/amigos/${booking.amigoId}`] : null,
    enabled: !!booking,
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para finalizar o pagamento.",
        variant: "destructive",
      });
      navigate("/login?redirect=/checkout/" + bookingId);
      return;
    }

    if (booking) {
      // Create PaymentIntent as soon as the page loads
      apiRequest("POST", "/api/create-payment-intent", { bookingId })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          toast({
            title: "Erro ao processar pagamento",
            description: "Não foi possível iniciar o processo de pagamento. Tente novamente mais tarde.",
            variant: "destructive",
          });
          console.error("Error creating payment intent:", error);
        });
    }
  }, [booking, bookingId, navigate, toast, user]);

  if (isBookingLoading || isAmigoLoading) {
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

  if (!booking || !amigo) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header user={user} />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Reserva não encontrada</h2>
            <p className="text-neutral-600 mb-6">A reserva que você está buscando não foi encontrada. Por favor, tente novamente.</p>
            <Button onClick={() => navigate("/search")}>Voltar para busca</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const bookingDate = booking.date ? new Date(booking.date) : null;
  const formattedDate = bookingDate 
    ? format(bookingDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "Data não disponível";

  const startTime = booking.startTime ? new Date(booking.startTime) : null;
  const endTime = booking.endTime ? new Date(booking.endTime) : null;
  const formattedTimeSlot = startTime && endTime
    ? `${format(startTime, "HH:mm")} - ${format(endTime, "HH:mm")}`
    : "Horário não disponível";

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-6">Pagamento da reserva</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Dados de pagamento</h2>
                  
                  {clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm bookingId={bookingId} />
                    </Elements>
                  ) : (
                    <div className="flex items-center justify-center p-6">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span>Carregando opções de pagamento...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
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
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Data</span>
                      <span className="font-medium">{formattedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Horário</span>
                      <span className="font-medium">{formattedTimeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Local</span>
                      <span className="font-medium">{booking.location}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Valor por hora</span>
                      <span>R$ {amigo.hourlyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Taxa de serviço</span>
                      <span>R$ {Math.round(amigo.hourlyRate * 0.1)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {booking.totalAmount}</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-neutral-50 p-4">
                  <div className="space-y-2 text-sm text-neutral-600 w-full">
                    <div className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Pagamento seguro e criptografado</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Cancelamento gratuito até 24 horas antes</span>
                    </div>
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
