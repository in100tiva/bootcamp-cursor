# ⚡ Comandos Rápidos para Deploy

Guia com os comandos essenciais para fazer deploy do sistema em produção.

---

## 🔧 Pré-requisitos

### Instalar Supabase CLI

```powershell
# Windows (via Scoop)
scoop install supabase

# Ou baixar manualmente:
# https://github.com/supabase/cli/releases
```

### Instalar Vercel CLI (Opcional)

```powershell
npm install -g vercel
```

---

## 🚀 Deploy das Edge Functions

### 1. Login no Supabase

```bash
supabase login
```

### 2. Link com o Projeto

```bash
# Substitua YOUR_PROJECT_REF pelo ID do seu projeto
supabase link --project-ref YOUR_PROJECT_REF
```

**Como encontrar o PROJECT_REF:**
- Acesse o Supabase Dashboard
- Settings > General > Reference ID

### 3. Deploy de Todas as Functions

```bash
# Criar pagamento PIX
supabase functions deploy create-pix-payment

# Verificar status do pagamento
supabase functions deploy check-payment-status

# Webhook do Abacate Pay
supabase functions deploy webhook-abacate-pay
```

### 4. Ver URLs das Functions Deployadas

Após o deploy, as URLs serão:

```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-pix-payment
https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-payment-status
https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-abacate-pay
```

---

## 🌐 Deploy na Vercel

### Via Dashboard (Recomendado)

1. Acesse: https://vercel.com/new
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Clique em **Deploy**

### Via CLI

```bash
# Login
vercel login

# Deploy para produção
vercel --prod
```

---

## 📝 Configurar Variáveis de Ambiente

### No Supabase (Edge Functions)

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Settings > Edge Functions
4. Add new secret:
   - Nome: `ABACATE_PAY_API_KEY`
   - Valor: `abc_prod_QkKGJ5WWJP2atNTAZQuFYtxC`
   
   - Nome: `ABACATE_PAY_BASE_URL`
   - Valor: `https://api.abacatepay.com/v1`

### Na Vercel (Frontend)

1. Dashboard da Vercel > Seu Projeto
2. Settings > Environment Variables
3. Adicionar:
   - `VITE_SUPABASE_URL` = `https://YOUR_PROJECT_REF.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sua_anon_key_aqui`

**Onde encontrar essas chaves:**
- Supabase Dashboard > Settings > API

---

## 🔍 Monitoramento e Logs

### Ver logs das Edge Functions

```bash
# Webhook (em tempo real)
supabase functions logs webhook-abacate-pay --tail

# Criar pagamento
supabase functions logs create-pix-payment --tail

# Verificar status
supabase functions logs check-payment-status --tail
```

### Ver logs da Vercel

```bash
vercel logs
```

Ou acesse o Dashboard: Vercel > Seu Projeto > Logs

---

## 🔄 Atualizar Código

### Atualizar Frontend (Vercel)

```bash
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

A Vercel faz deploy automático!

### Atualizar Edge Functions

```bash
# Deploy apenas uma function específica
supabase functions deploy nome-da-function

# Exemplo: atualizar webhook
supabase functions deploy webhook-abacate-pay
```

---

## 🧪 Testar em Produção

### Teste do fluxo completo:

1. Acesse a URL de produção (Vercel)
2. Faça um agendamento
3. Gere o QR Code PIX
4. Verifique no Supabase > Table Editor > payments
5. (Opcional) Pague o PIX
6. Aguarde alguns segundos
7. Verifique se o status mudou para `PAID`
8. Verifique se o appointment foi criado

### Consultar dados no Supabase:

```bash
# Abrir console SQL
# Dashboard > SQL Editor

-- Ver todos os pagamentos
SELECT * FROM payments ORDER BY created_at DESC LIMIT 10;

-- Ver pagamentos pagos
SELECT * FROM payments WHERE status = 'PAID';

-- Ver appointments
SELECT * FROM appointments ORDER BY created_at DESC LIMIT 10;
```

---

## 🔧 Comandos Úteis

### Listar projects linkados

```bash
supabase projects list
```

### Deslinkar projeto atual

```bash
supabase unlink
```

### Ver status do projeto

```bash
supabase status
```

### Ver informações de uma function

```bash
supabase functions list
```

### Deletar uma function

```bash
supabase functions delete nome-da-function
```

---

## 🐛 Troubleshooting Rápido

### Erro: "Not logged in"

```bash
supabase login
```

### Erro: "Project not linked"

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### Erro: "Command not found: supabase"

Instale o Supabase CLI:
```bash
scoop install supabase
```

### Resetar configuração local

```bash
supabase unlink
supabase link --project-ref YOUR_PROJECT_REF
```

---

## 📋 Ordem de Execução (Deploy Inicial)

Execute nesta ordem:

1. **Configurar Variáveis no Supabase**
   - Dashboard > Settings > Edge Functions
   - Adicionar `ABACATE_PAY_API_KEY` e `ABACATE_PAY_BASE_URL`

2. **Deploy das Edge Functions**
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase functions deploy create-pix-payment
   supabase functions deploy check-payment-status
   supabase functions deploy webhook-abacate-pay
   ```

3. **Configurar Webhook no Abacate Pay**
   - Dashboard: https://app.abacatepay.com
   - URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-abacate-pay`
   - Eventos: `paid`, `expired`, `cancelled`

4. **Deploy do Frontend na Vercel**
   - Dashboard: https://vercel.com/new
   - Importar repositório
   - Adicionar variáveis de ambiente
   - Deploy

5. **Testar**
   - Acessar URL de produção
   - Fazer um agendamento completo
   - Verificar logs

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- `DEPLOY_PRODUCAO.md` - Guia completo passo a passo
- `CONFIGURAR_WEBHOOK_ABACATEPAY.md` - Como configurar o webhook
- `CHECKLIST_DEPLOY.md` - Checklist completo de deploy

---

## 🎉 Pronto!

Seu sistema está em produção! 🚀

