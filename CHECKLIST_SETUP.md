# ✅ Checklist - Setup do Sistema de Pagamentos

Use este checklist para garantir que tudo está configurado corretamente.

## 📋 Pré-requisitos

- [ ] Conta no Supabase criada
- [ ] Projeto no Supabase criado
- [ ] Conta no Abacate Pay criada
- [ ] Node.js instalado (v18+)
- [ ] Git instalado

## 🗄️ 1. Banco de Dados

- [ ] Abri o Supabase Dashboard
- [ ] Fui no SQL Editor
- [ ] Copiei o arquivo `supabase/migrations/add_payments_table.sql`
- [ ] Colei no SQL Editor
- [ ] Executei o SQL (cliquei em Run)
- [ ] Vi mensagem "Success"
- [ ] Verifiquei que a tabela `payments` foi criada (Table Editor)

## 🔧 2. Variáveis de Ambiente - Frontend

- [ ] Criei arquivo `.env.local` na raiz do projeto
- [ ] Adicionei `VITE_SUPABASE_URL`
- [ ] Adicionei `VITE_SUPABASE_ANON_KEY`
- [ ] Salvei o arquivo
- [ ] **NÃO** commitei o `.env.local` no git

**Como encontrar as chaves:**
- Supabase Dashboard → Settings → API
- URL: Copiar "Project URL"
- Anon Key: Copiar "anon public"

## ⚙️ 3. Variáveis de Ambiente - Supabase

- [ ] Abri Supabase Dashboard
- [ ] Fui em Settings → Edge Functions
- [ ] Cliquei em "Add environment variable"
- [ ] Adicionei `ABACATE_PAY_API_KEY`
- [ ] Adicionei `ABACATE_PAY_BASE_URL`
- [ ] Salvei as variáveis

**Valores:**
```
ABACATE_PAY_API_KEY=abc_dev_n4LbGgxrHCFJRsZXQ4bBun2b
ABACATE_PAY_BASE_URL=https://api.abacatepay.com/v1
```

## 🚀 4. Supabase CLI

- [ ] Instalei Supabase CLI: `npm install -g supabase`
- [ ] Fiz login: `supabase login`
- [ ] Linkei o projeto: `supabase link --project-ref meu-project-ref`
- [ ] Confirmo que deu certo (vi mensagem de sucesso)

**Onde encontrar project-ref:**
- Na URL: `https://[project-ref].supabase.co`
- Ou: Dashboard → Settings → General → Reference ID

## 📦 5. Deploy Edge Functions

- [ ] Executei: `supabase functions deploy create-pix-payment`
- [ ] Vi mensagem de sucesso
- [ ] Executei: `supabase functions deploy check-payment-status`
- [ ] Vi mensagem de sucesso
- [ ] Executei: `supabase functions deploy webhook-abacate-pay`
- [ ] Vi mensagem de sucesso
- [ ] Verifiquei: `supabase functions list`
- [ ] Vi as 3 functions listadas

## 🔗 6. Webhook Abacate Pay

- [ ] Abri Dashboard Abacate Pay
- [ ] Fui em Configurações → Webhooks (ou Developers → Webhooks)
- [ ] Cliquei em "Novo Webhook" ou "Add Webhook"
- [ ] Colei a URL: `https://meu-project.supabase.co/functions/v1/webhook-abacate-pay`
- [ ] Selecionei evento: `pixQrCode.paid`
- [ ] Selecionei evento: `pixQrCode.expired`
- [ ] Salvei o webhook
- [ ] Vi confirmação que foi criado

## 🧪 7. Teste Inicial

- [ ] Executei: `npm install`
- [ ] Executei: `npm run dev`
- [ ] Abri: `http://localhost:5173`
- [ ] Site carregou sem erros
- [ ] Não tem erros no Console (F12)

## 🎯 8. Teste do Fluxo de Pagamento

