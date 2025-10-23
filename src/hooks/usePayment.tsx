import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Payment } from '@/types'

interface CreatePaymentData {
  patient_name: string
  patient_email: string
  patient_cpf: string
  appointment_date: string
  appointment_time: string
  professional_id: string
}

export function usePayment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPayment = async (data: CreatePaymentData): Promise<Payment | null> => {
    setLoading(true)
    setError(null)

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const functionUrl = `${supabaseUrl}/functions/v1/create-pix-payment`

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar pagamento')
      }

      const result = await response.json()
      return result.payment
    } catch (err: any) {
      console.error('Erro ao criar pagamento:', err)
      setError(err.message || 'Erro ao criar pagamento')
      return null
    } finally {
      setLoading(false)
    }
  }

  const checkPaymentStatus = async (paymentId: string): Promise<Payment | null> => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const functionUrl = `${supabaseUrl}/functions/v1/check-payment-status`

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ payment_id: paymentId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao verificar status')
      }

      const result = await response.json()
      
      // A Edge Function agora retorna o payment completo
      if (result.payment) {
        return result.payment as Payment
      }
      
      return null
    } catch (err: any) {
      console.error('Erro ao verificar status:', err)
      setError(err.message || 'Erro ao verificar status')
      return null
    }
  }

  const getPayment = async (paymentId: string): Promise<Payment | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single()

      if (fetchError) throw fetchError
      return data as Payment
    } catch (err: any) {
      console.error('Erro ao buscar pagamento:', err)
      setError(err.message || 'Erro ao buscar pagamento')
      return null
    }
  }

  return {
    createPayment,
    checkPaymentStatus,
    getPayment,
    loading,
    error
  }
}

