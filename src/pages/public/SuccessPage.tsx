import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Calendar, Clock, User, Mail, Phone, ArrowLeft } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agendamento Confirmado!
          </h1>
          <p className="text-gray-600">
            Seu agendamento foi realizado com sucesso. Você receberá um email de confirmação.
          </p>
        </div>

        {/* Informações do agendamento */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Detalhes do agendamento</span>
            </CardTitle>
            <CardDescription>
              Guarde estas informações para sua consulta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Data</p>
                  <p className="text-sm text-gray-900">--/--/----</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Horário</p>
                  <p className="text-sm text-gray-900">--:--</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Profissional</p>
                  <p className="text-sm text-gray-900">--</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos passos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Próximos passos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email de confirmação</p>
                  <p className="text-sm text-gray-600">
                    Você receberá um email com todos os detalhes do agendamento
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Lembrete</p>
                  <p className="text-sm text-gray-600">
                    Enviaremos um lembrete 24h antes da consulta
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Preparação</p>
                  <p className="text-sm text-gray-600">
                    Chegue com 15 minutos de antecedência e traga um documento de identidade
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/agendar">
              Fazer novo agendamento
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao início</span>
            </Link>
          </Button>
        </div>

        {/* Informações de contato */}
        <Card className="mt-8 bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-medium text-gray-900 mb-2">Precisa de ajuda?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Entre em contato conosco para dúvidas ou alterações no agendamento
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <Phone className="h-4 w-4 inline mr-2" />
                  (11) 99999-9999
                </p>
                <p className="text-sm text-gray-600">
                  <Mail className="h-4 w-4 inline mr-2" />
                  contato@clinica.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
