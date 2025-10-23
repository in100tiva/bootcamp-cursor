# PRD - Sistema de Agendamentos para Clínica de Psicologia (MVP)

## 1. Visão Geral do Produto

### 1.1 Objetivo
Desenvolver um MVP de sistema de agendamentos online para clínica de psicologia, focado em facilitar o agendamento de consultas sem necessidade de login do paciente e gerenciamento centralizado pelo administrador.

### 1.2 Problema a Resolver
- Dificuldade de pacientes agendarem consultas de forma rápida e autônoma
- Falta de centralização no gerenciamento de agendamentos
- Necessidade de controle eficiente de disponibilidade dos profissionais

### 1.3 Público-Alvo
- **Primário**: Pacientes que desejam agendar consultas (sem necessidade de cadastro)
- **Secundário**: Administradores da clínica (gestão de agendamentos e profissionais)

---

## 2. Escopo do MVP

### 2.1 Funcionalidades Incluídas
✅ Página pública de agendamento (sem login)
✅ Sistema de autenticação para administradores
✅ Painel administrativo completo
✅ Cadastro e gestão de psicólogos
✅ Configuração de agenda por profissional
✅ Sistema de notificações por email
✅ Relatório básico de agendamentos
✅ Integração preparada para WhatsApp (botão de ação)

### 2.2 Funcionalidades Fora do Escopo (Futuras)
❌ Painel do paciente
❌ Remarcação/cancelamento pelo paciente
❌ Notificações automáticas 24h antes
❌ Integração automática com WhatsApp/Google Calendar
❌ Exceções de datas específicas (feriados/férias)
❌ Sistema de pagamento

---

## 3. Requisitos Funcionais

### 3.1 Módulo Público - Agendamento

#### 3.1.1 Fluxo de Agendamento
**Passo 1: Seleção de Data**
- Exibir calendário visual (date picker)
- Mostrar apenas datas com disponibilidade
- Datas sem profissionais disponíveis devem estar desabilitadas
- Permitir agendamento apenas com 24h de antecedência mínima

**Passo 2: Seleção de Profissional**
- Após selecionar data, exibir lista de profissionais disponíveis
- Informações exibidas por profissional:
  - Nome completo
  - Especialidade
  - CRP (número de registro)
- Apenas profissionais com status "Ativo" devem aparecer

**Passo 3: Seleção de Horário**
- Exibir lista de horários disponíveis do profissional selecionado
- Horários em intervalos de 1 hora
- Marcar horários já agendados como indisponíveis
- Duração padrão: 1 hora por consulta

**Passo 4: Dados do Paciente**
- Formulário com campos obrigatórios:
  - Nome completo
  - WhatsApp (formato: (XX) XXXXX-XXXX)
  - Email
  - CPF (validação básica de dígitos verificadores)
  - Tipo de consulta: Radio button (Primeira Consulta / Retorno)

**Passo 5: Confirmação**
- Exibir resumo do agendamento
- Botão "Confirmar Agendamento"
- Após confirmação:
  - Salvar no banco de dados com status "Pendente"
  - Enviar email de confirmação ao paciente
  - Exibir mensagem de sucesso com dados do agendamento

#### 3.1.2 Validações
- Impedir agendamento duplicado (mesmo profissional, data e horário)
- Validar formato de email
- Validar formato de telefone
- Validar CPF (dígitos verificadores)
- Verificar disponibilidade em tempo real antes de confirmar

#### 3.1.3 Controle de Requisições
- Implementar throttling/debouncing em requisições
- Controlar taxa de requisições para evitar exceder limites da Vercel
- Usar requisições micro-segmentadas por etapa do fluxo

---

### 3.2 Módulo Administrativo

#### 3.2.1 Autenticação
- Login via Supabase Auth
- Email + Senha
- Sessão persistente
- Logout seguro
- Recuperação de senha via email

#### 3.2.2 Dashboard (Tela Inicial)
**Cards de Métricas**
- Total de agendamentos do dia
- Agendamentos pendentes
- Agendamentos confirmados
- Total de profissionais ativos

**Lista de Agendamentos do Dia**
- Exibir agendamentos ordenados por horário
- Destacar agendamentos pendentes de confirmação
- Informações exibidas:
  - Horário
  - Nome do paciente
  - Nome do profissional
  - Status (badge colorido)
  - Botão ação WhatsApp

