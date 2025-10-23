import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { payment_id } = await req.json()

    if (!payment_id) {
      return new Response(
        JSON.stringify({ error: 'payment_id é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Buscar payment no banco
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', payment_id)
      .single()

    if (fetchError || !payment) {
      return new Response(
        JSON.stringify({ error: 'Pagamento não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Consultar status na API do Abacate Pay
    const abacatePayApiKey = Deno.env.get('ABACATE_PAY_API_KEY')
    const abacatePayBaseUrl = Deno.env.get('ABACATE_PAY_BASE_URL') || 'https://api.abacatepay.com/v1'

    if (!abacatePayApiKey) {
      throw new Error('ABACATE_PAY_API_KEY não configurada')
    }

    const abacateResponse = await fetch(
      `${abacatePayBaseUrl}/pixQrCode/check?id=${payment.abacate_pay_id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${abacatePayApiKey}`,
          'Content-Type': 'application/json',
        }
      }
    )

    if (!abacateResponse.ok) {
      const errorText = await abacateResponse.text()
      console.error('Erro ao consultar status no Abacate Pay:', errorText)
      throw new Error(`Erro ao consultar status: ${errorText}`)
    }

    const abacateData = await abacateResponse.json()
    const newStatus = abacateData.data.status

    // Atualizar status no banco se mudou
    if (newStatus !== payment.status) {
      console.log(`Atualizando status de ${payment.status} para ${newStatus}`)
      
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      // Se foi pago, salvar data de pagamento
      if (newStatus === 'PAID' && !payment.paid_at) {
        updateData.paid_at = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', payment_id)

      if (updateError) {
        console.error('Erro ao atualizar status:', updateError)
      }

      // Se o pagamento foi confirmado, criar o appointment
      if (newStatus === 'PAID') {
        await createAppointmentFromPayment(supabase, payment)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment: {
          id: payment.id,
          status: newStatus,
          paid_at: payment.paid_at
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Erro na função check-payment-status:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno ao verificar status' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function createAppointmentFromPayment(supabase: any, payment: any) {
  try {
    // Verificar se já existe appointment para este payment
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('id')
      .eq('payment_id', payment.id)
      .single()

    if (existingAppointment) {
      console.log('Appointment já existe para este pagamento:', existingAppointment.id)
      return
    }

    const metadata = payment.metadata || {}

    // Criar appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        professional_id: metadata.professional_id,
        appointment_date: metadata.appointment_date,
        appointment_time: metadata.appointment_time,
        patient_name: payment.patient_name,
        patient_phone: metadata.patient_phone || '',
        patient_email: payment.patient_email,
        patient_cpf: payment.patient_cpf,
        consultation_type: metadata.consultation_type || 'primeira_consulta',
        status: 'pendente',
        payment_id: payment.id
      })
      .select()
      .single()

    if (appointmentError) {
      console.error('Erro ao criar appointment:', appointmentError)
      throw appointmentError
    }

    console.log('Appointment criado com sucesso:', appointment.id)
  } catch (error) {
    console.error('Erro ao criar appointment a partir do pagamento:', error)
    throw error
  }
}

