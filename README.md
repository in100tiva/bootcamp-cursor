# 🏥 Sistema de Agendamento de Consultas

Sistema completo de agendamento de consultas com pagamento via PIX integrado ao Abacate Pay.

## ✨ Funcionalidades

### 👥 Área Pública
- ✅ Agendamento de consultas online
- ✅ Seleção de profissional, data e horário
- ✅ **Pagamento via PIX (QR Code)**
- ✅ Confirmação automática após pagamento
- ✅ Interface moderna e responsiva

### 🔐 Painel Administrativo
- ✅ Gerenciamento de consultas
- ✅ Cadastro de profissionais
- ✅ Configuração de horários
- ✅ **Gerenciamento de pagamentos**
- ✅ Relatórios e métricas
- ✅ Dashboard com estatísticas

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Pagamentos**: Abacate Pay (PIX)
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod

## 📦 Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Execute o projeto
npm run dev
```

## 💳 Integração de Pagamentos

Este projeto utiliza o **Abacate Pay** para processar pagamentos via PIX.

### Fluxo de Pagamento

1. Usuário preenche dados do agendamento
2. Sistema gera QR Code PIX de R$ 1,00
3. Usuário paga via app do banco
4. Pagamento é confirmado automaticamente (webhook)
5. Agendamento é criado no sistema
6. Usuário recebe confirmação

### Configuração

Siga o guia completo de configuração: **[SETUP_PAGAMENTOS.md](./SETUP_PAGAMENTOS.md)**

Resumo:
1. Execute a migration SQL
2. Configure variáveis de ambiente
3. Deploy das Edge Functions
4. Configure webhook no Abacate Pay

## 🚀 Deploy para Produção

### 📚 Documentação de Deploy

Criamos uma documentação completa para te ajudar a colocar o sistema em produção:

| Documento | Descrição | Para quem |
|-----------|-----------|-----------|
| **[GUIA_DEPLOY_INDEX.md](./GUIA_DEPLOY_INDEX.md)** | 📚 Índice com todos os guias | Comece aqui! |
| **[DEPLOY_PRODUCAO.md](./DEPLOY_PRODUCAO.md)** | 📖 Guia completo passo a passo | Iniciantes |
| **[COMANDOS_DEPLOY.md](./COMANDOS_DEPLOY.md)** | ⚡ Comandos rápidos | Experientes |
| **[CONFIGURAR_WEBHOOK_ABACATEPAY.md](./CONFIGURAR_WEBHOOK_ABACATEPAY.md)** | 🔔 Como configurar webhook | Todos |
| **[CHECKLIST_DEPLOY.md](./CHECKLIST_DEPLOY.md)** | ✅ Checklist interativo | Todos |
| **[DIFERENCA_DEV_PROD.md](./DIFERENCA_DEV_PROD.md)** | 🔄 Dev vs Produção | Iniciantes |

### 🎯 Quick Start para Deploy

**Para iniciantes:**
```bash
# 1. Leia o guia completo
# Abra: DEPLOY_PRODUCAO.md

# 2. Configure variáveis no Supabase Dashboard
# Settings > Edge Functions > Add secret

# 3. Deploy das Edge Functions
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy create-pix-payment
supabase functions deploy check-payment-status
supabase functions deploy webhook-abacate-pay

# 4. Configure webhook no Abacate Pay
# URL: https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-abacate-pay

# 5. Deploy do frontend na Vercel
# Acesse: https://vercel.com/new
# Importe o repositório e configure as variáveis de ambiente
```

**Para experientes:**
```bash
# Todos os comandos em COMANDOS_DEPLOY.md
```

### 🔑 API Key de Produção

A API key de produção do Abacate Pay é:
```
abc_prod_QkKGJ5WWJP2atNTAZQuFYtxC
```

⚠️ **IMPORTANTE:** Configure essa chave apenas nas variáveis de ambiente do Supabase. Nunca commite no Git!

### 📋 Checklist Rápido

Antes de ir para produção:
- [ ] Variáveis de ambiente configuradas no Supabase
- [ ] Edge Functions deployadas
- [ ] Webhook configurado no Abacate Pay
- [ ] Frontend deployado na Vercel
- [ ] Testado o fluxo completo em produção

**Mais detalhes:** [CHECKLIST_DEPLOY.md](./CHECKLIST_DEPLOY.md)

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- `professionals` - Profissionais cadastrados
- `schedules` - Horários disponíveis
- `appointments` - Agendamentos
- `payments` - Pagamentos PIX (nova)
- `appointment_history` - Histórico de alterações

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Deploy Edge Functions (Supabase CLI)
supabase functions deploy
```

## 📱 Páginas

### Públicas
- `/` - Home
- `/agendar` - Agendamento de consultas
- `/sucesso` - Confirmação de agendamento

### Administrativas
- `/admin/login` - Login do admin
- `/admin` - Dashboard
- `/admin/appointments` - Gerenciar consultas
- `/admin/professionals` - Gerenciar profissionais
- `/admin/payments` - **Gerenciar pagamentos (novo)**
- `/admin/reports` - Relatórios

## 🔒 Segurança

- ✅ Row Level Security (RLS) no Supabase
- ✅ API Key do Abacate Pay protegida em Edge Functions
- ✅ Autenticação obrigatória para área admin
- ✅ Validação de dados no frontend e backend

## 🧪 Testando Pagamentos

### Modo Desenvolvimento

Use a API key de desenvolvimento do Abacate Pay para testar:

```
ABACATE_PAY_API_KEY=abc_dev_n4LbGgxrHCFJRsZXQ4bBun2b
```

Você pode simular pagamentos através:
1. Dashboard do Abacate Pay
2. API de simulação
3. MCP do Abacate Pay

### Modo Produção

Configure a API key de produção e use PIX real.

## 📚 Documentação Adicional

- [Guia de Configuração de Pagamentos](./SETUP_PAGAMENTOS.md)
- [Variáveis de Ambiente](./ENV_SETUP.md)
- [PRD do Projeto](./PRD.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Para dúvidas sobre:
- **Sistema**: Abra uma issue no GitHub
- **Supabase**: [Documentação Supabase](https://supabase.com/docs)
- **Abacate Pay**: [Documentação Abacate Pay](https://docs.abacatepay.com/)

---

Desenvolvido com ❤️ durante o Bootcamp
