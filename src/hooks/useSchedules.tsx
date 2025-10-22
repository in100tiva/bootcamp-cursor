import { useState, useEffect } from 'react'
import { parseISO } from 'date-fns'
import { supabase, type Schedule } from '../lib/supabase'
import { toast } from 'sonner'

export function useSchedules(professionalId?: string) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)

  const loadSchedules = async (id?: string) => {
    if (!id) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('professional_id', id)
        .order('day_of_week', { ascending: true })

      if (error) throw error
      setSchedules(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar agendas:', error)
      toast.error('Erro ao carregar agendas')
    } finally {
      setLoading(false)
    }
  }

  const saveSchedules = async (professionalId: string, newSchedules: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>[]) => {
    setLoading(true)
    try {
      // Usar UPSERT para cada agenda individualmente
      for (const schedule of newSchedules) {
        const { error: upsertError } = await supabase
          .from('schedules')
          .upsert({
            professional_id: schedule.professional_id,
            day_of_week: schedule.day_of_week,
            is_enabled: schedule.is_enabled,
            start_time: schedule.start_time,
            end_time: schedule.end_time
          }, {
            onConflict: 'professional_id,day_of_week'
          })

        if (upsertError) {
          throw upsertError
        }
      }

      // Deletar agendas que não estão mais habilitadas
      const enabledDays = newSchedules.map(s => s.day_of_week)
      if (enabledDays.length > 0) {
        const { error: deleteError } = await supabase
          .from('schedules')
          .delete()
          .eq('professional_id', professionalId)
          .not('day_of_week', 'in', `(${enabledDays.join(',')})`)

        if (deleteError) {
          throw deleteError
        }
      } else {
        // Se não há dias habilitados, deletar todas as agendas
        const { error: deleteError } = await supabase
          .from('schedules')
          .delete()
          .eq('professional_id', professionalId)

        if (deleteError) {
          throw deleteError
        }
      }

      // Recarregar as agendas
      await loadSchedules(professionalId)
      toast.success('Agenda salva com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar agenda:', error)
      toast.error('Erro ao salvar agenda')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getAvailableTimes = (professionalId: string, date: string) => {
    // Usar parseISO para evitar problemas de fuso horário
    const dayOfWeek = parseISO(date).getDay()
    const professionalSchedule = schedules.find(s => 
      s.professional_id === professionalId && 
      s.day_of_week === dayOfWeek && 
      s.is_enabled
    )

    if (!professionalSchedule) return []

    const times = []
    const startHour = parseInt(professionalSchedule.start_time.split(':')[0])
    const endHour = parseInt(professionalSchedule.end_time.split(':')[0])

    for (let hour = startHour; hour < endHour; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`)
    }

    return times
  }

  const isProfessionalAvailable = (professionalId: string, dayOfWeek: number) => {
    return schedules.some(s => 
      s.professional_id === professionalId && 
      s.day_of_week === dayOfWeek && 
      s.is_enabled
    )
  }

  useEffect(() => {
    if (professionalId) {
      loadSchedules(professionalId)
    }
  }, [professionalId])

  return {
    schedules,
    loading,
    loadSchedules,
    saveSchedules,
    getAvailableTimes,
    isProfessionalAvailable
  }
}
