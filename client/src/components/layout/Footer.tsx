import { useLocation } from "wouter";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const [, navigate] = useLocation();
  
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Find a Friend</h3>
            <p className="text-neutral-400 mb-4">
              Conectando pessoas e criando experiências memoráveis em todo o Brasil.
            </p>
            <div className="flex space-x-4">
              <span className="text-neutral-400 hover:text-white transition cursor-pointer">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </span>
              <span className="text-neutral-400 hover:text-white transition cursor-pointer">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </span>
              <span className="text-neutral-400 hover:text-white transition cursor-pointer">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <span 
                  className="text-neutral-400 hover:text-white transition cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Página Inicial
                </span>
              </li>
              <li>
                <span 
                  className="text-neutral-400 hover:text-white transition cursor-pointer"
                  onClick={() => navigate("/how-it-works")}
                >
                  Como Funciona
                </span>
              </li>
              <li>
                <span 
                  className="text-neutral-400 hover:text-white transition cursor-pointer"
                  onClick={() => navigate("/search")}
                >
                  Buscar Amigos
                </span>
              </li>
              <li>
                <span 
                  className="text-neutral-400 hover:text-white transition cursor-pointer"
                  onClick={() => navigate("/become-amigo")}
                >
                  Tornar-se um Amigo
                </span>
              </li>
              <li>
                <span 
                  className="text-neutral-400 hover:text-white transition cursor-pointer"
                  onClick={() => navigate("/blog")}
                >
                  Blog
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Informações</h3>
            <ul className="space-y-2">
              <li>
                <span 
                  className="text-neutral-400 hover:text-white transition cursor-pointer"
                  onClick={() => navigate("/about")}
                >
                  Sobre Nós
                </span>
              </li>
              <li>
                <span 
                  className="text-neutral-400 hover:text-white transition cursor-pointer"
                  onClick={() => navigate("/privacy")}
                >
                  Política de Privacidade
                </span>
              </li>
              <li>
                <span 
                  className="text-neutral-400 hover:text-white transition cursor-pointer"
                  onClick={() => navigate("/terms")}
                >
                  Termos de Uso
                </span>
              </li>
              <li>
                <span 
                  className="text-neutral-400 hover:text-white transition cursor-pointer"
                  onClick={() => navigate("/partners")}
                >
                  Parcerias
                </span>
              </li>
              <li>
                <span 
                  className="text-neutral-400 hover:text-white transition cursor-pointer"
                  onClick={() => navigate("/faq")}
                >
                  FAQ
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-neutral-400" />
                <span className="text-neutral-400">contato@findafriend.com.br</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-neutral-400" />
                <span className="text-neutral-400">(11) 97123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-neutral-400" />
                <span className="text-neutral-400">Av. Paulista, 1000 - São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-8">
          <p className="text-center text-neutral-400 text-sm">
            &copy; {new Date().getFullYear()} Find a Friend. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
