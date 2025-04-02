import { useState } from "react";
import { Link, useLocation } from "wouter";
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
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-primary font-heading font-bold text-2xl">RentAFriend</a>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/how-it-works">
              <a className="text-neutral-800 hover:text-primary transition font-medium">
                Como Funciona
              </a>
            </Link>
            <Link href="/become-amigo">
              <a className="text-neutral-800 hover:text-primary transition font-medium">
                Tornar-se um Amigo
              </a>
            </Link>
            <Link href="/help">
              <a className="text-neutral-800 hover:text-primary transition font-medium">
                Ajuda
              </a>
            </Link>
            
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
                  <DropdownMenuItem onClick={() => setLocation("/profile")}>
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/bookings")}>
                    Minhas Reservas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/favorites")}>
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
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/register">
                  <Button>Cadastrar</Button>
                </Link>
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
                    <Link href="/login">
                      <Button className="w-full" variant="outline" onClick={() => setIsMobileMenuOpen(false)}>
                        Entrar
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                        Cadastrar
                      </Button>
                    </Link>
                  </div>
                )}
                
                <Link href="/how-it-works">
                  <a 
                    className="text-lg font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Como Funciona
                  </a>
                </Link>
                <Link href="/become-amigo">
                  <a 
                    className="text-lg font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tornar-se um Amigo
                  </a>
                </Link>
                <Link href="/help">
                  <a 
                    className="text-lg font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Ajuda
                  </a>
                </Link>
                
                {user && (
                  <>
                    <div className="h-px bg-gray-200 my-2" />
                    <Link href="/profile">
                      <a 
                        className="text-lg font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Perfil
                      </a>
                    </Link>
                    <Link href="/bookings">
                      <a 
                        className="text-lg font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Minhas Reservas
                      </a>
                    </Link>
                    <Link href="/favorites">
                      <a 
                        className="text-lg font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Favoritos
                      </a>
                    </Link>
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
