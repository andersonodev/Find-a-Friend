import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface BecomeAmigoProps {
  user: any | null;
}

export default function BecomeAmigo({ user }: BecomeAmigoProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-blue-900 py-14 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMzUpIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+')]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Torne-se um <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-sky-300">amigo</span> e comece a ganhar
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Conecte-se com pessoas interessantes, faça novas amizades e ganhe dinheiro compartilhando seu tempo e experiências.
            </p>
            <div className="mt-10">
              <Link href="/register">
                <Button size="lg" className="rounded-full text-lg px-8 py-6">
                  Começar agora <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-primary/10 text-primary font-medium text-sm px-4 py-1.5 rounded-full mb-4">
              Benefícios
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Por que se tornar um amigo?
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
              Descubra as vantagens de oferecer seus serviços na maior plataforma de companhia do Brasil
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-primary/20">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Renda flexível</h3>
              <p className="text-neutral-600">
                Defina suas próprias taxas e disponibilidade. Ganhe dinheiro extra nos seus momentos livres, sem compromissos fixos.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-primary/20">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Amplie sua rede</h3>
              <p className="text-neutral-600">
                Conheça pessoas novas e interessantes, amplie sua rede de contatos e crie conexões genuínas com diferentes pessoas.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-primary/20">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Plataforma segura</h3>
              <p className="text-neutral-600">
                Processos de verificação rigorosos, sistema de avaliações e pagamentos seguros garantem uma experiência protegida.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How to Apply Section */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full md:w-1/2">
              <div className="inline-block bg-primary/10 text-primary font-medium text-sm px-4 py-1.5 rounded-full mb-4">
                Processo simples
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-bold mb-6">
                Como se tornar um amigo
              </h2>
              <p className="text-neutral-600 text-lg mb-8">
                Nosso processo de inscrição é rápido e direto. Basta seguir estes passos simples:
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-primary mt-0.5 h-6 w-6 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Crie sua conta</h3>
                    <p className="text-neutral-600">
                      Cadastre-se gratuitamente na plataforma com seus dados básicos.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-primary mt-0.5 h-6 w-6 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Complete seu perfil</h3>
                    <p className="text-neutral-600">
                      Adicione fotos, interesses, habilidades e conte um pouco sobre você para atrair clientes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-primary mt-0.5 h-6 w-6 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Verificação de identidade</h3>
                    <p className="text-neutral-600">
                      Passe pelo nosso processo de verificação de identidade para garantir a segurança da plataforma.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-primary mt-0.5 h-6 w-6 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Defina sua disponibilidade</h3>
                    <p className="text-neutral-600">
                      Configure sua agenda, preços e regiões onde você está disponível para encontros.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-primary mt-0.5 h-6 w-6 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Comece a receber reservas</h3>
                    <p className="text-neutral-600">
                      Seu perfil fica visível para potenciais clientes e você começa a receber solicitações de reserva.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Link href="/register">
                  <Button className="rounded-full px-8 py-2.5">
                    Inscreva-se agora <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-md p-1">
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="h-full w-full bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-primary/20 text-primary mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smile"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Compartilhe sua história</h3>
                  <p className="text-neutral-600 mb-6">
                    Milhares de pessoas estão procurando companhia para diversos eventos, atividades e experiências. Compartilhe seu tempo, interesses e experiências únicas!
                  </p>
                  <div className="text-primary font-medium">
                    Mais de 5.000 amigos já estão na plataforma
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-block text-primary font-medium text-sm px-4 py-1.5 rounded-full bg-primary/10 mb-4">
              Depoimentos
            </div>
            <h2 className="text-2xl md:text-4xl font-heading font-bold mb-4">
              O que nossos amigos dizem
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
              Conheça as histórias de quem já está compartilhando seu tempo e experiências na plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <p className="text-neutral-600 mb-6">
                "Entrei no RentAFriend há 6 meses e tem sido uma experiência incrível. Conheci pessoas maravilhosas, visitei lugares novos e ainda estou ganhando uma renda extra fazendo o que amo: conversar e compartilhar experiências."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-neutral-200 mr-4"></div>
                <div>
                  <p className="font-bold">Pedro Oliveira</p>
                  <p className="text-sm text-neutral-500">São Paulo, SP</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <p className="text-neutral-600 mb-6">
                "Como estudante, o RentAFriend me ajudou a ganhar dinheiro extra em horários flexíveis. Tenho praticado idiomas com turistas, acompanhado pessoas em eventos e feito amizades genuínas. A plataforma é muito segura e profissional."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-neutral-200 mr-4"></div>
                <div>
                  <p className="font-bold">Ana Costa</p>
                  <p className="text-sm text-neutral-500">Rio de Janeiro, RJ</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <p className="text-neutral-600 mb-6">
                "Sou apaixonado por cultura e história local. Como amigo na plataforma, mostro minha cidade para turistas e tenho recebido excelentes avaliações. Os pagamentos são pontuais e o suporte da plataforma é excelente quando preciso de ajuda."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-neutral-200 mr-4"></div>
                <div>
                  <p className="font-bold">Carlos Mendes</p>
                  <p className="text-sm text-neutral-500">Salvador, BA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-primary via-primary to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMzUpIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+')]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
              Pronto para começar sua jornada como amigo?
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-10">
              Junte-se a milhares de pessoas que já estão compartilhando seus interesses, conhecendo gente nova e ganhando dinheiro na plataforma.
            </p>
            <Link href="/register">
              <Button variant="secondary" size="lg" className="rounded-full text-lg font-medium px-8 py-6">
                Cadastre-se gratuitamente <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}