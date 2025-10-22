import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { ArrowLeft, Download, TrendingUp, Calendar, Users, BarChart3, PieChart } from 'lucide-react'
import { supabase, type Appointment, type Professional } from '../../lib/supabase'
import { toast } from 'sonner'

interface ReportData {
  totalAppointments: number
  pendingAppointments: number
  confirmedAppointments: number
  cancelledAppointments: number
  completedAppointments: number
  activeProfessionals: number
  appointmentsByProfessional: Array<{
    professional: string
    total: number
    pending: number
    confirmed: number
    cancelled: number
    completed: number
  }>
  appointmentsByMonth: Array<{
    month: string
    total: number
  }>
}

export default function ReportsPage() {
  const navigate = useNavigate()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [professionals, setProfessionals] = useState<Professional[]>([])

  useEffect(() => {
    loadReportData()
    loadProfessionals()
  }, [selectedPeriod])

  const loadReportData = async () => {
    try {
      setLoading(true)
      
      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(selectedPeriod))

      // Load appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          professional:professionals(name)
        `)
        .gte('appointment_date', startDate.toISOString().split('T')[0])
        .lte('appointment_date', endDate.toISOString().split('T')[0])

      if (appointmentsError) throw appointmentsError

      // Load professionals
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('professionals')
        .select('id, name, is_active')

      if (professionalsError) throw professionalsError

      // Process data
      const appointmentsList = appointments || []
      const professionalsList = professionalsData || []

      // Calculate metrics
      const totalAppointments = appointmentsList.length
      const pendingAppointments = appointmentsList.filter(a => a.status === 'pendente').length
      const confirmedAppointments = appointmentsList.filter(a => a.status === 'confirmado').length
      const cancelledAppointments = appointmentsList.filter(a => a.status === 'cancelado').length
      const completedAppointments = appointmentsList.filter(a => a.status === 'concluido').length
      const activeProfessionals = professionalsList.filter(p => p.is_active).length

      // Group by professional
      const appointmentsByProfessional = professionalsList.map(professional => {
        const professionalAppointments = appointmentsList.filter(a => a.professional_id === professional.id)
        return {
          professional: professional.name,
          total: professionalAppointments.length,
          pending: professionalAppointments.filter(a => a.status === 'pendente').length,
          confirmed: professionalAppointments.filter(a => a.status === 'confirmado').length,
          cancelled: professionalAppointments.filter(a => a.status === 'cancelado').length,
          completed: professionalAppointments.filter(a => a.status === 'concluido').length
        }
      })

      // Group by month
      const appointmentsByMonth = appointmentsList.reduce((acc: any[], appointment) => {
        const month = new Date(appointment.appointment_date).toLocaleDateString('pt-BR', { 
          month: 'short', 
          year: 'numeric' 
        })
        const existing = acc.find(item => item.month === month)
        if (existing) {
          existing.total += 1
        } else {
          acc.push({ month, total: 1 })
        }
        return acc
      }, [])

      setReportData({
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        cancelledAppointments,
        completedAppointments,
        activeProfessionals,
        appointmentsByProfessional,
        appointmentsByMonth
      })

    } catch (error: any) {
      toast.error('Erro ao carregar relatórios')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('id, name, is_active')
        .eq('is_active', true)

      if (error) throw error
      setProfessionals(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar profissionais:', error)
    }
  }

  const exportToCSV = () => {
    if (!reportData) return

    const csvContent = [
      ['Métrica', 'Valor'],
      ['Total de Consultas', reportData.totalAppointments.toString()],
      ['Consultas Pendentes', reportData.pendingAppointments.toString()],
      ['Consultas Confirmadas', reportData.confirmedAppointments.toString()],
      ['Consultas Canceladas', reportData.cancelledAppointments.toString()],
      ['Consultas Concluídas', reportData.completedAppointments.toString()],
      ['Profissionais Ativos', reportData.activeProfessionals.toString()],
      [''],
      ['Profissional', 'Total', 'Pendentes', 'Confirmadas', 'Canceladas', 'Concluídas'],
      ...reportData.appointmentsByProfessional.map(p => [
        p.professional,
        p.total.toString(),
        p.pending.toString(),
        p.confirmed.toString(),
        p.cancelled.toString(),
        p.completed.toString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success('Relatório exportado com sucesso!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
                <h1 className="text-2xl font-bold text-gray-900">
                  Relatórios
                </h1>
                <p className="text-gray-600">
                  Análise de dados e métricas da clínica
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportToCSV} className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Exportar CSV</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {reportData && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    Últimos {selectedPeriod} dias
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{reportData.pendingAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    Aguardando confirmação
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{reportData.confirmedAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    Consultas confirmadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profissionais Ativos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.activeProfessionals}</div>
                  <p className="text-xs text-muted-foreground">
                    Profissionais disponíveis
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5" />
                    <span>Distribuição por Status</span>
                  </CardTitle>
                  <CardDescription>
                    Consultas por status nos últimos {selectedPeriod} dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pendentes</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ 
                              width: `${reportData.totalAppointments > 0 ? (reportData.pendingAppointments / reportData.totalAppointments) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{reportData.pendingAppointments}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Confirmadas</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${reportData.totalAppointments > 0 ? (reportData.confirmedAppointments / reportData.totalAppointments) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{reportData.confirmedAppointments}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Canceladas</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ 
                              width: `${reportData.totalAppointments > 0 ? (reportData.cancelledAppointments / reportData.totalAppointments) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{reportData.cancelledAppointments}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Concluídas</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${reportData.totalAppointments > 0 ? (reportData.completedAppointments / reportData.totalAppointments) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{reportData.completedAppointments}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Performance por Profissional</span>
                  </CardTitle>
                  <CardDescription>
                    Consultas por profissional nos últimos {selectedPeriod} dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.appointmentsByProfessional.map((professional, index) => (
                      <div key={index} className="border-b pb-3 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{professional.professional}</span>
                          <span className="text-sm text-gray-600">{professional.total} consultas</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-yellow-600 font-medium">{professional.pending}</div>
                            <div className="text-gray-500">Pendentes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-green-600 font-medium">{professional.confirmed}</div>
                            <div className="text-gray-500">Confirmadas</div>
                          </div>
                          <div className="text-center">
                            <div className="text-red-600 font-medium">{professional.cancelled}</div>
                            <div className="text-gray-500">Canceladas</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-600 font-medium">{professional.completed}</div>
                            <div className="text-gray-500">Concluídas</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
