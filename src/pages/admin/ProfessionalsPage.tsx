import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { ArrowLeft, Search, Plus, Edit, Trash2, User, Mail, Phone, FileText, Shield, Calendar, Settings, Clock } from 'lucide-react'
import { supabase, type Professional, type Schedule } from '../../lib/supabase'
import ScheduleConfig from '../../components/ScheduleConfig'
import ScheduleSummary from '../../components/ScheduleSummary'
import { useSchedules } from '../../hooks/useSchedules'
import { toast } from 'sonner'

export default function ProfessionalsPage() {
  const navigate = useNavigate()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null)
  const [schedulingProfessional, setSchedulingProfessional] = useState<Professional | null>(null)
  const [savingSchedule, setSavingSchedule] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    crp: '',
    email: '',
    phone: '',
    specialty: '',
    cpf: '',
    is_active: true
  })

  useEffect(() => {
    loadProfessionals()
  }, [])

  const loadProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setProfessionals(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar profissionais')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProfessional = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('professionals')
        .insert([{
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])

      if (error) throw error
      
      toast.success('Profissional adicionado com sucesso!')
      setIsAddDialogOpen(false)
      resetForm()
      loadProfessionals()
    } catch (error: any) {
      toast.error('Erro ao adicionar profissional')
      console.error(error)
    }
  }

  const handleEditProfessional = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProfessional) return

    try {
      const { error } = await supabase
        .from('professionals')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProfessional.id)

      if (error) throw error
      
      toast.success('Profissional atualizado com sucesso!')
      setIsEditDialogOpen(false)
      setEditingProfessional(null)
      resetForm()
      loadProfessionals()
    } catch (error: any) {
      toast.error('Erro ao atualizar profissional')
      console.error(error)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .update({ 
          is_active: !currentStatus,
          deactivation_reason: !currentStatus ? 'Desativado pelo administrador' : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      
      toast.success(`Profissional ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`)
      loadProfessionals()
    } catch (error: any) {
      toast.error('Erro ao alterar status do profissional')
      console.error(error)
    }
  }

  const { saveSchedules } = useSchedules()

  const handleSaveSchedule = async (schedules: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>[]) => {
    if (!schedulingProfessional) return

    setSavingSchedule(true)
    try {
      await saveSchedules(schedulingProfessional.id, schedules)
      setIsScheduleDialogOpen(false)
      setSchedulingProfessional(null)
    } catch (error: any) {
      console.error(error)
    } finally {
      setSavingSchedule(false)
    }
  }

  const openScheduleDialog = (professional: Professional) => {
    setSchedulingProfessional(professional)
    setIsScheduleDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      crp: '',
      email: '',
      phone: '',
      specialty: '',
      cpf: '',
      is_active: true
    })
  }

  const openEditDialog = (professional: Professional) => {
    setEditingProfessional(professional)
    setFormData({
      name: professional.name,
      crp: professional.crp,
      email: professional.email,
      phone: professional.phone,
      specialty: professional.specialty,
      cpf: professional.cpf,
      is_active: professional.is_active
    })
    setIsEditDialogOpen(true)
  }

  const filteredProfessionals = professionals.filter(professional =>
    professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.crp.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando profissionais...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gerenciar Profissionais
                </h1>
                <p className="text-gray-600">
                  {filteredProfessionals.length} profissional(is) encontrado(s)
                </p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Profissional</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Profissional</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do novo profissional
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddProfessional} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crp">CRP</Label>
                    <Input
                      id="crp"
                      value={formData.crp}
                      onChange={(e) => setFormData({ ...formData, crp: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Especialidade</Label>
                    <Input
                      id="specialty"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Adicionar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou CRP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Professionals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{professional.name}</CardTitle>
                      <CardDescription>CRP: {professional.crp}</CardDescription>
                    </div>
                  </div>
                  <Badge className={professional.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {professional.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{professional.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{professional.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{professional.specialty}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">CPF: {professional.cpf}</span>
                  </div>
                  <ScheduleSummary professionalId={professional.id} />
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(professional)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openScheduleDialog(professional)}
                    className="flex-1"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Agenda
                  </Button>
                  <Button
                    size="sm"
                    variant={professional.is_active ? "destructive" : "default"}
                    onClick={() => handleToggleStatus(professional.id, professional.is_active)}
                    className="flex-1"
                  >
                    {professional.is_active ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredProfessionals.length === 0 && (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-8 text-center">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum profissional encontrado
                  </h3>
                  <p className="text-gray-600">
                    Tente ajustar o termo de busca ou adicione um novo profissional.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Profissional</DialogTitle>
            <DialogDescription>
              Atualize os dados do profissional
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProfessional} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-crp">CRP</Label>
              <Input
                id="edit-crp"
                value={formData.crp}
                onChange={(e) => setFormData({ ...formData, crp: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-specialty">Especialidade</Label>
              <Input
                id="edit-specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cpf">CPF</Label>
              <Input
                id="edit-cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule Configuration Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Configurar Agenda - {schedulingProfessional?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Configure os dias e horários de disponibilidade para este profissional
            </DialogDescription>
          </DialogHeader>
          <ScheduleConfig
            professionalId={schedulingProfessional?.id}
            onSave={handleSaveSchedule}
            onCancel={() => {
              setIsScheduleDialogOpen(false)
              setSchedulingProfessional(null)
            }}
            loading={savingSchedule}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
