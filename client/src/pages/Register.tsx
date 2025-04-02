import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerWithEmail, updateUserProfile } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

// Define a schema for registration form
const formSchema = z.object({
  name: z.string().min(2, "Nome completo é obrigatório"),
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  email: z.string().email("Por favor, informe um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
  terms: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
}).refine((data) => data.terms === true, {
  message: "Você precisa aceitar os termos de uso",
  path: ["terms"],
});

// Define the type for our form values
type FormValues = z.infer<typeof formSchema>;

export default function Register() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("client"); // "client" or "amigo"
  
  // Check for redirect param in URL
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const redirectUrl = searchParams.get("redirect") || "/";
  
  // Form definition with proper typing
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      terms: false,
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      // Create Firebase user account
      const userCredential = await registerWithEmail(values.email, values.password);
      
      // Update display name
      await updateUserProfile(values.name);
      
      try {
        // Create user in our database
        await apiRequest("POST", "/api/auth/register", {
          username: values.username,
          email: values.email,
          password: values.password, // This would be hashed on the server
          name: values.name,
          isAmigo: accountType === "amigo",
        });
      } catch (dbError) {
        console.error("Error creating user in database:", dbError);
        // Continue anyway since Firebase auth worked
      }
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Bem-vindo ao RentAFriend.",
      });
      
      navigate(redirectUrl);
    } catch (error: any) {
      let errorMessage = "Ocorreu um erro ao criar sua conta. Tente novamente.";
      
      // Check for specific Firebase error codes
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está sendo usado por outra conta.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A senha é muito fraca. Escolha uma senha mais forte.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "O endereço de email é inválido.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "O registro com email e senha não está habilitado.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Erro de conexão. Verifique sua conexão com a internet.";
      }
      
      toast({
        title: "Falha no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-heading text-center">Crie sua conta</CardTitle>
            </CardHeader>
            
            <CardContent>
              <Tabs 
                defaultValue="client" 
                value={accountType} 
                onValueChange={setAccountType}
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="client">Sou Cliente</TabsTrigger>
                  <TabsTrigger value="amigo">Quero ser Amigo</TabsTrigger>
                </TabsList>
                <TabsContent value="client">
                  <p className="text-sm text-neutral-600 mt-2">
                    Crie uma conta para encontrar e reservar amigos para seus eventos e ocasiões.
                  </p>
                </TabsContent>
                <TabsContent value="amigo">
                  <p className="text-sm text-neutral-600 mt-2">
                    Registre-se como amigo para oferecer seus serviços e ganhar dinheiro extra.
                  </p>
                </TabsContent>
              </Tabs>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Seu nome completo"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome de usuário</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Seu nome de usuário"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="seu.email@exemplo.com"
                            type="email"
                            autoComplete="email"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Crie uma senha"
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              disabled={isLoading}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showPassword ? "Esconder senha" : "Mostrar senha"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirme a senha</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Confirme sua senha"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            Eu concordo com os{" "}
                            <span 
                              className="text-primary hover:underline cursor-pointer"
                              onClick={() => navigate("/terms")}
                            >
                              termos de uso
                            </span>{" "}
                            e{" "}
                            <span
                              className="text-primary hover:underline cursor-pointer"
                              onClick={() => navigate("/privacy")}
                            >
                              política de privacidade
                            </span>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </form>
              </Form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Continuar com Google
              </Button>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <span 
                  className="text-primary font-semibold hover:underline cursor-pointer"
                  onClick={() => navigate(`/login${redirectUrl !== "/" ? `?redirect=${redirectUrl}` : ""}`)}
                >
                  Faça login
                </span>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
