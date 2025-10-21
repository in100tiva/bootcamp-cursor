import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface AvailableTime {
  time: string
  available: boolean
}

export function useAvailableTimes(selectedDate: string, professionalId: string) {
  return useQuery({
    queryKey: ['available-times', selectedDate, professionalId],
    queryFn: async (): Promise<AvailableTime[]> => {
      if (!selectedDate || !professionalId) return []

      const dayOfWeek = new Date(selectedDate).getDay()
      
      // Buscar horários disponíveis do profissional
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('schedules')
        .select('start_time, end_time')
        .eq('professional_id', professionalId)
        .eq('day_of_week', dayOfWeek)
        .eq('is_enabled', true)
        .single()

      if (scheduleError || !scheduleData) return []

      // Buscar agendamentos existentes para este profissional nesta data
      const { data: existingAppointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('professional_id', professionalId)
        .eq('appointment_date', selectedDate)
        .in('status', ['pendente', 'confirmado'])

      if (appointmentsError) throw appointmentsError

      const bookedTimes = new Set(
        existingAppointments?.map(apt => apt.appointment_time) || []
      )

      // Gerar slots de 50 minutos
      const slots: AvailableTime[] = []
      const startTime = new Date(`2000-01-01T${scheduleData.start_time}`)
      const endTime = new Date(`2000-01-01T${scheduleData.end_time}`)
      
      let currentTime = new Date(startTime)
      
      while (currentTime < endTime) {
        const timeString = currentTime.toTimeString().slice(0, 5)
        const nextTime = new Date(currentTime.getTime() + 50 * 60000) // 50 minutos
        
        // Verificar se o próximo slot ainda está dentro do horário de trabalho
        if (nextTime <= endTime) {
          slots.push({
            time: timeString,
            available: !bookedTimes.has(timeString)
          })
        }
        
        currentTime = nextTime
      }

      return slots
    },
    enabled: !!selectedDate && !!professionalId,
  })
}
