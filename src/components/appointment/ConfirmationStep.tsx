import { useState, useEffect } from 'react'
import { useProfessionals } from '@/hooks/useProfessionals'
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Clock, User, Phone, Mail, CreditCard, FileText, CheckCircle, AlertCircle, PartyPopper } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export default function ConfirmationStep() {
  const { data, prevStep, reset } = useAppointmentFlow()
  const { data: professionals } = useProfessionals()
  const navigate = useNavigate()
  
  const [isLoading, setIsLoading] = useState(true)
  const [appointment, setAppointment] = useState<any>(null)
  
  const selectedProfessional = professionals?.find(p => p.id === data.selectedProfessional)
  const patientData = data.patientData!

  // Buscar appointment criado pelo webhook após pagamento
  useEffect(() => {
    if (data.payment_id) {
      checkAppointmentCreation()
    }
  }, [data.payment_id])

  const checkAppointmentCreation = async () => {
    if (!data.payment_id) {
      toast.error('ID de pagamento não encontrado')
      prevStep()
      return
    }

    setIsLoading(true)
    
    try {
      // Tentar buscar o appointment por até 30 segundos (polling)
      let attempts = 0
      const maxAttempts = 10
      
      const checkInterval = setInterval(async () => {
        attempts++
        
        const { data: appointmentData, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('payment_id', data.payment_id)
          .single()

        if (appointmentData) {
          clearInterval(checkInterval)
          setAppointment(appointmentData)
          setIsLoading(false)
          toast.success('Agendamento confirmado com sucesso!')
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval)
          setIsLoading(false)
          toast.error('Não foi possível confirmar o agendamento. Entre em contato conosco.')
        }
      }, 3000) // Verificar a cada 3 segundos

      // Limpar intervalo após timeout
      setTimeout(() => {
        clearInterval(checkInterval)
      }, 30000)
    } catch (error) {
      console.error('Erro ao verificar agendamento:', error)
      setIsLoading(false)
      toast.error('Erro ao verificar agendamento')
    }
  }

  const handleFinish = () => {
    navigate('/sucesso', { 
      state: { 
        appointment,
        professionalName: selectedProfessional?.name 
      } 
    })
    reset()
  }

  const getConsultationTypeLabel = (type: string) => {
    return type === 'primeira_consulta' ? 'Primeira consulta' : 'Consulta de retorno'
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Aguardando Confirmação
            </h2>
            <p className="text-muted-foreground text-lg">
              Estamos processando seu agendamento. Isso pode levar alguns segundos...
            </p>
          </div>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Seu pagamento foi confirmado. Aguarde enquanto finalizamos seu agendamento.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
          <PartyPopper className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Agendamento Confirmado!
          </h2>
          <p className="text-muted-foreground text-lg">
            Sua consulta foi agendada com sucesso
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dados do agendamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Dados do agendamento</span>
            </CardTitle>
            <CardDescription>
              Informações sobre sua consulta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Data:</span>
              <span className="text-sm text-foreground">
                {format(parseISO(data.selectedDate!), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Horário:</span>
              <span className="text-sm text-foreground">{data.selectedTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Profissional:</span>
              <span className="text-sm text-foreground">{selectedProfessional?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Especialidade:</span>
              <span className="text-sm text-foreground">{selectedProfessional?.specialty}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Tipo:</span>
              <Badge variant="secondary">
                {getConsultationTypeLabel(patientData.consultation_type)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Dados do paciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Dados do paciente</span>
            </CardTitle>
            <CardDescription>
              Suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Nome:</span>
              <span className="text-sm text-foreground">{patientData.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Telefone:</span>
              <span className="text-sm text-foreground flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>{patientData.phone}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Email:</span>
              <span className="text-sm text-foreground flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>{patientData.email}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">CPF:</span>
              <span className="text-sm text-foreground flex items-center space-x-1">
                <CreditCard className="h-3 w-3" />
                <span>{patientData.cpf}</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações importantes */}
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium text-green-800">Informações importantes:</p>
            <ul className="space-y-1 text-sm text-green-700">
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-600" />
                <span>Chegue com 15 minutos de antecedência</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-600" />
                <span>Traga um documento de identidade</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-600" />
                <span>Em caso de cancelamento, avise com 24h de antecedência</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-600" />
                <span>Você receberá um email de confirmação em breve</span>
              </li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleFinish}
          className="min-w-[200px]"
          size="lg"
        >
          Finalizar
        </Button>
      </div>
    </div>
  )
}
