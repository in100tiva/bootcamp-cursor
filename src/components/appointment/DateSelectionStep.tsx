import { useState } from 'react'
import { format, addDays, isAfter, isBefore, startOfDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow'
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react'

export default function DateSelectionStep() {
  const { data, setData, nextStep } = useAppointmentFlow()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    data.selectedDate ? parseISO(data.selectedDate) : undefined
  )

  const today = startOfDay(new Date())
  const maxDate = addDays(today, 90) // Permitir agendamentos até 90 dias no futuro

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleContinue = () => {
    if (selectedDate) {
      // Usar startOfDay para garantir que a data seja tratada no fuso horário local
      const localDate = startOfDay(selectedDate)
      setData({ selectedDate: format(localDate, 'yyyy-MM-dd') })
      nextStep()
    }
  }

  const isDateDisabled = (date: Date) => {
    // Desabilitar datas passadas e fins de semana (sábado = 6, domingo = 0)
    const dayOfWeek = date.getDay()
    return isBefore(date, today) || dayOfWeek === 0 || dayOfWeek === 6
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <CalendarIcon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Escolha a data da consulta
          </h2>
          <p className="text-muted-foreground text-lg">
            Selecione uma data disponível para sua consulta
          </p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Agendamentos disponíveis de segunda a sexta-feira, com pelo menos 24h de antecedência.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Calendário de Disponibilidade</span>
          </CardTitle>
          <CardDescription>
            Clique em uma data para selecioná-la
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              fromDate={today}
              toDate={maxDate}
              locale={ptBR}
              className="rounded-lg border-0"
            />
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Data selecionada:</p>
              <p className="text-lg font-semibold text-foreground">
                {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={handleContinue}
          disabled={!selectedDate}
          size="lg"
          className="w-full max-w-sm"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
