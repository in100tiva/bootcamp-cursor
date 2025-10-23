# 🚀 Guia de Configuração - Pagamentos PIX via Abacate Pay

Este guia vai te ajudar a configurar completamente o sistema de pagamentos PIX no seu projeto.

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com/)
2. Conta no [Abacate Pay](https://abacatepay.com/)
3. Supabase CLI instalado: `npm install -g supabase`

## 🗄️ Passo 1: Configurar Banco de Dados

Execute a migration SQL no seu projeto Supabase:

```bash
# Via Supabase CLI (recomendado)
supabase db push

# OU via Supabase Dashboard
# Copie o conteúdo de supabase/migrations/add_payments_table.sql
# Cole no SQL Editor do Supabase Dashboard
# Execute o script
```

Isso vai:
- ✅ Criar a tabela `payments`
- ✅ Adicionar coluna `payment_id` na tabela `appointments`
- ✅ Atualizar o constraint de status dos appointments
- ✅ Configurar Row Level Security (RLS)

## ⚙️ Passo 2: Configurar Variáveis de Ambiente

### Frontend (.env.local)

Crie o arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

Encontre essas informações em: Supabase Dashboard → Settings → API

### Edge Functions

As Edge Functions recebem automaticamente as variáveis do Supabase. Configure a API Key do Abacate Pay:

1. No Supabase Dashboard, vá em: **Settings → Edge Functions → Environment Variables**
2. Adicione as seguintes variáveis:

```
ABACATE_PAY_API_KEY=abc_dev_n4LbGgxrHCFJRsZXQ4bBun2b
ABACATE_PAY_BASE_URL=https://api.abacatepay.com/v1
```

## 🚀 Passo 3: Deploy das Edge Functions

Execute os seguintes comandos para fazer deploy das functions:

```bash
# Link o projeto ao Supabase (primeira vez)
supabase link --project-ref seu-project-ref

# Deploy das Edge Functions
supabase functions deploy create-pix-payment
supabase functions deploy check-payment-status
supabase functions deploy webhook-abacate-pay
```

### Verificar Deploy

Após o deploy, você pode testar as functions:

```bash
# Listar functions deployadas
supabase functions list

# Ver logs em tempo real
supabase functions logs create-pix-payment
```

## 🔗 Passo 4: Configurar Webhook no Abacate Pay

1. Acesse o [Dashboard do Abacate Pay](https://dashboard.abacatepay.com/)
2. Vá em: **Configurações → Webhooks** (ou **Developers → Webhooks**)
3. Clique em **Adicionar Webhook** ou **New Webhook**
4. Configure:
   - **URL**: `https://seu-projeto.supabase.co/functions/v1/webhook-abacate-pay`
   - **Eventos**: Selecione:
     - ✅ `pixQrCode.paid` (Pagamento confirmado)
     - ✅ `pixQrCode.expired` (PIX expirado)
     - ✅ `pixQrCode.cancelled` (PIX cancelado - opcional)
5. Salve o webhook

### Encontrar a URL do seu projeto

```bash
# Via CLI
supabase status

# OU no Dashboard
# Supabase Dashboard → Settings → API → URL
```

## 🧪 Passo 5: Testar o Sistema

### Teste 1: Criar Pagamento

1. Acesse a aplicação: `http://localhost:5173`
2. Vá em **Agendar Consulta**
3. Preencha todos os passos até chegar no **Pagamento**
4. Verifique se o QR Code PIX aparece

### Teste 2: Simular Pagamento (Modo Dev)

Para testar em desenvolvimento, você pode simular o pagamento:

```bash
# Através do MCP do Abacate Pay ou via API diretamente
curl -X POST https://api.abacatepay.com/v1/pixQrCode/simulate-payment?id=SEU_PIX_ID \
  -H "Authorization: Bearer abc_dev_n4LbGgxrHCFJRsZXQ4bBun2b" \
  -H "Content-Type: application/json"
```

Ou use a ferramenta de simulação no Dashboard do Abacate Pay.

### Teste 3: Verificar no Admin

1. Faça login no painel admin: `http://localhost:5173/admin/login`
2. Vá em **Pagamentos**
3. Verifique se o pagamento aparece na lista
4. Verifique o status do pagamento

## 🔍 Verificar Logs

### Logs das Edge Functions

```bash
# Ver logs em tempo real
supabase functions logs webhook-abacate-pay --follow

# Ver logs de uma function específica
supabase functions logs create-pix-payment
```

### Logs do Frontend

Abra o Console do navegador (F12) para ver logs de requisições.

## 📊 Fluxo Completo

```
1. Usuário preenche dados do agendamento
   ↓
2. PaymentStep: Chama create-pix-payment Edge Function
   ↓
3. create-pix-payment: 
   - Chama API Abacate Pay
   - Salva payment no banco
   - Retorna QR Code
   ↓
4. Frontend: Exibe QR Code e inicia polling
   ↓
5. Usuário paga via PIX no app do banco
   ↓
6. Abacate Pay: Confirma pagamento e chama webhook
   ↓
7. webhook-abacate-pay:
   - Atualiza status do payment
   - Cria appointment com status 'pendente'
   ↓
8. Frontend: Detecta pagamento via polling
   ↓
9. ConfirmationStep: Busca appointment criado
   ↓
10. Sucesso! Redireciona para tela de confirmação
```

## 🐛 Troubleshooting

### Problema: QR Code não aparece

**Solução:**
1. Verifique se a Edge Function está deployada: `supabase functions list`
2. Verifique os logs: `supabase functions logs create-pix-payment`
3. Confirme se as variáveis de ambiente estão configuradas
4. Teste a API Key do Abacate Pay manualmente

### Problema: Pagamento não confirma automaticamente

**Solução:**
1. Verifique se o webhook está configurado corretamente no Abacate Pay
2. Veja os logs do webhook: `supabase functions logs webhook-abacate-pay`
3. Confirme que a URL do webhook está correta (sem trailing slash)
4. Teste o webhook manualmente via Dashboard do Abacate Pay

### Problema: Appointment não é criado após pagamento

**Solução:**
1. Verifique os logs do webhook
2. Confirme que a tabela `payments` tem RLS configurado corretamente
3. Verifique se o `payment_id` está sendo passado corretamente no metadata
4. Teste criar appointment manualmente pelo Supabase Dashboard

### Problema: Erro de CORS

**Solução:**
As Edge Functions já têm CORS configurado. Se ainda houver erro:
1. Limpe o cache do navegador
2. Reinicie o servidor de desenvolvimento
3. Verifique se está usando a URL correta do Supabase

## 📚 Recursos Adicionais

- [Documentação Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Documentação Abacate Pay](https://docs.abacatepay.com/)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)

## ✅ Checklist Final

Antes de ir para produção:

- [ ] Migration SQL executada com sucesso
- [ ] Variáveis de ambiente configuradas (frontend e Edge Functions)
- [ ] Edge Functions deployadas
- [ ] Webhook configurado no Abacate Pay
- [ ] Teste completo realizado (criar pagamento → pagar → confirmar)
- [ ] Painel admin acessível e mostrando pagamentos
- [ ] Logs das Edge Functions sem erros
- [ ] RLS configurado corretamente nas tabelas

## 🔒 Segurança

⚠️ **IMPORTANTE**: 
- ✅ Sempre use HTTPS em produção
- ✅ Nunca exponha a `ABACATE_PAY_API_KEY` no frontend
- ✅ Mantenha as Edge Functions atualizadas
- ✅ Configure RLS adequadamente no Supabase
- ✅ Use a Service Role Key apenas nas Edge Functions

## 💰 Custos

- **Supabase**: Plano gratuito inclui 500.000 Edge Function invocations/mês
- **Abacate Pay**: Taxa de 3.89% + R$ 0,40 por transação PIX
- Este projeto usa pagamentos de R$ 1,00 para teste

---

🎉 **Pronto!** Seu sistema de pagamentos PIX está configurado e funcionando!

Se tiver dúvidas, consulte os logs ou entre em contato com o suporte.

