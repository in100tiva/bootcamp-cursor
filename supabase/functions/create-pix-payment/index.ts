import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  patient_name: string
  patient_email: string
  patient_cpf: string
  appointment_date: string
  appointment_time: string
  professional_id: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { patient_name, patient_email, patient_cpf, appointment_date, appointment_time, professional_id } = await req.json() as PaymentRequest

    // Validação básica
    if (!patient_name || !patient_email || !patient_cpf) {
      return new Response(
        JSON.stringify({ error: 'Dados do paciente incompletos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Chamar API do Abacate Pay
    const abacatePayApiKey = Deno.env.get('ABACATE_PAY_API_KEY')
    const abacatePayBaseUrl = Deno.env.get('ABACATE_PAY_BASE_URL') || 'https://api.abacatepay.com/v1'

    if (!abacatePayApiKey) {
      throw new Error('ABACATE_PAY_API_KEY não configurada')
    }

    // Criar QR Code PIX no Abacate Pay - R$ 1,00 = 100 centavos
    const abacateResponse = await fetch(`${abacatePayBaseUrl}/pixQrCode/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abacatePayApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 100, // R$ 1,00 em centavos
        description: `Agendamento de consulta - ${patient_name}`,
        expiresIn: 900, // 15 minutos
        customer: {
          name: patient_name,
          cellphone: '',
          email: patient_email,
          taxId: patient_cpf.replace(/\D/g, '')
        }
      })
    })

    if (!abacateResponse.ok) {
      const errorText = await abacateResponse.text()
      console.error('Erro ao criar PIX no Abacate Pay:', errorText)
      throw new Error(`Erro ao criar pagamento PIX: ${errorText}`)
    }

    const abacateData = await abacateResponse.json()
    console.log('PIX criado com sucesso:', abacateData.data.id)

    // Salvar no banco de dados Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        abacate_pay_id: abacateData.data.id,
        amount: abacateData.data.amount,
        status: abacateData.data.status,
        qr_code_base64: abacateData.data.brCodeBase64,
        br_code: abacateData.data.brCode,
        expires_at: abacateData.data.expiresAt,
        patient_name,
        patient_email,
        patient_cpf,
        metadata: {
          appointment_date,
          appointment_time,
          professional_id
        }
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Erro ao salvar payment:', paymentError)
      throw paymentError
    }

    console.log('Payment salvo no banco:', payment.id)

    // Retornar dados do pagamento
    return new Response(
      JSON.stringify({
        success: true,
        payment: {
          id: payment.id,
          abacate_pay_id: payment.abacate_pay_id,
          amount: payment.amount,
          status: payment.status,
          qr_code_base64: payment.qr_code_base64,
          br_code: payment.br_code,
          expires_at: payment.expires_at
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Erro na função create-pix-payment:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno ao criar pagamento' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

