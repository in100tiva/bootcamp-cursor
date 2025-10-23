# 🚀 Quick Start - Integração Abacate Pay

Guia rápido para colocar o sistema de pagamentos funcionando.

## ⚡ Setup Rápido (5 minutos)

### 1️⃣ Executar SQL no Supabase

1. Acesse: [Supabase Dashboard](https://app.supabase.com/)
2. Selecione seu projeto
3. Vá em: **SQL Editor** (menu lateral esquerdo)
4. Clique em **New Query**
5. Copie e cole o conteúdo de: `supabase/migrations/add_payments_table.sql`
6. Clique em **Run** ou pressione `Ctrl+Enter`
7. ✅ Aguarde a confirmação "Success"

### 2️⃣ Configurar Variáveis (Frontend)

Crie `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seuprojetoid.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

**Onde encontrar?**
- Supabase Dashboard → Settings → API
- Copie "Project URL" e "anon public"

### 3️⃣ Configurar Variáveis (Edge Functions)

1. Supabase Dashboard → Settings → Edge Functions
2. Clique em **Add environment variable**
3. Adicione:

```
Nome: ABACATE_PAY_API_KEY
Valor: abc_dev_n4LbGgxrHCFJRsZXQ4bBun2b

Nome: ABACATE_PAY_BASE_URL
Valor: https://api.abacatepay.com/v1
```

### 4️⃣ Deploy Edge Functions

```bash
# Instalar Supabase CLI (se ainda não tem)
npm install -g supabase

# Link com seu projeto
supabase login
supabase link --project-ref seu-project-ref

# Deploy das functions
supabase functions deploy create-pix-payment
supabase functions deploy check-payment-status
supabase functions deploy webhook-abacate-pay
```

**Seu project-ref está em:**
- URL do projeto: `https://[project-ref].supabase.co`
- Ou: Dashboard → Settings → General → Reference ID

### 5️⃣ Configurar Webhook

1. Acesse: [Abacate Pay Dashboard](https://dashboard.abacatepay.com/)
2. Vá em: **Developers** ou **Configurações** → **Webhooks**
3. Clique em **Novo Webhook** ou **Add Webhook**
4. Preencha:
   - URL: `https://seu-project-ref.supabase.co/functions/v1/webhook-abacate-pay`
   - Eventos: `pixQrCode.paid`, `pixQrCode.expired`
5. Salve

### 6️⃣ Testar!

```bash
# Iniciar aplicação
npm run dev

# Abrir no navegador
http://localhost:5173
```

1. Clique em **Agendar Consulta**
2. Preencha os dados
3. Chegue até o step de **Pagamento**
4. ✅ QR Code deve aparecer!

## 🧪 Testar Pagamento (Dev)

**Opção 1: Dashboard Abacate Pay**
1. Acesse o dashboard
2. Vá em Transações/PIX
3. Encontre o PIX gerado
4. Clique em "Simular Pagamento"

**Opção 2: API**
```bash
curl -X POST "https://api.abacatepay.com/v1/pixQrCode/simulate-payment?id=SEU_PIX_ID" \
  -H "Authorization: Bearer abc_dev_n4LbGgxrHCFJRsZXQ4bBun2b"
```

## ✅ Checklist

- [ ] SQL executado no Supabase
- [ ] `.env.local` criado
- [ ] Variáveis configuradas no Supabase
- [ ] Edge Functions deployadas
- [ ] Webhook configurado
- [ ] Teste realizado com sucesso

## ❌ Problemas Comuns

### QR Code não aparece
- Verifique o Console do navegador (F12)
- Confirme se Edge Function está deployada
- Teste a API Key do Abacate Pay

### Pagamento não confirma
- Verifique se webhook está configurado corretamente
- Veja os logs: `supabase functions logs webhook-abacate-pay`
- Confirme URL do webhook (sem `/` no final)

### Erro de permissão no banco
- Verifique se o SQL foi executado completamente
- Confirme RLS nas tabelas
- Teste criar payment manualmente

## 📖 Documentação Completa

Para mais detalhes: [SETUP_PAGAMENTOS.md](./SETUP_PAGAMENTOS.md)

---

🎉 **Pronto! Seu sistema está funcionando!**

