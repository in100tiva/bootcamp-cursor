import { useAvailableTimes } from '@/hooks/useAvailableTimes'
import { useProfessionals } from '@/hooks/useProfessionals'
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock, User, AlertCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

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
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Escolha o horário
            </h2>
            <p className="text-muted-foreground text-lg">
              Carregando horários disponíveis...
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !availableTimes || availableTimes.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Nenhum horário disponível
            </h2>
            <p className="text-muted-foreground text-lg">
              Não há horários disponíveis para esta data e profissional.
            </p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Não encontramos horários disponíveis para a data e profissional selecionados. 
            Tente escolher outra data ou profissional.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center">
          <Button variant="outline" onClick={prevStep} size="lg">
            Voltar e escolher outra opção
          </Button>
        </div>
      </div>
    )
  }

  const availableSlots = availableTimes.filter(slot => slot.available)
  const unavailableSlots = availableTimes.filter(slot => !slot.available)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Escolha o horário
          </h2>
          <p className="text-muted-foreground text-lg">
            Para {format(parseISO(data.selectedDate!), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mt-2">
            <User className="h-4 w-4" />
            <span>{selectedProfessional?.name}</span>
          </div>
        </div>
      </div>

      {availableSlots.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Horários disponíveis</span>
              </CardTitle>
              <CardDescription>
                Selecione um horário para sua consulta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {availableSlots.map((slot) => {
                  const isSelected = data.selectedTime === slot.time
                  const nextTime = new Date(`2000-01-01T${slot.time}`)
                  nextTime.setMinutes(nextTime.getMinutes() + 50)
                  const endTime = nextTime.toTimeString().slice(0, 5)

                  return (
                    <Button
                      key={slot.time}
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleTimeSelect(slot.time)}
                      className={`h-auto p-4 flex flex-col items-center space-y-1 transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'hover:border-primary/50 hover:bg-primary/5'
                      }`}
                    >
                      <div className="font-semibold text-sm">{slot.time}</div>
                      <div className={`text-xs ${
                        isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                      }`}>
                        até {endTime}
                      </div>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {unavailableSlots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-muted-foreground">
                  Horários indisponíveis
                </CardTitle>
                <CardDescription>
                  Estes horários já estão ocupados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {unavailableSlots.map((slot) => {
                    const nextTime = new Date(`2000-01-01T${slot.time}`)
                    nextTime.setMinutes(nextTime.getMinutes() + 50)
                    const endTime = nextTime.toTimeString().slice(0, 5)

                    return (
                      <div
                        key={slot.time}
                        className="p-4 rounded-lg border border-muted bg-muted/50 text-sm font-medium text-muted-foreground flex flex-col items-center space-y-1"
                      >
                        <div className="font-semibold">{slot.time}</div>
                        <div className="text-xs text-muted-foreground">
                          até {endTime}
                        </div>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          Ocupado
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum horário disponível
          </h3>
          <p className="text-muted-foreground mb-6">
            Não há horários disponíveis para esta data e profissional.
          </p>
          <Button variant="outline" onClick={prevStep} size="lg">
            Voltar e escolher outra opção
          </Button>
        </div>
      )}

      {data.selectedTime && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Horário selecionado: {data.selectedTime}
                </p>
                <p className="text-sm text-muted-foreground">
                  Consulta de 50 minutos com {selectedProfessional?.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} size="lg">
          Voltar
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!data.selectedTime}
          size="lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
