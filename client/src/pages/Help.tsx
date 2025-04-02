import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, MessageCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface HelpProps {
  user: any | null;
}

export default function Help({ user }: HelpProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("faq");
  const [contactForm, setContactForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de envio do formulário
    toast({
      title: "Mensagem enviada",
      description: "Nossa equipe entrará em contato em breve!",
      variant: "default",
    });
    
    setContactForm({
      name: user?.name || "",
      email: user?.email || "",
      subject: "",
      message: "",
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-blue-900 py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMzUpIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+')]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-6">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
              Como podemos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-sky-300">ajudar você?</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Encontre respostas para suas dúvidas ou entre em contato com nossa equipe de suporte
            </p>
          </div>
        </div>
      </section>
      
      {/* Help Tabs Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="w-full max-w-lg mx-auto mb-12 grid grid-cols-2 sm:grid-cols-3 bg-neutral-100">
              <TabsTrigger value="faq" className="px-6 py-2.5">Perguntas Frequentes</TabsTrigger>
              <TabsTrigger value="contact" className="px-6 py-2.5">Contato</TabsTrigger>
              <TabsTrigger value="support" className="px-6 py-2.5">Suporte</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq">
              <div className="bg-white rounded-xl p-2">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-medium px-4 py-4">O que é o RentAFriend?</AccordionTrigger>
                    <AccordionContent className="px-4 py-4 text-neutral-600">
                      RentAFriend é uma plataforma que conecta pessoas que buscam companhia para eventos, atividades ou simplesmente para conversar, com amigos verificados que oferecem seus serviços. É uma forma segura e prática de encontrar companhia para qualquer ocasião.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg font-medium px-4 py-4">Como funciona o processo de reserva?</AccordionTrigger>
                    <AccordionContent className="px-4 py-4 text-neutral-600">
                      Para reservar um amigo, basta pesquisar por localização, interesses ou disponibilidade, escolher o amigo ideal, selecionar a data e hora desejadas e fazer o pagamento seguro pela plataforma. O amigo receberá todos os detalhes da reserva e poderá confirmar a disponibilidade.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg font-medium px-4 py-4">Como são feitos os pagamentos?</AccordionTrigger>
                    <AccordionContent className="px-4 py-4 text-neutral-600">
                      Todos os pagamentos são processados com segurança através da plataforma Stripe. O valor é reservado no momento da reserva, mas só é transferido para o amigo após a conclusão do encontro, garantindo segurança para ambas as partes.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-lg font-medium px-4 py-4">Posso cancelar uma reserva?</AccordionTrigger>
                    <AccordionContent className="px-4 py-4 text-neutral-600">
                      Sim, você pode cancelar uma reserva até 24 horas antes do horário marcado para receber um reembolso completo. Cancelamentos com menos de 24 horas estão sujeitos a uma taxa de 50% do valor da reserva.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-lg font-medium px-4 py-4">Como é garantida a segurança na plataforma?</AccordionTrigger>
                    <AccordionContent className="px-4 py-4 text-neutral-600">
                      Priorizamos a segurança de nossos usuários. Todos os amigos passam por um rigoroso processo de verificação de identidade, o pagamento é processado de forma segura, e temos um sistema de avaliações e feedback para garantir a qualidade do serviço.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6">
                    <AccordionTrigger className="text-lg font-medium px-4 py-4">Como posso me tornar um amigo na plataforma?</AccordionTrigger>
                    <AccordionContent className="px-4 py-4 text-neutral-600">
                      Para se tornar um amigo, você precisa se cadastrar, completar seu perfil com detalhes sobre seus interesses e habilidades, passar pelo processo de verificação e definir sua disponibilidade e taxas. Visite nossa página "Tornar-se um Amigo" para mais informações.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-7">
                    <AccordionTrigger className="text-lg font-medium px-4 py-4">Quais são as taxas da plataforma?</AccordionTrigger>
                    <AccordionContent className="px-4 py-4 text-neutral-600">
                      A plataforma cobra uma taxa de serviço de 15% sobre o valor da reserva. Essa taxa cobre os custos de processamento de pagamento, manutenção da plataforma e suporte ao cliente.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-8">
                    <AccordionTrigger className="text-lg font-medium px-4 py-4">O que acontece se houver um problema durante o encontro?</AccordionTrigger>
                    <AccordionContent className="px-4 py-4 text-neutral-600">
                      Em caso de problemas durante o encontro, recomendamos primeiro tentar resolver diretamente com o amigo. Se isso não for possível, nossa equipe de suporte está disponível 24/7 para ajudar a resolver qualquer situação.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-12 text-center">
                  <p className="text-neutral-600 mb-4">Não encontrou o que estava procurando?</p>
                  <Button variant="outline" onClick={() => setActiveTab("contact")} className="rounded-full px-6">
                    Entre em contato <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact">
              <div className="bg-white rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-4">Entre em contato</h2>
                    <p className="text-neutral-600 mb-8">
                      Preencha o formulário e nossa equipe responderá o mais rápido possível.
                    </p>
                    
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Nome completo
                        </label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={contactForm.name} 
                          onChange={handleInputChange} 
                          required 
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          E-mail
                        </label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={contactForm.email} 
                          onChange={handleInputChange} 
                          required 
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Assunto
                        </label>
                        <Input 
                          id="subject" 
                          name="subject" 
                          value={contactForm.subject} 
                          onChange={handleInputChange} 
                          required 
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Mensagem
                        </label>
                        <Textarea 
                          id="message" 
                          name="message" 
                          rows={5} 
                          value={contactForm.message} 
                          onChange={handleInputChange} 
                          required 
                          className="w-full"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full md:w-auto rounded-full px-8">
                        Enviar mensagem
                      </Button>
                    </form>
                  </div>
                  
                  <div className="bg-neutral-50 p-6 md:p-8 rounded-xl">
                    <h2 className="text-2xl font-bold mb-4">Informações de contato</h2>
                    <p className="text-neutral-600 mb-8">
                      Você também pode entrar em contato conosco diretamente através dos seguintes canais:
                    </p>
                    
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <Mail className="h-6 w-6 text-primary mr-4 mt-0.5" />
                        <div>
                          <p className="font-medium">E-mail</p>
                          <p className="text-neutral-600">contato@rentafriend.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="h-6 w-6 text-primary mr-4 mt-0.5" />
                        <div>
                          <p className="font-medium">Telefone</p>
                          <p className="text-neutral-600">+55 (11) 3456-7890</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MessageCircle className="h-6 w-6 text-primary mr-4 mt-0.5" />
                        <div>
                          <p className="font-medium">Chat ao vivo</p>
                          <p className="text-neutral-600">Disponível de segunda a sexta, das 9h às 18h</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-neutral-200">
                      <h3 className="font-bold mb-2">Horário de atendimento</h3>
                      <p className="text-neutral-600">
                        Segunda a sexta: 9h às 18h <br />
                        Sábado: 10h às 14h <br />
                        Domingo: Fechado
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="support">
              <div className="bg-white rounded-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4">Suporte ao cliente</h2>
                <p className="text-neutral-600 mb-8">
                  Estamos aqui para ajudar você com qualquer problema ou dúvida que possa surgir durante sua experiência com o RentAFriend.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-neutral-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-3">Problemas com reservas</h3>
                    <p className="text-neutral-600 mb-4">
                      Se você estiver enfrentando problemas com suas reservas, cancelamentos ou reembolsos, nossa equipe de suporte pode ajudar.
                    </p>
                    <Button onClick={() => setActiveTab("contact")} variant="outline" className="w-full">
                      Obter ajuda com reservas
                    </Button>
                  </div>
                  
                  <div className="bg-neutral-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-3">Questões de pagamento</h3>
                    <p className="text-neutral-600 mb-4">
                      Para dúvidas sobre pagamentos, cobranças ou problemas com cartões, nossa equipe financeira está à disposição.
                    </p>
                    <Button onClick={() => setActiveTab("contact")} variant="outline" className="w-full">
                      Resolver problemas de pagamento
                    </Button>
                  </div>
                  
                  <div className="bg-neutral-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-3">Suporte para amigos</h3>
                    <p className="text-neutral-600 mb-4">
                      Para amigos cadastrados na plataforma que precisam de ajuda com suas reservas, pagamentos ou perfil.
                    </p>
                    <Button onClick={() => setActiveTab("contact")} variant="outline" className="w-full">
                      Suporte para amigos
                    </Button>
                  </div>
                  
                  <div className="bg-neutral-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-3">Sugestões e feedback</h3>
                    <p className="text-neutral-600 mb-4">
                      Queremos ouvir suas sugestões! Compartilhe suas ideias para melhorar nossa plataforma.
                    </p>
                    <Button onClick={() => setActiveTab("contact")} variant="outline" className="w-full">
                      Enviar feedback
                    </Button>
                  </div>
                </div>
                
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                  <h3 className="text-xl font-bold mb-3">Emergências</h3>
                  <p className="text-neutral-700 mb-4">
                    Para situações urgentes que requerem atenção imediata durante um encontro ou evento, entre em contato com nossa linha de emergência:
                  </p>
                  <p className="font-bold text-lg text-primary mb-6">+55 (11) 9876-5432</p>
                  <p className="text-sm text-neutral-600">
                    Disponível 24 horas por dia, 7 dias por semana. Use apenas em caso de emergência real.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Community Guidelines */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block text-primary font-medium text-sm px-4 py-1.5 rounded-full bg-primary/10 mb-4">
                Nossa comunidade
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-bold mb-4">
                Diretrizes da comunidade
              </h2>
              <p className="text-neutral-600">
                O RentAFriend é construído com base na confiança, respeito e segurança. Siga nossas diretrizes para garantir uma experiência positiva para todos.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-3">Respeito mútuo</h3>
                <p className="text-neutral-600">
                  Trate todos os usuários com respeito e dignidade, independentemente de idade, gênero, raça, religião ou orientação sexual. Não toleramos qualquer forma de discriminação ou assédio.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-3">Segurança em primeiro lugar</h3>
                <p className="text-neutral-600">
                  Sempre priorize sua segurança. Recomendamos encontros em locais públicos, compartilhar sua localização com amigos ou familiares e evitar compartilhar informações pessoais sensíveis.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-3">Honestidade</h3>
                <p className="text-neutral-600">
                  Seja honesto em seu perfil, comunicações e durante os encontros. A confiança é fundamental para o funcionamento da nossa comunidade.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-3">Responsabilidade</h3>
                <p className="text-neutral-600">
                  Cumpra seus compromissos e seja pontual. Se precisar cancelar, faça-o com a maior antecedência possível. Lembre-se que outras pessoas estão contando com você.
                </p>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Link href="/how-it-works">
                <Button variant="outline" className="rounded-full px-6">
                  Saiba mais sobre como funciona <ArrowRight className="ml-2 h-4 w-4" />
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