import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { Clock, Calendar } from 'lucide-react'
import { type Schedule } from '../lib/supabase'
import { useSchedules } from '../hooks/useSchedules'

interface ScheduleConfigProps {
  professionalId?: string
  onSave: (schedules: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>[]) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

interface DaySchedule {
  day_of_week: number
  day_name: string
  is_enabled: boolean
  start_time: string
  end_time: string
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' }
]

const TIME_OPTIONS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6 // 06:00 até 23:00
  const timeString = hour.toString().padStart(2, '0') + ':00'
  return { value: timeString, label: timeString }
})

export default function ScheduleConfig({ professionalId, onSave, onCancel, loading = false }: ScheduleConfigProps) {
  const [schedules, setSchedules] = useState<DaySchedule[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const { schedules: existingSchedules, loading: loadingSchedules } = useSchedules(professionalId)


  useEffect(() => {
    // Inicializar com todos os dias desabilitados apenas se não há dados existentes
    if (existingSchedules.length === 0) {
      const initialSchedules = DAYS_OF_WEEK.map(day => ({
        day_of_week: day.value,
        day_name: day.label,
        is_enabled: false,
        start_time: '09:00',
        end_time: '18:00'
      }))
      setSchedules(initialSchedules)
    }
  }, [existingSchedules.length])

  useEffect(() => {
    // Sempre atualizar os schedules quando existingSchedules mudar
    const updatedSchedules = DAYS_OF_WEEK.map(day => {
      const existingSchedule = existingSchedules.find(s => s.day_of_week === day.value)
      
      // Converter formato de TIME (HH:MM:SS) para HH:MM
      const formatTime = (time: string | undefined) => {
        if (!time) return '09:00'
        // Se já está no formato HH:MM, retornar como está
        if (time.length === 5) return time
        // Se está no formato HH:MM:SS, remover os segundos
        if (time.length === 8) return time.substring(0, 5)
        return time
      }
      
      return {
        day_of_week: day.value,
        day_name: day.label,
        is_enabled: existingSchedule?.is_enabled || false,
        start_time: formatTime(existingSchedule?.start_time),
        end_time: formatTime(existingSchedule?.end_time)
      }
    })
    setSchedules(updatedSchedules)
  }, [existingSchedules])

  const handleDayToggle = (dayIndex: number, enabled: boolean) => {
    const newSchedules = [...schedules]
    newSchedules[dayIndex].is_enabled = enabled
    setSchedules(newSchedules)
    setHasChanges(true)
  }

  const handleTimeChange = (dayIndex: number, field: 'start_time' | 'end_time', value: string) => {
    const newSchedules = [...schedules]
    newSchedules[dayIndex][field] = value
    
    // Validar que end_time > start_time
    if (field === 'start_time' && newSchedules[dayIndex].end_time <= value) {
      // Ajustar end_time para ser 1 hora depois
      const startHour = parseInt(value.split(':')[0])
      const endHour = startHour + 1
      newSchedules[dayIndex].end_time = `${endHour.toString().padStart(2, '0')}:00`
    }
    
    setSchedules(newSchedules)
    setHasChanges(true)
  }

  const handleSave = async () => {
    const scheduleData = schedules
      .filter(schedule => schedule.is_enabled)
      .map(schedule => ({
        professional_id: professionalId || '',
        day_of_week: schedule.day_of_week,
        is_enabled: schedule.is_enabled,
        start_time: schedule.start_time,
        end_time: schedule.end_time
      }))
    
    await onSave(scheduleData)
    setHasChanges(false)
  }

  const handleCancel = () => {
    setHasChanges(false)
    onCancel()
  }

  const generateTimeSlots = (startTime: string, endTime: string) => {
    const slots = []
    const start = parseInt(startTime.split(':')[0])
    const end = parseInt(endTime.split(':')[0])
    
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
    }
    
    return slots
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Configuração de Agenda Semanal</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {schedules.map((schedule, index) => (
              <div key={schedule.day_of_week} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={schedule.is_enabled}
                      onCheckedChange={(checked) => handleDayToggle(index, checked)}
                    />
                    <Label className="text-base font-medium">
                      {schedule.day_name}
                    </Label>
                  </div>
                  {schedule.is_enabled && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {generateTimeSlots(schedule.start_time, schedule.end_time).length} horários disponíveis
                      </span>
                    </div>
                  )}
                </div>

                {schedule.is_enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`start-${index}`}>Horário de Início</Label>
                      <Select
                        value={schedule.start_time}
                        onValueChange={(value) => handleTimeChange(index, 'start_time', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map(time => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`end-${index}`}>Horário de Término</Label>
                      <Select
                        value={schedule.end_time}
                        onValueChange={(value) => handleTimeChange(index, 'end_time', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS
                            .filter(time => time.value > schedule.start_time)
                            .map(time => (
                              <SelectItem key={time.value} value={time.value}>
                                {time.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !hasChanges}
              className="min-w-[120px]"
            >
              {loading ? 'Salvando...' : 'Salvar Agenda'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
