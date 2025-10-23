# 🚀 Deploy do Sistema em Produção

Este guia vai te ajudar a colocar o sistema em produção com a API do Abacate Pay e deploy na Vercel.

## 📋 Pré-requisitos

- [ ] Conta Vercel
- [ ] Projeto Supabase configurado
- [ ] Chave API de produção do Abacate Pay: `abc_prod_QkKGJ5WWJP2atNTAZQuFYtxC`

---

## 🔧 PASSO 1: Configurar Variáveis de Ambiente no Supabase

### 1.1 - Acessar o Dashboard do Supabase

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral, clique em **Settings** > **Edge Functions**

### 1.2 - Adicionar Variáveis de Ambiente

Clique em **Add new secret** e adicione as seguintes variáveis:

| Nome da Variável | Valor |
|-----------------|-------|
| `ABACATE_PAY_API_KEY` | `abc_prod_QkKGJ5WWJP2atNTAZQuFYtxC` |
| `ABACATE_PAY_BASE_URL` | `https://api.abacatepay.com/v1` |

> **⚠️ IMPORTANTE:** Essas variáveis são usadas pelas Edge Functions do Supabase para se comunicar com o Abacate Pay.

---

## 🚀 PASSO 2: Deploy das Edge Functions do Supabase

### 2.1 - Instalar Supabase CLI (se ainda não instalou)

```bash
# Windows (PowerShell)
scoop install supabase

# Ou baixar direto:
# https://github.com/supabase/cli/releases
```

### 2.2 - Login no Supabase

```bash
supabase login
```

Isso vai abrir o navegador para você fazer login.

### 2.3 - Link com seu Projeto

```bash
# Substitua YOUR_PROJECT_REF pelo ref do seu projeto
# Você encontra o ref em: Settings > General > Reference ID
supabase link --project-ref YOUR_PROJECT_REF
```

### 2.4 - Deploy das Functions

```bash
# Deploy de todas as functions
supabase functions deploy create-pix-payment
supabase functions deploy check-payment-status
supabase functions deploy webhook-abacate-pay
```

### 2.5 - Verificar URLs das Functions

Após o deploy, anote as URLs das functions. Elas serão algo como:

```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-pix-payment
https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-payment-status
https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-abacate-pay
```

---

## 🔔 PASSO 3: Configurar Webhook no Abacate Pay

### 3.1 - Acessar Dashboard do Abacate Pay

