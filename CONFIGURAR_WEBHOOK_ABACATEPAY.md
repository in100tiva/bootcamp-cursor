# 🔔 Como Configurar o Webhook no Abacate Pay

Este guia mostra passo a passo como configurar o webhook no ambiente de **PRODUÇÃO** do Abacate Pay.

---

## 📍 Por que o Webhook é Importante?

O webhook permite que o Abacate Pay notifique automaticamente o seu sistema quando:
- Um pagamento é confirmado ✅
- Um pagamento expira ⏰
- Um pagamento é cancelado ❌

Sem o webhook, você precisaria ficar consultando a API manualmente para saber se o pagamento foi pago.

---

## 🚀 Passo a Passo

### 1. Acessar o Dashboard do Abacate Pay

Acesse: [https://app.abacatepay.com](https://app.abacatepay.com)

Faça login com suas credenciais de produção.

---

### 2. Navegar até Webhooks

No menu lateral, procure por:
- **Configurações** ou **Settings**
- Depois clique em **Webhooks**

*(A localização exata pode variar dependendo da versão do dashboard)*

---

### 3. Criar Novo Webhook

Clique no botão **"Adicionar Webhook"** ou **"Novo Webhook"**.

---

### 4. Preencher os Dados do Webhook

Você verá um formulário. Preencha assim:

#### 📌 URL do Webhook

```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-abacate-pay
```

**⚠️ IMPORTANTE:** Substitua `YOUR_PROJECT_REF` pela referência do seu projeto no Supabase.

**Como encontrar o YOUR_PROJECT_REF:**
1. Acesse o Supabase Dashboard
2. Vá em **Settings** > **General**
3. Procure por **Reference ID**
4. Copie o código (algo como: `abcdefghijklmnop`)

**Exemplo de URL completa:**
```
https://abcdefghijklmnop.supabase.co/functions/v1/webhook-abacate-pay
```

---

#### 📌 Eventos

Selecione os seguintes eventos (marque todos):

- ✅ **pixQrCode.paid** - Quando o pagamento é confirmado
- ✅ **pixQrCode.expired** - Quando o QR Code expira
- ✅ **pixQrCode.cancelled** - Quando o pagamento é cancelado

---

#### 📌 Status

- Deixe como **Ativo** ou **Enabled**

---

#### 📌 Descrição (Opcional)

Você pode adicionar uma descrição para lembrar para que serve:

```
Webhook para sistema de agendamentos - Produção
```

---

### 5. Salvar o Webhook

Clique em **Salvar** ou **Criar Webhook**.

O webhook será criado e você verá ele na lista de webhooks ativos.

---

## ✅ Testar o Webhook

### Opção 1: Teste Manual no Dashboard

Muitas plataformas oferecem um botão **"Testar Webhook"** no dashboard.

1. Localize o webhook que você acabou de criar
2. Clique em **Testar** ou **Test**
3. Isso enviará uma requisição de teste para sua URL

### Opção 2: Fazer um Pagamento Real de Teste

1. Acesse seu sistema de agendamentos
2. Faça um agendamento completo
3. Gere o QR Code PIX
4. Pague com um valor pequeno (ex: R$ 1,00)
5. Aguarde a confirmação do pagamento
6. Verifique os logs no Supabase

---

## 🔍 Como Verificar se o Webhook Está Funcionando

### Método 1: Logs do Supabase

1. Acesse o Supabase Dashboard
2. Vá em **Edge Functions**
3. Selecione `webhook-abacate-pay`
4. Clique em **Logs**

Você deve ver logs como:
```
Webhook recebido do Abacate Pay
Payload: { event: "pixQrCode.paid", data: {...} }
Processando pagamento confirmado: pix_123abc
Payment atualizado para PAID: pay_456def
Appointment criado com sucesso: apt_789ghi
```

### Método 2: Verificar no Banco de Dados

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor** > **payments**
3. Após um pagamento ser feito, o status deve mudar de `PENDING` para `PAID`
4. Um novo registro deve aparecer em **Table Editor** > **appointments**

---

## 🐛 Troubleshooting

### ❌ Webhook não está sendo chamado

**Possíveis causas:**

1. **URL incorreta**
   - Verifique se você colocou a URL completa e correta
   - Certifique-se de que substituiu `YOUR_PROJECT_REF`
   - A URL deve começar com `https://`

2. **Edge Function não está deployada**
   - Execute: `supabase functions deploy webhook-abacate-pay`

3. **Webhook está inativo**
   - Verifique no dashboard do Abacate Pay se o webhook está marcado como **Ativo**

4. **Eventos não estão selecionados**
   - Certifique-se de que marcou os 3 eventos: `paid`, `expired`, `cancelled`

---

### ❌ Webhook é chamado mas dá erro

**Possíveis causas:**

1. **Variáveis de ambiente não configuradas**
   - Vá no Supabase Dashboard > Settings > Edge Functions
   - Verifique se `ABACATE_PAY_API_KEY` e `ABACATE_PAY_BASE_URL` estão configuradas

2. **Problemas com o banco de dados**
   - Verifique se a tabela `payments` existe
   - Verifique se a tabela `appointments` existe
   - Verifique as políticas RLS (Row Level Security)

3. **Dados do pagamento inválidos**
   - Verifique os logs para ver qual erro específico está acontecendo

---

## 📊 Logs Úteis

### Ver logs em tempo real (via CLI):

```bash
supabase functions logs webhook-abacate-pay --tail
```

### Ver logs no Dashboard:

1. Supabase Dashboard
2. Edge Functions
3. webhook-abacate-pay
4. Logs

---

## 🔐 Segurança

### O webhook é seguro?

Sim! O Abacate Pay usa HTTPS para enviar os dados, garantindo que a comunicação é criptografada.

### Como validar que o webhook veio do Abacate Pay?

Por padrão, a implementação atual aceita qualquer requisição. Para adicionar segurança extra:

1. O Abacate Pay pode enviar um header de autenticação (verifique a documentação)
2. Você pode validar o IP de origem (não recomendado, pode mudar)
3. Você pode validar o formato dos dados recebidos

---

## 📝 Documentação Oficial

Para mais detalhes, consulte a documentação oficial do Abacate Pay:
- [https://docs.abacatepay.com](https://docs.abacatepay.com)

---

## ✅ Checklist de Configuração

- [ ] Acessei o dashboard do Abacate Pay
- [ ] Criei um novo webhook
- [ ] Colei a URL correta (substituí `YOUR_PROJECT_REF`)
- [ ] Selecionei os 3 eventos (paid, expired, cancelled)
- [ ] Ativei o webhook
- [ ] Salvei o webhook
- [ ] Testei o webhook (manual ou com pagamento real)
- [ ] Verifiquei os logs do Supabase
- [ ] Confirmei que os pagamentos são atualizados automaticamente

---

## 🎉 Pronto!

Seu webhook está configurado! Agora o sistema receberá notificações automáticas sempre que um pagamento for processado.

**Próximos passos:**
- Monitore os logs nos primeiros dias
- Teste com pagamentos reais
- Ajuste conforme necessário

---

**Data da Configuração:** _______________

**URL do Webhook:** _______________

**Observações:**
_______________________________________________________________
_______________________________________________________________

