import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Professional {
  id: string
  name: string
  crp: string
  email: string
  phone: string
  specialty: string
  cpf: string
  photo_url?: string
  is_active: boolean
  deactivation_reason?: string
  created_at: string
  updated_at: string
}

export interface Schedule {
  id: string
  professional_id: string
  day_of_week: number // 0=domingo, 6=sábado
  is_enabled: boolean
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  professional_id: string
  patient_name: string
  patient_phone: string
  patient_email: string
  patient_cpf: string
  appointment_date: string
  appointment_time: string
  consultation_type: 'primeira_consulta' | 'retorno'
  status: 'aguardando_pagamento' | 'pendente' | 'confirmado' | 'cancelado' | 'concluido'
  cancellation_reason?: string
  payment_id?: string
  created_at: string
  updated_at: string
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

export interface AppointmentHistory {
  id: string
  appointment_id: string
  admin_id?: string
  action: 'created' | 'updated' | 'cancelled' | 'status_changed'
  old_value?: any
  new_value?: any
  created_at: string
}
