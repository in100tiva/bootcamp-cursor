import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { ArrowLeft, Search, Filter, Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react'
import { supabase, type Appointment, type Professional } from '../../lib/supabase'
import { toast } from 'sonner'

export default function AppointmentsPage() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [professionalFilter, setProfessionalFilter] = useState('all')

  useEffect(() => {
    loadAppointments()
    loadProfessionals()
  }, [])

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          professional:professionals(name)
        `)
        .order('appointment_date', { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar consultas:', error)
      toast.error('Erro ao carregar consultas')
    } finally {
      setLoading(false)
    }
  }

  const loadProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('id, name')
        .eq('is_active', true)

      if (error) throw error
      setProfessionals(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar profissionais:', error)
    }
  }

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      
      toast.success('Status atualizado com sucesso!')
      loadAppointments()
    } catch (error: any) {
      toast.error('Erro ao atualizar status')
      console.error(error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pendente: 'bg-amber-100 text-amber-800 border-amber-200',
      confirmado: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelado: 'bg-red-100 text-red-800 border-red-200',
      concluido: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return variants[status as keyof typeof variants] || 'bg-muted text-muted-foreground border-muted'
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      pendente: 'Pendente',
      confirmado: 'Confirmado',
      cancelado: 'Cancelado',
      concluido: 'Concluído'
    }
    return labels[status as keyof typeof labels] || status
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patient_phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
    const matchesProfessional = professionalFilter === 'all' || appointment.professional_id === professionalFilter

    return matchesSearch && matchesStatus && matchesProfessional
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando consultas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Gerenciar Consultas
                </h1>
                <p className="text-muted-foreground">
                  {filteredAppointments.length} consulta(s) encontrada(s)
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary" />
              <span>Filtros</span>
            </CardTitle>
            <CardDescription>
              Filtre as consultas por diferentes critérios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>

              <Select value={professionalFilter} onValueChange={setProfessionalFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por profissional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os profissionais</SelectItem>
                  {professionals.map(professional => (
                    <SelectItem key={professional.id} value={professional.id}>
                      {professional.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{appointment.patient_name}</h3>
                        <p className="text-muted-foreground">
                          {(appointment as any).professional?.name || 'Profissional não encontrado'}
                        </p>
                      </div>
                      <Badge variant="secondary" className={getStatusBadge(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{appointment.appointment_time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{appointment.patient_phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{appointment.patient_email}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {appointment.consultation_type === 'primeira_consulta' ? 'Primeira Consulta' : 'Retorno'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        CPF: {appointment.patient_cpf}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {appointment.status === 'pendente' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmado')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelado')}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                    {appointment.status === 'confirmado' && (
                      <Button
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment.id, 'concluido')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Marcar como Concluído
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredAppointments.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhuma consulta encontrada
                </h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros para encontrar consultas.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
