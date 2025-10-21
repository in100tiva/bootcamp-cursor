import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { patientFormSchema, type PatientFormData } from '@/lib/validations'
import { useProfessionals } from '@/hooks/useProfessionals'
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Phone, Mail, CreditCard, Calendar, Clock } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function PatientFormStep() {
  const { data, setData, nextStep, prevStep } = useAppointmentFlow()
  const { data: professionals } = useProfessionals()
  
  const selectedProfessional = professionals?.find(p => p.id === data.selectedProfessional)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: data.patientData || {
      consultation_type: 'primeira_consulta'
    }
  })

  const consultationType = watch('consultation_type')

  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const onSubmit = (formData: PatientFormData) => {
    setData({ patientData: formData })
    nextStep()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Dados do paciente
        </h2>
        <p className="text-gray-600">
          Preencha seus dados para finalizar o agendamento
        </p>
      </div>

      {/* Resumo do agendamento */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Resumo do Agendamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700">
              {format(parseISO(data.selectedDate!), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700">{data.selectedTime}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700">{selectedProfessional?.name}</span>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Nome completo *</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Digite seu nome completo"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Telefone *</span>
            </Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="(11) 99999-9999"
              maxLength={15}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value)
                setValue('phone', formatted)
              }}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email *</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="seu@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* CPF */}
          <div className="space-y-2">
            <Label htmlFor="cpf" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>CPF *</span>
            </Label>
            <Input
              id="cpf"
              {...register('cpf')}
              placeholder="000.000.000-00"
              maxLength={14}
              onChange={(e) => {
                const formatted = formatCPF(e.target.value)
                setValue('cpf', formatted)
              }}
              className={errors.cpf ? 'border-red-500' : ''}
            />
            {errors.cpf && (
              <p className="text-sm text-red-600">{errors.cpf.message}</p>
            )}
          </div>
        </div>

        {/* Tipo de consulta */}
        <div className="space-y-2">
          <Label htmlFor="consultation_type">Tipo de consulta *</Label>
          <Select
            value={consultationType}
            onValueChange={(value: 'primeira_consulta' | 'retorno') => 
              setValue('consultation_type', value)
            }
          >
            <SelectTrigger className={errors.consultation_type ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione o tipo de consulta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primeira_consulta">Primeira consulta</SelectItem>
              <SelectItem value="retorno">Consulta de retorno</SelectItem>
            </SelectContent>
          </Select>
          {errors.consultation_type && (
            <p className="text-sm text-red-600">{errors.consultation_type.message}</p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep} type="button">
            Voltar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Processando...' : 'Continuar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