**Filtros Disponíveis**
- Por data (date picker)
- Por profissional (dropdown)
- Por status (multi-select: Pendente, Confirmado, Cancelado, Concluído)
- Botão "Limpar filtros"

#### 3.2.3 Gestão de Agendamentos
**Visualização**
- Lista completa de agendamentos
- Paginação (20 itens por página)
- Busca por nome de paciente ou CPF
- Ordenação por data/horário

**Ações Permitidas**
- ✅ Visualizar detalhes completos
- ✅ Editar (data, horário, status)
- ✅ Cancelar agendamento (até 12h antes)
- ✅ Alterar status manualmente
- ✅ Botão WhatsApp com mensagem pré-formatada
- ❌ Criar novo agendamento (apenas pacientes podem criar)

**Regras de Edição**
- Cancelamento permitido até 12h antes da consulta
- Ao cancelar ou editar, enviar email automático ao paciente
- Registrar histórico de alterações (quem, quando, o quê)

**Botão WhatsApp**
- Ao clicar, abrir WhatsApp Web/App com:
  - Número do paciente pré-preenchido
  - Mensagem padrão: "Olá [Nome], passando para confirma sua presença na consulta dia [Data] às [Hora]!"

#### 3.2.4 Gestão de Psicólogos
**Listagem**
- Tabela com todos os profissionais
- Colunas: Nome, CRP, Especialidade, Email, Telefone, Status
- Badge de status (Ativo/Inativo)
- Ações: Editar, Desativar/Ativar, Configurar Agenda

**Cadastro de Profissional**
Campos obrigatórios:
- Nome completo
- CRP (formato: XX/XXXXX)
- Email
- Telefone/WhatsApp
- Especialidade (campo texto livre)
- CPF
- Foto do profissional (upload)
  - Formatos aceitos: JPG, PNG
  - Tamanho máximo: 2MB
  - Processamento antes do upload:
    - Redimensionar para 400x400px
    - Converter para WebP
    - Comprimir para reduzir tamanho
    - Armazenar no Supabase Storage

**Desativação de Profissional**
- Ao desativar, exigir campo "Observação" (motivo)
- Profissionais inativos não aparecem para agendamento
- Manter agendamentos futuros já marcados
- Permitir reativação a qualquer momento

#### 3.2.5 Configuração de Agenda
**Interface de Configuração**
- Grade semanal (Segunda a Domingo)
- Cada dia com:
  - Switch (Habilitar/Desabilitar)
  - Quando habilitado, exibir:
    - Horário de início (dropdown: 06:00 até 22:00)
    - Horário de término (dropdown: 07:00 até 23:00)
- Validação: horário término > horário início

**Regras**
- Dias desabilitados = sem disponibilidade
- Horários gerados automaticamente em intervalos de 1h
- Exemplo: Início 09:00, Término 18:00 = slots 09:00, 10:00, 11:00... 17:00
- Salvamento individual por dia ou em lote

#### 3.2.6 Relatórios
**Relatório Básico - Agendamentos do Dia**
- Filtro por profissional (obrigatório)
- Informações exibidas:
  - Total de agendamentos
  - Por status (Pendente, Confirmado, Cancelado, Concluído)
  - Lista detalhada com horários
  - Taxa de ocupação (slots ocupados / slots disponíveis)
- Exportação para CSV

---

## 4. Requisitos Não-Funcionais

### 4.1 Performance
- Tempo de carregamento inicial < 3s
- Resposta de API < 500ms
- Otimização de imagens (WebP, lazy loading)
- Code splitting para reduzir bundle size

### 4.2 Segurança
- Autenticação via Supabase (JWT)
- Row Level Security (RLS) no Supabase
- Sanitização de inputs
- Validação server-side de todos os dados
- HTTPS obrigatório
- Rate limiting para prevenir abuso

### 4.3 Usabilidade
- Mobile First (prioridade para dispositivos móveis)
- Design responsivo (breakpoints: 320px, 768px, 1024px, 1440px)
- Interface intuitiva e minimalista
- Feedback visual para todas as ações
- Mensagens de erro claras e acionáveis

### 4.4 Acessibilidade
- Contraste de cores WCAG AA
- Navegação por teclado
- Labels em formulários
- Aria-labels em elementos interativos

