import { useProfessionalsForDate } from '@/hooks/useProfessionals'
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Clock, Award } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ProfessionalSelectionStep() {
  const { data, setData, nextStep, prevStep } = useAppointmentFlow()
  const { data: professionals, isLoading, error } = useProfessionalsForDate(data.selectedDate!)

  const handleProfessionalSelect = (professionalId: string) => {
    setData({ selectedProfessional: professionalId })
  }

  const handleContinue = () => {
    if (data.selectedProfessional) {
      nextStep()
    }
  }

  const selectedProfessional = professionals?.find(p => p.id === data.selectedProfessional)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Escolha o profissional
          </h2>
          <p className="text-gray-600">
            Carregando profissionais disponíveis...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error || !professionals || professionals.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Escolha o profissional
          </h2>
          <p className="text-red-600 mb-4">
            Não há profissionais disponíveis para esta data.
          </p>
          <Button variant="outline" onClick={prevStep}>
            Voltar e escolher outra data
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Escolha o profissional
        </h2>
        <p className="text-gray-600 mb-2">
          Para {format(parseISO(data.selectedDate!), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
        <p className="text-sm text-gray-500">
          Selecione um dos profissionais disponíveis
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {professionals.map((professional) => {
          const schedule = professional.schedules?.[0]
          const isSelected = data.selectedProfessional === professional.id

          return (
            <Card 
              key={professional.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleProfessionalSelect(professional.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{professional.name}</CardTitle>
                  </div>
                  {isSelected && (
                    <Badge variant="default">Selecionado</Badge>
                  )}
                </div>
                <CardDescription className="flex items-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>{professional.specialty}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {schedule?.start_time} - {schedule?.end_time}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    CRP: {professional.crp}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedProfessional && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <User className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">
              {selectedProfessional.name}
            </span>
          </div>
          <p className="text-sm text-blue-700">
            {selectedProfessional.specialty} - CRP: {selectedProfessional.crp}
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!data.selectedProfessional}
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
