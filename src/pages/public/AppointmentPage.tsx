import { useAppointmentFlow } from '@/hooks/useAppointmentFlow'
import DateSelectionStep from '@/components/appointment/DateSelectionStep'
import ProfessionalSelectionStep from '@/components/appointment/ProfessionalSelectionStep'
import TimeSelectionStep from '@/components/appointment/TimeSelectionStep'
import PatientFormStep from '@/components/appointment/PatientFormStep'
import ConfirmationStep from '@/components/appointment/ConfirmationStep'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ArrowLeft, Calendar, User, Clock, FileText, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AppointmentPage() {
  const { currentStep } = useAppointmentFlow()

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DateSelectionStep />
      case 2:
        return <ProfessionalSelectionStep />
      case 3:
        return <TimeSelectionStep />
      case 4:
        return <PatientFormStep />
      case 5:
        return <ConfirmationStep />
      default:
        return <DateSelectionStep />
    }
  }

  const stepTitles = [
    'Selecionar Data',
    'Escolher Profissional', 
    'Selecionar Horário',
    'Dados Pessoais',
    'Confirmação'
  ]

  const stepIcons = [Calendar, User, Clock, FileText, CheckCircle]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <a href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </a>
          </Button>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Agendar Consulta
            </h1>
            <p className="text-muted-foreground text-lg">
              Preencha as informações abaixo para agendar sua consulta
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Agendar Consulta</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Progress indicator */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Progresso do Agendamento</CardTitle>
            <CardDescription className="text-center">
              Passo {currentStep} de 5
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={(currentStep / 5) * 100} className="h-2" />
            
            <div className="flex items-center justify-between">
              {stepTitles.map((title, index) => {
                const Icon = stepIcons[index]
                const stepNumber = index + 1
                const isActive = stepNumber === currentStep
                const isCompleted = stepNumber < currentStep
                
                return (
                  <div key={stepNumber} className="flex flex-col items-center space-y-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-primary text-primary-foreground' 
                        : isActive 
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xs font-medium text-center max-w-20 ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {title}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step content */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
