# Configuração de Agenda - Documentação

## Visão Geral

O sistema de configuração de agenda permite que administradores definam os dias e horários de disponibilidade para cada profissional. Esta configuração é essencial para que os pacientes possam fazer agendamentos através da interface pública.

## Componentes Principais

### 1. ScheduleConfig
Componente principal para configuração de agenda semanal.

**Localização**: `src/components/ScheduleConfig.tsx`

**Funcionalidades**:
- Interface visual para configurar cada dia da semana
- Switch para habilitar/desabilitar dias
- Seleção de horário de início e término
- Validação automática (horário de término > horário de início)
- Preview de quantos horários estarão disponíveis

### 2. ScheduleSummary
Componente para exibir resumo da agenda configurada.

**Localização**: `src/components/ScheduleSummary.tsx`

**Funcionalidades**:
- Mostra resumo compacto da agenda
- Agrupa dias com mesmos horários
- Exibe "Agenda não configurada" quando não há configuração

### 3. useSchedules Hook
Hook personalizado para gerenciar operações de agenda.

**Localização**: `src/hooks/useSchedules.tsx`

**Funcionalidades**:
- Carregar agendas existentes
- Salvar novas configurações
- Obter horários disponíveis para uma data
- Verificar disponibilidade de profissional

## Como Usar

### 1. Acessar Configuração de Agenda

1. Vá para a página "Profissionais" no painel administrativo
2. Clique no botão "Agenda" em qualquer profissional
3. Configure os dias e horários desejados
4. Clique em "Salvar Agenda"

### 2. Configuração de Dias

Para cada dia da semana:
- **Habilitar**: Ative o switch para permitir agendamentos neste dia
- **Horário de Início**: Selecione o horário de início (06:00 até 23:00)
- **Horário de Término**: Selecione o horário de término (deve ser após o início)

### 3. Validações Automáticas

- O horário de término é automaticamente ajustado se for menor que o início
- Apenas dias habilitados aparecem para agendamento público
- Horários são gerados em intervalos de 1 hora

## Estrutura do Banco de Dados

### Tabela: schedules

```sql
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
```

### Campos:
- `professional_id`: ID do profissional
- `day_of_week`: Dia da semana (0=domingo, 6=sábado)
- `is_enabled`: Se o dia está habilitado
- `start_time`: Horário de início (formato TIME)
- `end_time`: Horário de término (formato TIME)

## Integração com Agendamentos Públicos

### 1. Verificação de Disponibilidade

O sistema verifica automaticamente:
- Se o profissional está ativo
- Se o dia da semana está habilitado
- Se o horário está dentro do range configurado

### 2. Geração de Horários Disponíveis

Para cada dia configurado, o sistema gera slots de 1 hora:
- Exemplo: 09:00-18:00 = slots 09:00, 10:00, 11:00... 17:00

### 3. Filtros Automáticos

- Apenas profissionais com agenda configurada aparecem para seleção
- Apenas dias com disponibilidade aparecem no calendário
- Apenas horários disponíveis aparecem na lista

## Exemplos de Uso

### Configuração Básica
```
Segunda a Sexta: 09:00-18:00
Sábado: 09:00-12:00
Domingo: Não disponível
```

### Configuração Flexível
```
Segunda: 14:00-18:00
Terça: 09:00-12:00, 14:00-18:00
Quarta: 09:00-18:00
Quinta: 14:00-18:00
Sexta: 09:00-12:00
```

## Troubleshooting

### Problema: Profissional não aparece para agendamento
**Solução**: Verificar se:
1. Profissional está ativo
2. Pelo menos um dia da semana está configurado
3. Horários estão corretos

### Problema: Horários não aparecem
**Solução**: Verificar se:
1. Dia está habilitado
2. Horário de término > horário de início
3. Não há conflitos com agendamentos existentes

### Problema: Erro ao salvar agenda
**Solução**: Verificar se:
1. Profissional existe no banco
2. Conexão com Supabase está funcionando
3. Permissões RLS estão corretas

## Próximos Passos

1. **Notificações**: Integrar com sistema de notificações
2. **Exceções**: Permitir configuração de feriados e férias
3. **Recorrência**: Configurações mais complexas de horários
4. **Backup**: Sistema de backup das configurações
