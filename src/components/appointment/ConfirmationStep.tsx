import { useState } from 'react'
import { useProfessionals } from '@/hooks/useProfessionals'
import { useCreateAppointment } from '@/hooks/useAppointments'
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, Clock, User, Phone, Mail, CreditCard, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function ConfirmationStep() {
  const { data, prevStep, reset } = useAppointmentFlow()
  const { data: professionals } = useProfessionals()
  const createAppointment = useCreateAppointment()
  const navigate = useNavigate()
  
  const [isCreating, setIsCreating] = useState(false)
  
  const selectedProfessional = professionals?.find(p => p.id === data.selectedProfessional)
  const patientData = data.patientData!

  const handleConfirmAppointment = async () => {
    if (!data.selectedDate || !data.selectedTime || !data.selectedProfessional || !data.patientData) {
      toast.error('Dados incompletos para criar o agendamento')
      return
    }

    setIsCreating(true)
    
    try {
      const newAppointment = await createAppointment.mutateAsync({
        professional_id: data.selectedProfessional,
        appointment_date: data.selectedDate,
        appointment_time: data.selectedTime,
        patient_name: patientData.name,
        patient_phone: patientData.phone,
        patient_email: patientData.email,
        patient_cpf: patientData.cpf,
        consultation_type: patientData.consultation_type,
        status: 'pendente'
      })

      toast.success('Agendamento realizado com sucesso!')
      navigate('/sucesso', { 
        state: { 
          appointment: newAppointment,
          professionalName: selectedProfessional?.name 
        } 
      })
      reset()
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      toast.error('Erro ao criar agendamento. Tente novamente.')
    } finally {
      setIsCreating(false)
    }
  }

  const getConsultationTypeLabel = (type: string) => {
    return type === 'primeira_consulta' ? 'Primeira consulta' : 'Consulta de retorno'
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Confirmação do agendamento
          </h2>
          <p className="text-muted-foreground text-lg">
            Revise os dados antes de confirmar seu agendamento
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
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Informações importantes:</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                <span>Chegue com 15 minutos de antecedência</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                <span>Traga um documento de identidade</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                <span>Em caso de cancelamento, avise com 24h de antecedência</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                <span>Você receberá um email de confirmação</span>
              </li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} size="lg">
          Voltar
        </Button>
        <Button 
          onClick={handleConfirmAppointment}
          disabled={isCreating}
          className="min-w-[160px]"
          size="lg"
        >
          {isCreating ? 'Confirmando...' : 'Confirmar agendamento'}
        </Button>
      </div>
    </div>
  )
}