### 4.5 Compatibilidade
- Navegadores: Chrome, Firefox, Safari, Edge (últimas 2 versões)
- Dispositivos: iOS 13+, Android 8+

---

## 5. Especificações Técnicas

### 5.1 Stack Tecnológica
**Frontend**
- React.js 18+ com TypeScript
- Vite ou Next.js (recomendado Next.js para SSR/SEO)
- Tailwind CSS para estilização
- Bibliotecas UI: Shadcn/ui ou Radix UI
- React Hook Form + Zod para validação
- Date-fns ou Day.js para manipulação de datas
- React Query para cache e estado servidor

**Backend/Database**
- Supabase
  - PostgreSQL (banco de dados)
  - Supabase Auth (autenticação)
  - Supabase Storage (armazenamento de imagens)
  - Row Level Security (RLS)
  - Edge Functions (se necessário)

**Hospedagem**
- Vercel (plano gratuito)
- Deploy automático via GitHub

**Notificações**
- Serviço de email: Resend ou SendGrid
- WhatsApp: Link direto (whatsapp://send ou wa.me)

### 5.2 Estrutura do Banco de Dados

```sql
-- Tabela: professionals
CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  crp VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  deactivation_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela: schedules (configuração de agenda)
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=domingo, 6=sábado
  is_enabled BOOLEAN DEFAULT false,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(professional_id, day_of_week)
);

-- Tabela: appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID REFERENCES professionals(id) ON DELETE RESTRICT,
  patient_name VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(20) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  patient_cpf VARCHAR(14) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  consultation_type VARCHAR(50) NOT NULL CHECK (consultation_type IN ('primeira_consulta', 'retorno')),
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'concluido')),
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(professional_id, appointment_date, appointment_time)
);

-- Tabela: appointment_history (auditoria)
CREATE TABLE appointment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id),
  action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'cancelled', 'status_changed'
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_professional ON appointments(professional_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_schedules_professional ON schedules(professional_id);
```

### 5.3 Row Level Security (RLS)

```sql
-- Habilitar RLS
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_history ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública (agendamento)
CREATE POLICY "Profissionais ativos são públicos"
  ON professionals FOR SELECT
  USING (is_active = true);

CREATE POLICY "Agendas de profissionais ativos são públicas"
  ON schedules FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM professionals 
    WHERE professionals.id = schedules.professional_id 
    AND professionals.is_active = true
  ));

-- Políticas para appointments (público pode criar)
CREATE POLICY "Qualquer um pode criar agendamento"
  ON appointments FOR INSERT
  WITH CHECK (true);

-- Políticas para admin (autenticado)
CREATE POLICY "Admin pode ver todos os profissionais"
  ON professionals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin pode gerenciar profissionais"
  ON professionals FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin pode ver todos os agendamentos"
  ON appointments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin pode atualizar agendamentos"
  ON appointments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin pode deletar agendamentos"
  ON appointments FOR DELETE
  TO authenticated
  USING (true);
```

### 5.4 Processamento de Imagens

```typescript
// Exemplo de função para processar imagem antes do upload
async function processImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      // Redimensionar para 400x400
      canvas.width = 400;
      canvas.height = 400;
      
      ctx?.drawImage(img, 0, 0, 400, 400);
      
      // Converter para WebP com qualidade 80%
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Falha ao processar imagem'));
        },
        'image/webp',
        0.8
      );
    };
    
    img.onerror = () => reject(new Error('Falha ao carregar imagem'));
    img.src = URL.createObjectURL(file);
  });
}
```

---

## 6. Interface do Usuário (UI/UX)

### 6.1 Design System
**Cores**
- Primária: #4F46E5 (Indigo)
- Secundária: #06B6D4 (Cyan)
- Sucesso: #10B981 (Green)
- Aviso: #F59E0B (Amber)
- Erro: #EF4444 (Red)
- Neutro: Escala de cinza (#F9FAFB até #111827)

**Tipografia**
- Fonte principal: Inter ou Manrope
- Tamanhos: 12px, 14px, 16px, 18px, 24px, 32px

**Espaçamento**
- Sistema baseado em 8px (8, 16, 24, 32, 48, 64)

### 6.2 Fluxo de Navegação

```
[Página Inicial Pública]
    ↓
[Seleção de Data] → [Seleção de Profissional] → [Seleção de Horário]
    ↓
[Dados do Paciente]
    ↓
[Confirmação] → [Sucesso]

---

[Login Admin]
    ↓
[Dashboard]
    ├─ [Agendamentos]
    │   ├─ Visualizar
    │   ├─ Editar
    │   └─ Cancelar
    ├─ [Psicólogos]
    │   ├─ Listar
    │   ├─ Cadastrar
    │   ├─ Editar
    │   └─ Configurar Agenda
    └─ [Relatórios]
```

### 6.3 Componentes Principais

**Página Pública**
- `<DatePicker />` - Calendário de seleção
- `<ProfessionalCard />` - Card com info do profissional
- `<TimeSlotList />` - Lista de horários
- `<PatientForm />` - Formulário de dados
- `<ConfirmationSummary />` - Resumo final

**Painel Admin**
- `<DashboardMetrics />` - Cards de métricas
- `<AppointmentTable />` - Tabela de agendamentos
- `<FilterBar />` - Barra de filtros
- `<ProfessionalForm />` - Formulário de cadastro
- `<ScheduleGrid />` - Grade de configuração de agenda
- `<StatusBadge />` - Badge de status

---

## 7. Sistema de Notificações

### 7.1 Email Templates

**Email de Confirmação de Agendamento**
```
Assunto: Consulta Agendada com Sucesso ✅

Olá [Nome do Paciente],

Sua consulta foi agendada com sucesso!

📅 Data: [Data]
🕐 Horário: [Horário]
👨‍⚕️ Profissional: [Nome] - [Especialidade]
📋 Tipo: [Primeira Consulta/Retorno]

Endereço da Clínica:
[Endereço - configurável no admin]

⚠️ Importante:
- Chegue com 10 minutos de antecedência
- Em caso de cancelamento, entre em contato com pelo menos 24h de antecedência
- Contato: [Telefone da clínica]

Até breve!
[Nome da Clínica]
```

**Email de Cancelamento**
```
Assunto: Consulta Cancelada

Olá [Nome do Paciente],

Informamos que sua consulta foi cancelada:

📅 Data: [Data]
🕐 Horário: [Horário]
👨‍⚕️ Profissional: [Nome]

Para reagendar, acesse: [Link do site]

Qualquer dúvida, entre em contato:
📞 [Telefone]

[Nome da Clínica]
```

**Email de Alteração**
```
Assunto: Consulta Reagendada

Olá [Nome do Paciente],

Sua consulta foi reagendada:

❌ Data/Horário Anterior: [Data Antiga] às [Horário Antigo]
✅ Nova Data/Horário: [Data Nova] às [Horário Novo]
👨‍⚕️ Profissional: [Nome]

Para confirmar, entre em contato:
📞 [Telefone]

[Nome da Clínica]
```

---

## 8. Validações e Regras de Negócio

### 8.1 Validações de Agendamento
- Data mínima: 24h a partir do momento atual
- Data máxima: 90 dias no futuro
- Horários apenas dentro da disponibilidade configurada
- Impedir conflitos de horário (mesmo profissional/data/hora)
- CPF: validar dígitos verificadores
- Email: validar formato RFC 5322
- Telefone: validar formato brasileiro (XX) XXXXX-XXXX

### 8.2 Regras de Cancelamento
- Admin pode cancelar até 12h antes da consulta
- Ao cancelar, status muda para "Cancelado"
- Email automático é enviado ao paciente
- Histórico de cancelamento é registrado
- Horário volta a ficar disponível

### 8.3 Regras de Edição
- Admin não pode editar:
  - CPF do paciente
  - Data de criação
- Admin pode editar:
  - Data e horário (respeitando disponibilidade)
  - Status
  - Dados de contato do paciente
- Qualquer edição gera registro no histórico

### 8.4 Regras de Status
- **Pendente**: Status inicial ao criar agendamento
- **Confirmado**: Admin confirma presença do paciente
- **Cancelado**: Admin cancela o agendamento
- **Concluído**: Consulta foi realizada

**Transições permitidas:**
- Pendente → Confirmado, Cancelado
- Confirmado → Concluído, Cancelado
- Cancelado → (final)
- Concluído → (final)

---

## 9. Métricas de Sucesso (KPIs)

### 9.1 MVP Launch
- [ ] Sistema online e funcional
- [ ] 0 erros críticos em produção
- [ ] Tempo de carregamento < 3s
- [ ] Taxa de conversão de agendamento > 70%

### 9.2 Pós-Launch (30 dias)
- Número de agendamentos realizados
- Taxa de cancelamento
- Taxa de confirmação
- Tempo médio de agendamento (do início ao fim)
- Taxa de ocupação dos profissionais

---

## 10. Cronograma e Entregáveis

### Fase 1 - Setup e Infraestrutura (Semana 1)
- [ ] Setup do projeto React + TypeScript
- [ ] Configuração Supabase (database, auth, storage)
- [ ] Estrutura de pastas e arquitetura
- [ ] Design system base (cores, tipografia, componentes)
- [ ] Deploy inicial na Vercel

### Fase 2 - Módulo Público (Semanas 2-3)
- [ ] Tela de seleção de data
- [ ] Tela de seleção de profissional
- [ ] Tela de seleção de horário
- [ ] Formulário de dados do paciente
- [ ] Tela de confirmação
- [ ] Integração com banco de dados
- [ ] Sistema de emails (confirmação)

### Fase 3 - Módulo Admin (Semanas 4-5)
- [ ] Sistema de autenticação
- [ ] Dashboard com métricas
- [ ] Gestão de agendamentos (CRUD)
- [ ] Sistema de filtros e busca
- [ ] Botão WhatsApp com mensagem padrão

### Fase 4 - Gestão de Profissionais (Semana 6)
- [ ] CRUD de profissionais
- [ ] Upload e processamento de fotos
- [ ] Sistema de ativação/desativação
- [ ] Configuração de agenda semanal

### Fase 5 - Refinamentos e Testes (Semana 7)
- [ ] Testes end-to-end
- [ ] Otimização de performance
- [ ] Ajustes de UX/UI
- [ ] Validações e tratamento de erros
- [ ] Documentação técnica

### Fase 6 - Deploy e Monitoramento (Semana 8)
- [ ] Deploy final em produção
- [ ] Configuração de monitoring (Sentry, Analytics)
- [ ] Testes em produção
- [ ] Treinamento do cliente
- [ ] Handoff e documentação

---

## 11. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Limite de requisições Vercel | Alta | Médio | Implementar throttling, cache agressivo, rate limiting |
| Conflitos de agendamento | Média | Alto | Validação em tempo real, locks no banco, transactions |
| Upload de imagens grandes | Média | Médio | Validação client-side, processamento antes do upload |
| Spam de agendamentos | Média | Alto | Rate limiting por IP, captcha futuro |
| Emails não entregues | Baixa | Médio | Usar serviço confiável (Resend/SendGrid), retry logic |

---

## 12. Próximos Passos (Pós-MVP)

### Fase 2 - Painel do Paciente
- Login/cadastro de pacientes
- Histórico de consultas
- Remarcação/cancelamento pelo paciente
- Documentos e prescrições

### Fase 3 - Automações
- Notificações WhatsApp 24h antes
- Lembretes automáticos
- Confirmação automática de presença
- Integração Google Calendar

### Fase 4 - Funcionalidades Avançadas
- Sistema de pagamento online
- Teleconsulta integrada
- Prontuário eletrônico básico
- Gestão de exceções de agenda (feriados, férias)
- Dashboard analítico completo

---

## 13. Contatos e Responsabilidades

**Product Owner**: [Nome]
**Tech Lead**: [Nome]
**Designer**: [Nome]
**QA**: [Nome]

**Aprovações Necessárias**:
- [ ] Aprovação do PRD pelo Product Owner
- [ ] Validação técnica pelo Tech Lead
- [ ] Review de UX pelo Designer
- [ ] Aprovação final do cliente

---

## 14. Anexos

### 14.1 Wireframes
[Links para Figma/Sketch com wireframes das principais telas]

### 14.2 Documentação Técnica
- [Link para documentação da API]
- [Link para guia de estilo de código]
- [Link para estrutura do projeto]

### 14.3 Referências
- Documentação Supabase: https://supabase.com/docs
- Documentação React: https://react.dev
- Documentação Vercel: https://vercel.com/docs

---

**Versão**: 1.0
**Data**: Outubro 2025
**Status**: Aguardando Aprovação
