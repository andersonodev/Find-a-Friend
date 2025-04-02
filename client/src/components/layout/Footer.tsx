import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">RentAFriend</h3>
            <p className="text-neutral-400 mb-4">
              Conectando pessoas e criando experiências memoráveis em todo o Brasil.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-neutral-400 hover:text-white transition">
                    Página Inicial
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works">
                  <a className="text-neutral-400 hover:text-white transition">
                    Como Funciona
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/search">
                  <a className="text-neutral-400 hover:text-white transition">
                    Buscar Amigos
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/become-amigo">
                  <a className="text-neutral-400 hover:text-white transition">
                    Tornar-se um Amigo
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-neutral-400 hover:text-white transition">
                    Blog
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Informações</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-neutral-400 hover:text-white transition">
                    Sobre Nós
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-neutral-400 hover:text-white transition">
                    Política de Privacidade
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-neutral-400 hover:text-white transition">
                    Termos de Uso
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/partners">
                  <a className="text-neutral-400 hover:text-white transition">
                    Parcerias
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-neutral-400 hover:text-white transition">
                    FAQ
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-neutral-400" />
                <span className="text-neutral-400">contato@rentafriend.com.br</span>
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
            &copy; {new Date().getFullYear()} RentAFriend. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
