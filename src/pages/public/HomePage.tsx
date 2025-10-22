import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, User, ArrowRight, Heart, Shield, Star } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../../components/ui/navigation-menu'
import { Separator } from '../../components/ui/separator'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Clínica de Psicologia</h1>
                <p className="text-sm text-muted-foreground">Cuidando da sua saúde mental</p>
              </div>
            </div>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#sobre" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Sobre
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#contato" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Contato
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/admin/login">Área Admin</a>
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-5xl font-bold text-foreground tracking-tight">
              Agende sua consulta
              <span className="block text-primary">online</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Agende sua consulta de forma rápida e fácil. Escolha a data, 
              profissional e horário que melhor se adequa à sua rotina.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 my-16">
            <Card className="group hover:shadow-lg transition-all duration-300 animate-slide-up">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Escolha a Data</CardTitle>
                <CardDescription>
                  Selecione o dia que melhor funciona para você
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Escolha o Profissional</CardTitle>
                <CardDescription>
                  Conheça nossos psicólogos especializados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Escolha o Horário</CardTitle>
                <CardDescription>
                  Veja os horários disponíveis
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="space-y-6 animate-scale-in">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 h-auto group"
              onClick={() => navigate('/agendar')}
            >
              Agendar Consulta
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>100% Seguro</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Profissionais Qualificados</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2025 Clínica de Psicologia. Todos os direitos reservados.
            </p>
            <Button variant="ghost" size="sm" asChild>
              <a href="/admin/login" className="text-muted-foreground hover:text-foreground">
                Área Administrativa
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