1. Acesse [https://app.abacatepay.com](https://app.abacatepay.com)
2. Faça login com sua conta
3. No menu lateral, clique em **Configurações** > **Webhooks**

### 3.2 - Criar Novo Webhook

1. Clique em **Adicionar Webhook**
2. Preencha os campos:
   - **URL do Webhook**: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-abacate-pay`
   - **Eventos**: Selecione:
     - ✅ `pixQrCode.paid` (Pagamento confirmado)
     - ✅ `pixQrCode.expired` (Pagamento expirado)
     - ✅ `pixQrCode.cancelled` (Pagamento cancelado)
   - **Status**: Ativo

3. Clique em **Salvar**

### 3.3 - Testar Webhook (Opcional)

O Abacate Pay tem um botão "Testar Webhook" no dashboard. Use-o para verificar se está funcionando.

---

## 🌐 PASSO 4: Deploy do Frontend na Vercel

### 4.1 - Preparar o Build

Antes de fazer deploy, vamos garantir que está tudo configurado:

1. Verifique se o arquivo `.env.local` tem as variáveis corretas (não vamos comitar esse arquivo)

### 4.2 - Fazer Deploy na Vercel

**Opção A: Via Dashboard da Vercel (Recomendado para primeiro deploy)**

1. Acesse [https://vercel.com](https://vercel.com)
2. Clique em **Add New** > **Project**
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente (próximo passo)
5. Clique em **Deploy**

**Opção B: Via CLI**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 4.3 - Configurar Variáveis de Ambiente na Vercel

No dashboard da Vercel:

1. Vá para **Settings** > **Environment Variables**
2. Adicione as seguintes variáveis para **Production**:

| Nome da Variável | Valor | Descrição |
|-----------------|-------|-----------|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` | URL do seu projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | `sua_anon_key_aqui` | Chave pública do Supabase |

> **💡 Onde encontrar essas variáveis:**
> - Acesse o Supabase Dashboard
> - Vá em **Settings** > **API**
> - Copie `URL` e `anon/public key`

3. Após adicionar as variáveis, faça um **Redeploy**:
   - Vá em **Deployments**
   - Clique nos três pontinhos do último deploy
   - Clique em **Redeploy**

---

## ✅ PASSO 5: Verificar se está Funcionando

### 5.1 - Testar o Fluxo Completo

1. Acesse seu site na URL da Vercel (ex: `https://seu-projeto.vercel.app`)
2. Tente fazer um agendamento completo
3. Na etapa de pagamento, um QR Code PIX deve aparecer
4. Você pode usar o app do Abacate Pay para simular um pagamento
5. Após o pagamento, o webhook deve atualizar automaticamente o status

### 5.2 - Monitorar Logs

**Logs das Edge Functions (Supabase):**
```bash
supabase functions logs webhook-abacate-pay --tail
supabase functions logs create-pix-payment --tail
```

**Ou no Dashboard:**
- Supabase Dashboard > Edge Functions > Selecione a function > Logs

**Logs da Vercel:**
- Dashboard da Vercel > Seu projeto > Logs

### 5.3 - Checklist Final

- [ ] Frontend acessível na URL da Vercel
- [ ] Agendamento funciona até a tela de pagamento
- [ ] QR Code PIX é gerado corretamente
- [ ] Pagamento aparece na tabela `payments` do Supabase
- [ ] Webhook recebe notificações (verificar logs)
- [ ] Appointment é criado após pagamento confirmado

---

## 🐛 Troubleshooting

### Problema: QR Code não aparece

**Solução:**
1. Verifique os logs da Edge Function `create-pix-payment`
2. Confirme que a chave API está correta nas variáveis de ambiente do Supabase
3. Verifique se a URL base do Abacate Pay está correta

### Problema: Webhook não recebe notificações

**Solução:**
1. Verifique se a URL do webhook está correta no dashboard do Abacate Pay
2. Teste o webhook manualmente pelo dashboard
3. Verifique os logs da função `webhook-abacate-pay`
4. Confirme que os eventos corretos estão selecionados

### Problema: Appointment não é criado após pagamento

**Solução:**
1. Verifique os logs da função `webhook-abacate-pay`
2. Confirme que o pagamento existe na tabela `payments`
3. Verifique se o `payment_id` está correto
4. Confirme que não há erros de RLS (Row Level Security) no Supabase

---

## 📱 Testando com Pagamento Real

**⚠️ ATENÇÃO:** Com a API de produção, os pagamentos são REAIS. 

Para testar sem gastar dinheiro:

1. Use valores pequenos (ex: R$ 0,01 = 1 centavo)
2. Configure o valor no arquivo: `supabase/functions/create-pix-payment/index.ts`
3. Linha 51: `amount: 100` (altere para `amount: 1` para R$ 0,01)
4. Faça redeploy da function: `supabase functions deploy create-pix-payment`

---

## 🔄 Atualizações Futuras

Sempre que fizer mudanças no código:

**Frontend:**
```bash
git add .
git commit -m "Sua mensagem"
git push origin main
```
A Vercel vai fazer deploy automático.

**Edge Functions:**
```bash
supabase functions deploy nome-da-function
```

---

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs (Supabase e Vercel)
2. Consulte a documentação do Abacate Pay: https://docs.abacatepay.com
3. Consulte a documentação do Supabase: https://supabase.com/docs

---

## 🎉 Pronto!

Seu sistema está em produção! 🚀

Lembre-se de monitorar os logs regularmente e manter as dependências atualizadas.

