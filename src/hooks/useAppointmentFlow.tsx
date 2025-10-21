import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AppointmentStep } from '@/types'

interface AppointmentFlowContextType {
  currentStep: number
  data: AppointmentStep['data']
  setStep: (step: number) => void
  setData: (data: Partial<AppointmentStep['data']>) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

const AppointmentFlowContext = createContext<AppointmentFlowContextType | undefined>(undefined)

export function AppointmentFlowProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setDataState] = useState<AppointmentStep['data']>({})

  const setStep = (step: number) => {
    setCurrentStep(step)
  }

  const setData = (newData: Partial<AppointmentStep['data']>) => {
    setDataState(prev => ({ ...prev, ...newData }))
  }

  const nextStep = () => {
    setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1))
  }

  const reset = () => {
    setCurrentStep(1)
    setDataState({})
  }

  const value = {
    currentStep,
    data,
    setStep,
    setData,
    nextStep,
    prevStep,
    reset,
  }

  return (
    <AppointmentFlowContext.Provider value={value}>
      {children}
    </AppointmentFlowContext.Provider>
  )
}

export function useAppointmentFlow() {
  const context = useContext(AppointmentFlowContext)
  if (context === undefined) {
    throw new Error('useAppointmentFlow must be used within an AppointmentFlowProvider')
  }
  return context
}
