import { z } from 'zod'

// Patient form validation
export const patientFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato de telefone inválido'),
  email: z.string().email('Email inválido'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  consultation_type: z.enum(['primeira_consulta', 'retorno']),
})

// Professional form validation
export const professionalFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  crp: z.string().regex(/^\d{2}\/\d{5}$/, 'CRP deve estar no formato XX/XXXXX'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato de telefone inválido'),
  specialty: z.string().min(3, 'Especialidade deve ter pelo menos 3 caracteres'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
})

// Schedule validation
export const scheduleFormSchema = z.object({
  day_of_week: z.number().min(0).max(6),
  is_enabled: z.boolean(),
  start_time: z.string(),
  end_time: z.string(),
}).refine((data) => {
  if (!data.is_enabled) return true
  return new Date(`2000-01-01T${data.end_time}`) > new Date(`2000-01-01T${data.start_time}`)
}, {
  message: 'Horário de término deve ser maior que o de início',
  path: ['end_time'],
})

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

// Appointment edit validation
export const appointmentEditSchema = z.object({
  appointment_date: z.string(),
  appointment_time: z.string(),
  status: z.enum(['pendente', 'confirmado', 'cancelado', 'concluido']),
  patient_name: z.string().min(3),
  patient_phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/),
  patient_email: z.string().email(),
  cancellation_reason: z.string().optional(),
})

export type PatientFormData = z.infer<typeof patientFormSchema>
export type ProfessionalFormData = z.infer<typeof professionalFormSchema>
export type ScheduleFormData = z.infer<typeof scheduleFormSchema>
export type LoginData = z.infer<typeof loginSchema>
export type AppointmentEditData = z.infer<typeof appointmentEditSchema>
