import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { logout } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  user?: {
    name?: string;
    avatar?: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Falha ao desconectar",
        description: "Ocorreu um erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <span 
              className="text-primary font-heading font-bold text-2xl cursor-pointer"
              onClick={() => navigate("/")}
            >
              RentAFriend
            </span>
          </div>
          
          <div className="hidden md:flex space-x-6 items-center">
            <span 
              className="text-neutral-800 hover:text-primary transition font-medium cursor-pointer"
              onClick={() => navigate("/how-it-works")}
            >
              Como Funciona
            </span>
            <span 
              className="text-neutral-800 hover:text-primary transition font-medium cursor-pointer"
              onClick={() => navigate("/become-amigo")}
            >
              Tornar-se um Amigo
            </span>
            <span 
              className="text-neutral-800 hover:text-primary transition font-medium cursor-pointer"
              onClick={() => navigate("/help")}
            >
              Ajuda
            </span>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 focus:ring-0">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary-100 text-primary-600">
                        {user.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-neutral-800 font-medium">{user.name?.split(" ")[0] || "User"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/bookings")}>
                    Minhas Reservas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/favorites")}>
                    Favoritos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Entrar
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Cadastrar
                </Button>
              </div>
            )}
          </div>
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-6">
                {user ? (
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary-100 text-primary-600">
                        {user.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name || "User"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mb-6">
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      onClick={() => {
                        navigate("/login");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Entrar
                    </Button>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        navigate("/register");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Cadastrar
                    </Button>
                  </div>
                )}
                
                <span 
                  className="text-lg font-medium py-2 cursor-pointer"
                  onClick={() => {
                    navigate("/how-it-works");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Como Funciona
                </span>
                <span 
                  className="text-lg font-medium py-2 cursor-pointer"
                  onClick={() => {
                    navigate("/become-amigo");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Tornar-se um Amigo
                </span>
                <span 
                  className="text-lg font-medium py-2 cursor-pointer"
                  onClick={() => {
                    navigate("/help");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Ajuda
                </span>
                
                {user && (
                  <>
                    <div className="h-px bg-gray-200 my-2" />
                    <span 
                      className="text-lg font-medium py-2 cursor-pointer"
                      onClick={() => {
                        navigate("/profile");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Perfil
                    </span>
                    <span 
                      className="text-lg font-medium py-2 cursor-pointer"
                      onClick={() => {
                        navigate("/bookings");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Minhas Reservas
                    </span>
                    <span 
                      className="text-lg font-medium py-2 cursor-pointer"
                      onClick={() => {
                        navigate("/favorites");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Favoritos
                    </span>
                    <Button 
                      variant="ghost" 
                      className="justify-start px-0 text-lg font-medium h-auto"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sair
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
