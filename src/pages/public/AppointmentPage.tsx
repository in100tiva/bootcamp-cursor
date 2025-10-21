import { useAppointmentFlow } from '@/hooks/useAppointmentFlow'
import DateSelectionStep from '@/components/appointment/DateSelectionStep'
import ProfessionalSelectionStep from '@/components/appointment/ProfessionalSelectionStep'
import TimeSelectionStep from '@/components/appointment/TimeSelectionStep'
import PatientFormStep from '@/components/appointment/PatientFormStep'
import ConfirmationStep from '@/components/appointment/ConfirmationStep'

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agendar Consulta
          </h1>
          <p className="text-gray-600">
            Preencha as informações abaixo para agendar sua consulta
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 max-w-md mx-auto">
            <span>Data</span>
            <span>Profissional</span>
            <span>Horário</span>
            <span>Dados</span>
            <span>Confirmação</span>
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  )
}
