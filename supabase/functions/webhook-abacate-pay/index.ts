import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

serve(async (req) => {
  try {
    console.log('Webhook recebido do Abacate Pay')

    // Obter o body do webhook
    const payload = await req.json()
    console.log('Payload:', JSON.stringify(payload, null, 2))

    const { event, data } = payload

    // Validar evento
    if (!event || !data) {
      return new Response(
        JSON.stringify({ error: 'Payload inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Inicializar Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Processar eventos
    switch (event) {
      case 'pixQrCode.paid':
        await handlePaymentPaid(supabase, data)
        break
      
      case 'pixQrCode.expired':
        await handlePaymentExpired(supabase, data)
        break
      
      case 'pixQrCode.cancelled':
        await handlePaymentCancelled(supabase, data)
        break
      
      default:
        console.log(`Evento não tratado: ${event}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processado' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno ao processar webhook' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

async function handlePaymentPaid(supabase: any, data: any) {
  try {
    console.log('Processando pagamento confirmado:', data.id)

    // Buscar payment no banco
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('abacate_pay_id', data.id)
      .single()

    if (fetchError || !payment) {
      console.error('Payment não encontrado:', data.id)
      return
    }

    // Atualizar status do payment
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'PAID',
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id)

    if (updateError) {
      console.error('Erro ao atualizar payment:', updateError)
      throw updateError
    }

    console.log('Payment atualizado para PAID:', payment.id)

    // Verificar se já existe appointment
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('id')
      .eq('payment_id', payment.id)
      .single()

    if (existingAppointment) {
      console.log('Appointment já existe:', existingAppointment.id)
      return
    }

    // Criar appointment
    const metadata = payment.metadata || {}
    
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
    console.error('Erro em handlePaymentPaid:', error)
    throw error
  }
}

async function handlePaymentExpired(supabase: any, data: any) {
  try {
    console.log('Processando pagamento expirado:', data.id)

    const { error } = await supabase
      .from('payments')
      .update({
        status: 'EXPIRED',
        updated_at: new Date().toISOString()
      })
      .eq('abacate_pay_id', data.id)

    if (error) {
      console.error('Erro ao atualizar payment expirado:', error)
      throw error
    }

    console.log('Payment marcado como EXPIRED:', data.id)
  } catch (error) {
    console.error('Erro em handlePaymentExpired:', error)
    throw error
  }
}

async function handlePaymentCancelled(supabase: any, data: any) {
  try {
    console.log('Processando pagamento cancelado:', data.id)

    const { error } = await supabase
      .from('payments')
      .update({
        status: 'CANCELLED',
        updated_at: new Date().toISOString()
      })
      .eq('abacate_pay_id', data.id)

    if (error) {
      console.error('Erro ao atualizar payment cancelado:', error)
      throw error
    }

    console.log('Payment marcado como CANCELLED:', data.id)
  } catch (error) {
    console.error('Erro em handlePaymentCancelled:', error)
    throw error
  }
}

