import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginWithEmail, loginWithGoogle } from "@/lib/firebase";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Eye, EyeOff } from "lucide-react";

// Login form schema
const loginFormSchema = z.object({
  email: z.string().email("Por favor, informe um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  remember: z.boolean().optional(),
});

// Type for our form values
type FormValues = z.infer<typeof loginFormSchema>;

export default function Login() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Check for redirect param in URL
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const redirectUrl = searchParams.get("redirect") || "/";
  
  // Form definition with proper typing
  const form = useForm<FormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      await loginWithEmail(values.email, values.password);
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao RentAFriend.",
      });
      
      navigate(redirectUrl);
    } catch (error: any) {
      let errorMessage = "Ocorreu um erro ao fazer login. Tente novamente.";
      
      // Check for specific Firebase error codes
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Email ou senha incorretos. Verifique suas credenciais.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Muitas tentativas de login. Tente novamente mais tarde.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "O endereço de email é inválido.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Erro de conexão. Verifique sua conexão com a internet.";
      } else if (error.code === "auth/configuration-not-found") {
        errorMessage = "Erro de configuração. O método de login escolhido não está disponível.";
      }
      
      toast({
        title: "Falha no login",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error("Erro de login:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Login com Google
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    try {
      await loginWithGoogle();
      
      toast({
        title: "Login com Google realizado com sucesso!",
        description: "Bem-vindo de volta ao RentAFriend.",
      });
      
      navigate(redirectUrl);
    } catch (error: any) {
      let errorMessage = "Ocorreu um erro ao fazer login com Google. Tente novamente.";
      
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Login cancelado. Você fechou a janela de login.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup bloqueado. Por favor, permita popups para este site.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Operação cancelada. Tente novamente.";
      } else if (error.code === "auth/configuration-not-found") {
        errorMessage = "Erro de configuração. O login com Google não está configurado corretamente.";
      }
      
      toast({
        title: "Falha no login com Google",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error("Erro de login com Google:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-heading text-center">Entre na sua conta</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                              placeholder="Sua senha"
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
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
                  
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="remember"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="remember" 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                          <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Lembrar-me
                          </label>
                        </div>
                      )}
                    />
                    
                    <span 
                      className="text-sm text-primary hover:underline cursor-pointer"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Esqueceu a senha?
                    </span>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
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
                disabled={isLoading || isGoogleLoading}
                onClick={handleGoogleLogin}
              >
                {isGoogleLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                    Processando...
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Ainda não tem uma conta?{" "}
                <span 
                  className="text-primary font-semibold hover:underline cursor-pointer"
                  onClick={() => navigate(`/register${redirectUrl !== "/" ? `?redirect=${redirectUrl}` : ""}`)}
                >
                  Cadastre-se
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
