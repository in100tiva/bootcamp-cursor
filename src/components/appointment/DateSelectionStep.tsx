import { useState } from 'react'
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow'

export default function DateSelectionStep() {
  const { data, setData, nextStep } = useAppointmentFlow()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    data.selectedDate ? new Date(data.selectedDate) : undefined
  )

  const today = startOfDay(new Date())
  const maxDate = addDays(today, 90) // Permitir agendamentos até 90 dias no futuro

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleContinue = () => {
    if (selectedDate) {
      setData({ selectedDate: format(selectedDate, 'yyyy-MM-dd') })
      nextStep()
    }
  }

  const isDateDisabled = (date: Date) => {
    // Desabilitar datas passadas e fins de semana (sábado = 6, domingo = 0)
    const dayOfWeek = date.getDay()
    return isBefore(date, today) || dayOfWeek === 0 || dayOfWeek === 6
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Escolha a data da consulta
        </h2>
        <p className="text-gray-600">
          Selecione uma data disponível para sua consulta
        </p>
      </div>

      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={isDateDisabled}
          fromDate={today}
          toDate={maxDate}
          locale={ptBR}
          className="rounded-md border"
        />
      </div>

      {selectedDate && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Data selecionada: {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={handleContinue}
          disabled={!selectedDate}
          className="w-full max-w-xs"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
