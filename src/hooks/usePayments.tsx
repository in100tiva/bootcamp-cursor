import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Payment } from '@/lib/supabase'

interface PaymentFilters {
  status?: string
  search?: string
  date?: string
}

export function usePayments(filters?: PaymentFilters) {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: async () => {
      let query = supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })

      // Filtrar por status
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      // Filtrar por busca (nome ou CPF)
      if (filters?.search) {
        query = query.or(`patient_name.ilike.%${filters.search}%,patient_cpf.ilike.%${filters.search}%`)
      }

      // Filtrar por data
      if (filters?.date) {
        const startOfDay = new Date(filters.date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(filters.date)
        endOfDay.setHours(23, 59, 59, 999)

        query = query
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString())
      }

      const { data, error } = await query

      if (error) throw error
      return data as Payment[]
    },
  })
}

export function usePaymentById(paymentId: string) {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single()

      if (error) throw error
      return data as Payment
    },
    enabled: !!paymentId,
  })
}

export function usePaymentMetrics() {
  return useQuery({
    queryKey: ['payment-metrics'],
    queryFn: async () => {
      const { data: payments, error } = await supabase
        .from('payments')
        .select('status, amount')

      if (error) throw error

      const totalPayments = payments?.length || 0
      const paidPayments = payments?.filter(p => p.status === 'PAID').length || 0
      const pendingPayments = payments?.filter(p => p.status === 'PENDING').length || 0
      const totalRevenue = payments?.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0) || 0

      return {
        totalPayments,
        paidPayments,
        pendingPayments,
        totalRevenue
      }
    },
  })
}

