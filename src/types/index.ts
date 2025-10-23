export interface User {
  id: string
  email?: string
  created_at: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export interface AppointmentStep {
  step: number
  data: {
    selectedDate?: string
    selectedProfessional?: string
    selectedTime?: string
    patientData?: {
      name: string
      phone: string
      email: string
      cpf: string
      consultation_type: 'primeira_consulta' | 'retorno'
    }
    payment_id?: string
  }
}

export interface Payment {
  id: string
  abacate_pay_id: string
  amount: number
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED'
  qr_code_base64: string
  br_code: string
  expires_at: string
  paid_at?: string
  patient_name: string
  patient_email: string
  patient_cpf: string
  metadata?: any
  created_at: string
  updated_at: string
}

export interface DashboardMetrics {
  totalAppointments: number
  pendingAppointments: number
  confirmedAppointments: number
  activeProfessionals: number
}

export interface FilterOptions {
  date?: string
  professional?: string
  status?: string[]
}

export interface ReportData {
  professional: string
  totalAppointments: number
  byStatus: {
    pendente: number
    confirmado: number
    cancelado: number
    concluido: number
  }
  occupancyRate: number
  appointments: Array<{
    time: string
    patient: string
    status: string
    type: string
  }>
}
