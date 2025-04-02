import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Search, Edit } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface HowItWorksProps {
  user: any | null;
}

export default function HowItWorks({ user }: HowItWorksProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-blue-900 py-14 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMzUpIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+')]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Como funciona o <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-sky-300">RentAFriend</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              RentAFriend é uma plataforma segura que conecta pessoas que buscam companhia para diversos eventos e atividades com amigos verificados.
            </p>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full transform translate-x-32 -translate-y-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/5 rounded-full transform -translate-x-32 translate-y-32 blur-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-primary/10 text-primary font-medium text-sm px-4 py-1.5 rounded-full mb-4">
              É muito simples começar
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Como o RentAFriend funciona
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
              Simples e seguro, encontre a companhia perfeita em apenas três passos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 hidden md:block"></div>
            
            <div className="relative text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/20 group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                <div className="absolute inset-0 bg-primary opacity-0 rounded-full group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <Search size={24} />
                </div>
              </div>
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 text-neutral-500 flex items-center justify-center font-bold md:block hidden z-10">
                1
              </div>
              <h3 className="text-xl font-heading font-bold text-neutral-800 mb-3">Busque</h3>
              <p className="text-neutral-600">Pesquise amigos por localização, interesses e disponibilidade para encontrar a combinação perfeita.</p>
            </div>

            <div className="relative text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/20 group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                <div className="absolute inset-0 bg-primary opacity-0 rounded-full group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <Check size={24} />
                </div>
              </div>
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 text-neutral-500 flex items-center justify-center font-bold md:block hidden z-10">
                2
              </div>
              <h3 className="text-xl font-heading font-bold text-neutral-800 mb-3">Reserve</h3>
              <p className="text-neutral-600">Escolha o amigo, defina a data, hora e local do encontro, e faça sua reserva com segurança.</p>
            </div>

            <div className="relative text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/20 group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                <div className="absolute inset-0 bg-primary opacity-0 rounded-full group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  <Edit size={24} />
                </div>
              </div>
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 text-neutral-500 flex items-center justify-center font-bold md:block hidden z-10">
                3
              </div>
              <h3 className="text-xl font-heading font-bold text-neutral-800 mb-3">Avalie</h3>
              <p className="text-neutral-600">Após a experiência, deixe sua avaliação para ajudar a comunidade e melhorar o serviço.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-neutral-50 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block text-primary font-medium text-sm px-4 py-1.5 rounded-full bg-primary/10 mb-4">
                Perguntas Frequentes
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-bold mb-4">
                Tire suas dúvidas sobre o RentAFriend
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Respondemos às perguntas mais comuns para facilitar sua experiência
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-2">O que é o RentAFriend?</h3>
                <p className="text-neutral-600">
                  RentAFriend é uma plataforma que conecta pessoas que buscam companhia para eventos, atividades ou simplesmente para conversar, com amigos verificados que oferecem seus serviços.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-2">É seguro usar o RentAFriend?</h3>
                <p className="text-neutral-600">
                  Sim, priorizamos a segurança. Todos os amigos são verificados, o pagamento é processado de forma segura, e temos um sistema de avaliações e revisões para garantir a qualidade.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-2">Como são feitos os pagamentos?</h3>
                <p className="text-neutral-600">
                  Todos os pagamentos são processados com segurança através da plataforma Stripe. O valor é reservado no momento da reserva, mas só é transferido para o amigo após a conclusão do encontro.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-2">Posso cancelar uma reserva?</h3>
                <p className="text-neutral-600">
                  Sim, você pode cancelar uma reserva até 24 horas antes do horário marcado para receber um reembolso completo. Cancelamentos com menos de 24 horas estão sujeitos a uma taxa.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-2">Como posso me tornar um amigo na plataforma?</h3>
                <p className="text-neutral-600">
                  Para se tornar um amigo, você precisa se cadastrar, completar seu perfil com detalhes sobre seus interesses e habilidades, passar pelo processo de verificação e definir sua disponibilidade e taxas.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/register">
                <Button className="rounded-full px-8 py-2.5">
                  Cadastre-se agora <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}