import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { useSchedules } from '../hooks/useSchedules'

interface ScheduleSummaryProps {
  professionalId: string
}

const DAYS_OF_WEEK = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
]

export default function ScheduleSummary({ professionalId }: ScheduleSummaryProps) {
  const { schedules, loading } = useSchedules(professionalId)
  const [summary, setSummary] = useState<string>('')

  useEffect(() => {
    if (schedules.length === 0) {
      setSummary('Agenda não configurada')
      return
    }

    const enabledDays = schedules.filter(s => s.is_enabled)
    
    if (enabledDays.length === 0) {
      setSummary('Nenhum dia configurado')
      return
    }

    const dayNames = enabledDays.map(s => DAYS_OF_WEEK[s.day_of_week])
    const timeRanges = enabledDays.map(s => `${s.start_time}-${s.end_time}`)
    
    // Agrupar por horários iguais
    const groupedByTime = enabledDays.reduce((acc, schedule) => {
      const timeKey = `${schedule.start_time}-${schedule.end_time}`
      if (!acc[timeKey]) {
        acc[timeKey] = []
      }
      acc[timeKey].push(DAYS_OF_WEEK[schedule.day_of_week])
      return acc
    }, {} as Record<string, string[]>)

    const summaryParts = Object.entries(groupedByTime).map(([timeRange, days]) => {
      return `${days.join(', ')}: ${timeRange}`
    })

    setSummary(summaryParts.join(' | '))
  }, [schedules])

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Clock className="w-4 h-4 animate-pulse" />
        <span>Carregando agenda...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <Clock className="w-4 h-4" />
      <span className="truncate" title={summary}>
        {summary}
      </span>
    </div>
  )
}
