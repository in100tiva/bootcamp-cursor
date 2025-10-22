import { useProfessionalsForDate } from '@/hooks/useProfessionals'
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, Clock, Award, CheckCircle, AlertCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

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
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Escolha o profissional
            </h2>
            <p className="text-muted-foreground text-lg">
              Carregando profissionais disponíveis...
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
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

  if (error || !professionals || professionals.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Nenhum profissional disponível
            </h2>
            <p className="text-muted-foreground text-lg">
              Não há profissionais disponíveis para esta data.
            </p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Não encontramos profissionais disponíveis para a data selecionada. 
            Tente escolher outra data ou entre em contato conosco.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center">
          <Button variant="outline" onClick={prevStep} size="lg">
            Voltar e escolher outra data
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Escolha o profissional
          </h2>
          <p className="text-muted-foreground text-lg">
            Para {format(parseISO(data.selectedDate!), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
          <p className="text-sm text-muted-foreground">
            Selecione um dos profissionais disponíveis
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {professionals.map((professional) => {
          const schedule = professional.schedules?.[0]
          const isSelected = data.selectedProfessional === professional.id

          return (
            <Card 
              key={professional.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5 border-primary/20' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleProfessionalSelect(professional.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={professional.photo_url} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {professional.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {professional.name}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1">
                        <Award className="h-4 w-4" />
                        <span>{professional.specialty}</span>
                      </CardDescription>
                    </div>
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="bg-primary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Selecionado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {schedule?.start_time} - {schedule?.end_time}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      CRP: {professional.crp}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedProfessional && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedProfessional.photo_url} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedProfessional.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">
                  {selectedProfessional.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedProfessional.specialty} - CRP: {selectedProfessional.crp}
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
          disabled={!data.selectedProfessional}
          size="lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
