import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, User } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Clínica de Psicologia</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#sobre" className="text-gray-600 hover:text-gray-900">Sobre</a>
              <a href="#contato" className="text-gray-600 hover:text-gray-900">Contato</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Agende sua consulta online
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Agende sua consulta de forma rápida e fácil. Escolha a data, 
            profissional e horário que melhor se adequa à sua rotina.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Calendar className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Escolha a Data</h3>
              <p className="text-gray-600">Selecione o dia que melhor funciona para você</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <User className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Escolha o Profissional</h3>
              <p className="text-gray-600">Conheça nossos psicólogos especializados</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Escolha o Horário</h3>
              <p className="text-gray-600">Veja os horários disponíveis</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/agendar')}
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Agendar Consulta
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 Clínica de Psicologia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
