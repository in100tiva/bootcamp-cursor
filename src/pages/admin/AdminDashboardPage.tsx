import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../components/ui/breadcrumb'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Separator } from '../../components/ui/separator'
import { Skeleton } from '../../components/ui/skeleton'
import { Badge } from '../../components/ui/badge'
import { LogOut, Users, Calendar, Clock, TrendingUp, Settings, User, ChevronDown, BarChart3, Activity, DollarSign } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'

export default function AdminDashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    activeProfessionals: 0,
    occupancyRate: 0
  })
  const [recentAppointments, setRecentAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          professional:professionals(name)
        `)
        .order('appointment_date', { ascending: true })
        .limit(5)

      if (appointmentsError) throw appointmentsError

      // Load professionals
      const { data: professionals, error: professionalsError } = await supabase
        .from('professionals')
        .select('id, is_active')

      if (professionalsError) throw professionalsError

      // Calculate metrics
      const totalAppointments = appointments?.length || 0
      const pendingAppointments = appointments?.filter(a => a.status === 'pendente').length || 0
      const activeProfessionals = professionals?.filter(p => p.is_active).length || 0
      const occupancyRate = totalAppointments > 0 ? Math.round((appointments?.filter(a => a.status === 'confirmado').length || 0) / totalAppointments * 100) : 0

      setMetrics({
        totalAppointments,
        pendingAppointments,
        activeProfessionals,
        occupancyRate
      })

      setRecentAppointments(appointments || [])
    } catch (error: any) {
      toast.error('Erro ao carregar dados do dashboard')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logout realizado com sucesso!')
      navigate('/admin/login')
    } catch (error: any) {
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Dashboard Administrativo
                </h1>
                <p className="text-muted-foreground">
                  Bem-vindo, {user?.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block">{user?.email}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Consultas
              </CardTitle>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16 mb-2" />
              ) : (
                <div className="text-3xl font-bold text-foreground">{metrics.totalAppointments}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Total de consultas
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Consultas Pendentes
              </CardTitle>
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16 mb-2" />
              ) : (
                <div className="text-3xl font-bold text-foreground">{metrics.pendingAppointments}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Aguardando confirmação
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Profissionais Ativos
              </CardTitle>
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16 mb-2" />
              ) : (
                <div className="text-3xl font-bold text-foreground">{metrics.activeProfessionals}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Profissionais ativos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Ocupação
              </CardTitle>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16 mb-2" />
              ) : (
                <div className="text-3xl font-bold text-foreground">{metrics.occupancyRate}%</div>
              )}
              <p className="text-xs text-muted-foreground">
                Taxa de ocupação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-primary" />
                <span>Próximas Consultas</span>
              </CardTitle>
              <CardDescription>
                Consultas agendadas para hoje
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3 p-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                ) : recentAppointments.length > 0 ? (
                  recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {appointment.patient_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{appointment.patient_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(appointment as any).professional?.name || 'Profissional não encontrado'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{appointment.appointment_time}</p>
                        <Badge variant="secondary" className="text-xs">
                          {appointment.consultation_type === 'primeira_consulta' ? 'Primeira consulta' : 'Retorno'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma consulta encontrada</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary" />
                <span>Ações Rápidas</span>
              </CardTitle>
              <CardDescription>
                Acesso rápido às principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start h-12" 
                  variant="outline"
                  onClick={() => navigate('/admin/appointments')}
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Gerenciar Consultas</div>
                    <div className="text-xs text-muted-foreground">Visualizar e editar agendamentos</div>
                  </div>
                </Button>
                <Button 
                  className="w-full justify-start h-12" 
                  variant="outline"
                  onClick={() => navigate('/admin/professionals')}
                >
                  <Users className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Gerenciar Profissionais</div>
                    <div className="text-xs text-muted-foreground">Cadastrar e configurar profissionais</div>
                  </div>
                </Button>
                <Button 
                  className="w-full justify-start h-12" 
                  variant="outline"
                  onClick={() => navigate('/admin/reports')}
                >
                  <TrendingUp className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Relatórios</div>
                    <div className="text-xs text-muted-foreground">Análises e métricas</div>
                  </div>
                </Button>
                <Button 
                  className="w-full justify-start h-12" 
                  variant="outline"
                  onClick={() => navigate('/admin/payments')}
                >
                  <DollarSign className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Pagamentos</div>
                    <div className="text-xs text-muted-foreground">Gerenciar pagamentos PIX</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
