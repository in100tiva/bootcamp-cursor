import { useState, useEffect, useRef } from 'react'
import { useAppointmentFlow } from '@/hooks/useAppointmentFlow'
import { usePayment } from '@/hooks/usePayment'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { QrCode, Copy, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Payment } from '@/types'

export default function PaymentStep() {
  const { data, prevStep, nextStep, setData } = useAppointmentFlow()
  const { createPayment, checkPaymentStatus, loading } = usePayment()
  
  const [payment, setPayment] = useState<Payment | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [checking, setChecking] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasCreatedPaymentRef = useRef(false)
  
  const patientData = data.patientData!

  // Criar pagamento ao montar o componente
  useEffect(() => {
    // Evitar criação duplicada no React.StrictMode
    if (hasCreatedPaymentRef.current) {
      return
    }
    
    hasCreatedPaymentRef.current = true
    handleCreatePayment()
    
    // Cleanup ao desmontar
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  // Iniciar polling quando payment for criado
  useEffect(() => {
    if (payment && payment.status === 'PENDING') {
      startPolling()
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [payment])

  // Timer para expiração
  useEffect(() => {
    if (payment && payment.status === 'PENDING') {
      const expiresAt = new Date(payment.expires_at).getTime()
      
      const updateTimer = () => {
        const now = Date.now()
        const diff = expiresAt - now
        
        if (diff <= 0) {
          setTimeLeft(0)
          if (diff < -1000) {
            setPayment(prev => prev ? { ...prev, status: 'EXPIRED' } : null)
          }
        } else {
          setTimeLeft(Math.floor(diff / 1000))
        }
      }

      updateTimer()
      const timerInterval = setInterval(updateTimer, 1000)

      return () => clearInterval(timerInterval)
    }
  }, [payment])

  const handleCreatePayment = async () => {
    if (!data.selectedDate || !data.selectedTime || !data.selectedProfessional || !patientData) {
      toast.error('Dados incompletos para criar pagamento')
      return
    }

    try {
      const newPayment = await createPayment({
        patient_name: patientData.name,
        patient_email: patientData.email,
        patient_cpf: patientData.cpf,
        appointment_date: data.selectedDate,
        appointment_time: data.selectedTime,
        professional_id: data.selectedProfessional,
      })

      if (newPayment) {
        setPayment(newPayment)
        toast.success('QR Code PIX gerado com sucesso!')
      } else {
        toast.error('Erro ao gerar QR Code PIX')
      }
    } catch (error) {
      console.error('Erro ao criar pagamento:', error)
      toast.error('Erro ao criar pagamento')
    }
  }

  const startPolling = () => {
    // Limpar intervalo anterior se existir
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    // Verificar status a cada 3 segundos
    pollingIntervalRef.current = setInterval(async () => {
      if (!payment) return

      setChecking(true)
      const updatedPayment = await checkPaymentStatus(payment.id)
      setChecking(false)

      if (updatedPayment) {
        setPayment(updatedPayment)

        if (updatedPayment.status === 'PAID') {
          // Pagamento confirmado!
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
          }
          
          toast.success('Pagamento confirmado! Redirecionando...')
          setData({ payment_id: payment.id })
          
          // Aguardar um pouco antes de avançar
          setTimeout(() => {
            nextStep()
          }, 1500)
        } else if (updatedPayment.status === 'EXPIRED') {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
          }
          toast.error('QR Code expirado. Por favor, tente novamente.')
        }
      }
    }, 3000) // 3 segundos
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Código PIX copiado!')
    } catch (error) {
      toast.error('Erro ao copiar código')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading || !payment) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-64 w-64" />
        </div>
      </div>
    )
  }

  if (payment.status === 'PAID') {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Pagamento Confirmado!
            </h2>
            <p className="text-muted-foreground text-lg">
              Seu pagamento foi confirmado. Redirecionando...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (payment.status === 'EXPIRED') {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              QR Code Expirado
            </h2>
            <p className="text-muted-foreground text-lg">
              O tempo para pagamento expirou. Por favor, tente novamente.
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep} size="lg">
            Voltar
          </Button>
          <Button onClick={handleCreatePayment} size="lg">
            Gerar Novo QR Code
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <QrCode className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Pagamento via PIX
          </h2>
          <p className="text-muted-foreground text-lg">
            Escaneie o QR Code ou copie o código PIX para realizar o pagamento
          </p>
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center space-x-2 text-lg">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <span className="text-muted-foreground">
          Expira em: <span className="font-bold text-foreground">{formatTime(timeLeft)}</span>
        </span>
        {checking && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
      </div>

      {/* Valor */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Valor do agendamento</p>
            <p className="text-4xl font-bold text-foreground">R$ 1,00</p>
          </div>
        </CardContent>
      </Card>

      {/* QR Code */}
      <div className="flex flex-col items-center space-y-4">
        <Card className="p-4 bg-white">
          <img
            src={payment.qr_code_base64}
            alt="QR Code PIX"
            className="w-64 h-64"
          />
        </Card>
        
        {/* Código Copia e Cola */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base">Código PIX (Copia e Cola)</CardTitle>
            <CardDescription>
              Copie o código abaixo e cole no seu app de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted rounded-md break-all text-sm font-mono">
              {payment.br_code}
            </div>
            <Button
              onClick={() => copyToClipboard(payment.br_code)}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar Código PIX
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Instruções */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Como pagar:</p>
            <ul className="space-y-1 text-sm ml-4">
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>Abra o app do seu banco</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>Escolha pagar com PIX</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>Escaneie o QR Code ou cole o código</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>Confirme o pagamento de R$ 1,00</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              Aguarde alguns segundos após o pagamento. A confirmação é automática.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} size="lg">
          Voltar
        </Button>
        <Button variant="ghost" disabled size="lg">
          Aguardando pagamento...
        </Button>
      </div>
    </div>
  )
}

