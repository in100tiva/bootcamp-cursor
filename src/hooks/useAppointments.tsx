import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Appointment } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function useAppointments(filters?: {
  date?: string
  professional?: string
  status?: string[]
}) {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          professionals!inner(
            name,
            specialty,
            crp
          )
        `)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })

      if (filters?.date) {
        query = query.eq('appointment_date', filters.date)
      }

      if (filters?.professional) {
        query = query.eq('professional_id', filters.professional)
      }

      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status)
      }

      const { data, error } = await query

      if (error) throw error
      return data as (Appointment & { professionals: any })[]
    },
  })
}

export function useAppointmentMetrics(date?: string) {
  return useQuery({
    queryKey: ['appointment-metrics', date],
    queryFn: async () => {
      const targetDate = date || new Date().toISOString().split('T')[0]
      
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('status')
        .eq('appointment_date', targetDate)

      if (appointmentsError) throw appointmentsError

      const { data: professionals, error: professionalsError } = await supabase
        .from('professionals')
        .select('id')
        .eq('is_active', true)

      if (professionalsError) throw professionalsError

      const totalAppointments = appointments?.length || 0
      const pendingAppointments = appointments?.filter(a => a.status === 'pendente').length || 0
      const confirmedAppointments = appointments?.filter(a => a.status === 'confirmado').length || 0
      const activeProfessionals = professionals?.length || 0

      return {
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        activeProfessionals,
      }
    },
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment-metrics'] })
      toast.success('Agendamento criado com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar agendamento')
    },
  })
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string
      updates: Partial<Appointment> 
    }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment-metrics'] })
      toast.success('Agendamento atualizado com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar agendamento')
    },
  })
}