- [ ] Cliquei em "Agendar Consulta"
- [ ] Preenchi Step 1: Data
- [ ] Preenchi Step 2: Profissional
- [ ] Preenchi Step 3: Horário
- [ ] Preenchi Step 4: Dados Pessoais
- [ ] Cheguei no Step 5: **Pagamento**
- [ ] ✅ QR Code PIX apareceu!
- [ ] Vi o timer de expiração
- [ ] Vi o código "Copia e Cola"
- [ ] Botão de copiar funciona

## 💰 9. Teste de Pagamento (Dev)

**Escolha uma opção:**

### Opção A: Dashboard Abacate Pay
- [ ] Abri Dashboard Abacate Pay
- [ ] Fui em Transações/PIX
- [ ] Encontrei o PIX criado
- [ ] Cliquei em "Simular Pagamento"
- [ ] Vi confirmação

### Opção B: API (Terminal)
- [ ] Copiei o ID do PIX (aparece no Console do navegador)
- [ ] Executei comando de simulação
- [ ] Vi resposta de sucesso

## ✅ 10. Verificar Confirmação

- [ ] Frontend detectou pagamento automaticamente
- [ ] Fui redirecionado para Step 6: Confirmação
- [ ] Vi mensagem "Agendamento Confirmado!"
- [ ] Cliquei em "Finalizar"
- [ ] Fui para tela de sucesso

## 🔐 11. Teste Painel Admin

- [ ] Acessei: `http://localhost:5173/admin/login`
- [ ] Fiz login com credenciais admin
- [ ] Entrei no dashboard
- [ ] Cliquei em "Pagamentos"
- [ ] Vi a lista de pagamentos
- [ ] Vi o pagamento de teste
- [ ] Status está "Pago" (verde)
- [ ] Métricas estão corretas

## 📊 12. Verificações Finais

- [ ] Logs das Edge Functions sem erros
- [ ] Banco de dados tem payment criado
- [ ] Banco de dados tem appointment criado
- [ ] Appointment tem payment_id preenchido
- [ ] Filtros na página de pagamentos funcionam
- [ ] Busca por nome funciona
- [ ] Busca por CPF funciona

## 🎉 13. Pronto para Produção?

Antes de ir para produção:

- [ ] Trocar API Key do Abacate Pay para PRODUÇÃO
- [ ] Configurar domínio customizado
- [ ] Testar com PIX real (não simulado)
- [ ] Configurar email de confirmação (opcional)
- [ ] Fazer backup do banco de dados
- [ ] Documentar para equipe

## ❌ Resolução de Problemas

Se algo não funcionou, verifique:

### QR Code não aparece
- [ ] Verifiquei Console do navegador (F12) por erros
- [ ] Confirmo que Edge Function está deployada
- [ ] Verifiquei variáveis de ambiente do Supabase
- [ ] Testei API Key do Abacate Pay manualmente

### Pagamento não confirma
- [ ] Webhook está configurado corretamente
- [ ] URL do webhook está correta (sem / no final)
- [ ] Verifiquei logs: `supabase functions logs webhook-abacate-pay`
- [ ] Eventos corretos selecionados no Abacate Pay

### Erro no banco de dados
- [ ] SQL foi executado completamente
- [ ] Tabela `payments` existe
- [ ] Coluna `payment_id` existe em `appointments`
- [ ] RLS está configurado

### Edge Function com erro
- [ ] Deploy foi feito com sucesso
- [ ] Variáveis de ambiente configuradas
- [ ] Verifiquei logs da function
- [ ] Testei localmente se possível

## 📞 Precisa de Ajuda?

- [ ] Li o `SETUP_PAGAMENTOS.md`
- [ ] Li o `QUICK_START.md`
- [ ] Vi os logs das Edge Functions
- [ ] Procurei erro no Google
- [ ] Verifiquei documentação Supabase
- [ ] Verifiquei documentação Abacate Pay

## 📝 Notas

Use este espaço para anotar informações importantes:

**Project Ref:** _________________

**URL Webhook:** _________________

**Data do Setup:** _________________

**Problemas encontrados:** 
_________________________________
_________________________________
_________________________________

---

## ✅ Status Geral

Marque quando tudo estiver funcionando:

- [ ] ✅ **SISTEMA 100% FUNCIONAL!**

---

**Boa sorte! 🚀**

