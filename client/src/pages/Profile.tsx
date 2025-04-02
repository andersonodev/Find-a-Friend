import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { logout, updateUserProfile, auth } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Badge,
  Calendar,
  CreditCard,
  LogOut,
  MapPin,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProfileProps {
  user: any;
  initialTab?: string;
}

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  bio: z.string().optional(),
  location: z.string().optional(),
});

export default function Profile({ user, initialTab = "profile" }: ProfileProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["/api/users", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const res = await fetch(`/api/users/${user.uid}`);
      if (!res.ok) throw new Error("Failed to fetch user data");
      return res.json();
    },
    enabled: !!user?.uid,
  });
  
  const { data: bookings = [], isLoading: isBookingsLoading } = useQuery({
    queryKey: ["/api/users", user?.uid, "bookings"],
    queryFn: async () => {
      if (!user?.uid) return [];
      const res = await fetch(`/api/users/${user.uid}/bookings`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
    enabled: !!user?.uid,
  });
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      bio: "",
      location: "",
    },
  });
  
  // Update form when user data loads
  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData.name || user?.name || "",
        bio: userData.bio || "",
        location: userData.location || "",
      });
    }
  }, [userData, user, form]);
  
  // Redirect to login if no user
  useEffect(() => {
    if (!user && !isUserLoading) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para acessar seu perfil.",
        variant: "destructive",
      });
      navigate("/login?redirect=/profile");
    }
  }, [user, isUserLoading, navigate, toast]);
  
  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    
    try {
      // Update Firebase profile
      await updateUserProfile(values.name);
      
      // Update our database
      await apiRequest("POST", `/api/users/${user.uid}`, values);
      
      // Invalidate queries to reload data
      queryClient.invalidateQueries({ queryKey: ["/api/users", user.uid] });
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao salvar suas informações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao desconectar da sua conta. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header user={null} />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-1/4">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary-100 text-primary-600 text-xl">
                    {user.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mb-1">{user.name || "Usuário"}</h2>
                <p className="text-neutral-600 text-sm mb-4">{user.email}</p>
                <Button variant="outline" size="sm" className="mb-6 w-full" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair da conta
                </Button>
              </div>
              
              <div className="hidden md:block">
                <h3 className="font-medium mb-2 text-sm uppercase text-neutral-500">Menu</h3>
                <nav className="space-y-1">
                  <Link href="/profile">
                    <a className="flex items-center p-2 text-neutral-700 hover:bg-neutral-100 rounded-md">
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil
                    </a>
                  </Link>
                  <Link href="/bookings">
                    <a className="flex items-center p-2 text-neutral-700 hover:bg-neutral-100 rounded-md">
                      <Calendar className="mr-2 h-4 w-4" />
                      Minhas Reservas
                    </a>
                  </Link>
                  <Link href="/payment-methods">
                    <a className="flex items-center p-2 text-neutral-700 hover:bg-neutral-100 rounded-md">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Métodos de Pagamento
                    </a>
                  </Link>
                  <Link href="/badges">
                    <a className="flex items-center p-2 text-neutral-700 hover:bg-neutral-100 rounded-md">
                      <Badge className="mr-2 h-4 w-4" />
                      Verificações
                    </a>
                  </Link>
                </nav>
              </div>
            </div>
            
            <div className="md:w-3/4">
              <Tabs defaultValue={initialTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
                  <TabsTrigger value="bookings">Minhas Reservas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações pessoais</CardTitle>
                      <CardDescription>
                        Atualize suas informações de perfil
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome completo</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Localização</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      placeholder="Cidade, Estado" 
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
                          
                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sobre mim</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Conte um pouco sobre você..."
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                              {isLoading ? "Salvando..." : "Salvar alterações"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="bookings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Minhas reservas</CardTitle>
                      <CardDescription>
                        Gerencie todas as suas reservas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isBookingsLoading ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : bookings.length === 0 ? (
                        <div className="text-center py-8">
                          <h3 className="text-lg font-medium mb-2">Nenhuma reserva encontrada</h3>
                          <p className="text-neutral-600 mb-6">Você ainda não fez nenhuma reserva.</p>
                          <Link href="/search">
                            <Button>Encontrar amigos</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {bookings.map((booking: any) => (
                            <div key={booking.id} className="border rounded-lg p-4">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3">
                                <div className="flex items-center">
                                  <div className="mr-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(booking.status)}`}>
                                      {booking.status === "pending" && "Pendente"}
                                      {booking.status === "confirmed" && "Confirmado"}
                                      {booking.status === "completed" && "Concluído"}
                                      {booking.status === "cancelled" && "Cancelado"}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Reserva #{booking.id}</h4>
                                    <p className="text-sm text-neutral-600">
                                      {format(new Date(booking.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">R$ {booking.totalAmount}</p>
                                  <p className="text-sm text-neutral-600">
                                    {booking.paymentStatus === "paid" ? "Pago" : "Pendente"}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-4">
                                <div>
                                  <p className="text-sm text-neutral-600 mb-1">
                                    <MapPin className="inline-block h-4 w-4 mr-1" />
                                    {booking.location}
                                  </p>
                                  <p className="text-sm text-neutral-600">
                                    <Calendar className="inline-block h-4 w-4 mr-1" />
                                    {format(new Date(booking.startTime), "HH:mm")} - {format(new Date(booking.endTime), "HH:mm")}
                                  </p>
                                </div>
                                <Link href={`/bookings/${booking.id}`}>
                                  <Button variant="outline" size="sm">
                                    Ver detalhes
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
