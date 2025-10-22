import { useQuery } from '@tanstack/react-query'
import { parseISO } from 'date-fns'
import { supabase } from '@/lib/supabase'
import type { Professional } from '@/lib/supabase'

export function useProfessionals() {
  return useQuery({
    queryKey: ['professionals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      return data as Professional[]
    },
  })
}

export function useProfessionalsForDate(selectedDate: string) {
  return useQuery({
    queryKey: ['professionals', 'date', selectedDate],
    queryFn: async () => {
      if (!selectedDate) return []

      // Usar parseISO para evitar problemas de fuso horário
      const dayOfWeek = parseISO(selectedDate).getDay()
      
      const { data, error } = await supabase
        .from('professionals')
        .select(`
          *,
          schedules!inner(
            day_of_week,
            is_enabled,
            start_time,
            end_time
          )
        `)
        .eq('is_active', true)
        .eq('schedules.day_of_week', dayOfWeek)
        .eq('schedules.is_enabled', true)

      if (error) throw error
      return data as (Professional & { schedules: any[] })[]
    },
    enabled: !!selectedDate,
  })
}
