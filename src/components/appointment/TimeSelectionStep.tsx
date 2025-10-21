import { useAvailableTimes } from '@/hooks/useAvailableTimes'
import { useProfessionals } from '@/hooks/useProfessionals'
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, User } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function TimeSelectionStep() {
  const { data, setData, nextStep, prevStep } = useAppointmentFlow()
  const { data: availableTimes, isLoading, error } = useAvailableTimes(
    data.selectedDate!,
    data.selectedProfessional!
  )
  const { data: professionals } = useProfessionals()

  const selectedProfessional = professionals?.find(p => p.id === data.selectedProfessional)

  const handleTimeSelect = (time: string) => {
    setData({ selectedTime: time })
  }

  const handleContinue = () => {
    if (data.selectedTime) {
      nextStep()
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Escolha o horário
          </h2>
          <p className="text-gray-600">
            Carregando horários disponíveis...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error || !availableTimes || availableTimes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Escolha o horário
          </h2>
          <p className="text-red-600 mb-4">
            Não há horários disponíveis para esta data e profissional.
          </p>
          <Button variant="outline" onClick={prevStep}>
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  const availableSlots = availableTimes.filter(slot => slot.available)
  const unavailableSlots = availableTimes.filter(slot => !slot.available)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Escolha o horário
        </h2>
        <div className="space-y-1">
          <p className="text-gray-600">
            Para {format(parseISO(data.selectedDate!), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>{selectedProfessional?.name}</span>
          </div>
        </div>
      </div>

      {availableSlots.length > 0 ? (
        <>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Horários disponíveis</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {availableSlots.map((slot) => {
                const isSelected = data.selectedTime === slot.time
                const nextTime = new Date(`2000-01-01T${slot.time}`)
                nextTime.setMinutes(nextTime.getMinutes() + 50)
                const endTime = nextTime.toTimeString().slice(0, 5)

                return (
                  <button
                    key={slot.time}
                    onClick={() => handleTimeSelect(slot.time)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">{slot.time}</div>
                      <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                        até {endTime}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {unavailableSlots.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Horários indisponíveis
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {unavailableSlots.map((slot) => {
                  const nextTime = new Date(`2000-01-01T${slot.time}`)
                  nextTime.setMinutes(nextTime.getMinutes() + 50)
                  const endTime = nextTime.toTimeString().slice(0, 5)

                  return (
                    <div
                      key={slot.time}
                      className="p-3 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-400"
                    >
                      <div className="text-center">
                        <div className="font-semibold">{slot.time}</div>
                        <div className="text-xs text-gray-400">
                          até {endTime}
                        </div>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          Ocupado
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Não há horários disponíveis para esta data e profissional.
          </p>
          <Button variant="outline" onClick={prevStep}>
            Voltar e escolher outra opção
          </Button>
        </div>
      )}

      {data.selectedTime && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">
              Horário selecionado: {data.selectedTime}
            </span>
          </div>
          <p className="text-sm text-blue-700">
            Consulta de 50 minutos com {selectedProfessional?.name}
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!data.selectedTime}
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
