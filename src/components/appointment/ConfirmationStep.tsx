import { useState } from 'react'
import { useProfessionals } from '@/hooks/useProfessionals'
import { useCreateAppointment } from '@/hooks/useAppointments'
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, Phone, Mail, CreditCard, FileText, CheckCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

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
      await createAppointment.mutateAsync({
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
      navigate('/sucesso')
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Confirmação do agendamento
        </h2>
        <p className="text-gray-600">
          Revise os dados antes de confirmar seu agendamento
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dados do agendamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Dados do agendamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Data:</span>
              <span className="text-sm text-gray-900">
                {format(parseISO(data.selectedDate!), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Horário:</span>
              <span className="text-sm text-gray-900">{data.selectedTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Profissional:</span>
              <span className="text-sm text-gray-900">{selectedProfessional?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Especialidade:</span>
              <span className="text-sm text-gray-900">{selectedProfessional?.specialty}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Tipo:</span>
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
              <User className="h-5 w-5" />
              <span>Dados do paciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Nome:</span>
              <span className="text-sm text-gray-900">{patientData.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Telefone:</span>
              <span className="text-sm text-gray-900 flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>{patientData.phone}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <span className="text-sm text-gray-900 flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>{patientData.email}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">CPF:</span>
              <span className="text-sm text-gray-900 flex items-center space-x-1">
                <CreditCard className="h-3 w-3" />
                <span>{patientData.cpf}</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações importantes */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Informações importantes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-amber-700">
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Chegue com 15 minutos de antecedência</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Traga um documento de identidade</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Em caso de cancelamento, avise com 24h de antecedência</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Você receberá um email de confirmação</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button 
          onClick={handleConfirmAppointment}
          disabled={isCreating}
          className="min-w-[160px]"
        >
          {isCreating ? 'Confirmando...' : 'Confirmar agendamento'}
        </Button>
      </div>
    </div>
  )
}
