# ✅ Checklist de Deploy - Produção

Use este checklist para garantir que todos os passos foram executados corretamente.

## 📋 Pré-Deploy

- [ ] Tenho acesso ao dashboard do Supabase
- [ ] Tenho acesso ao dashboard da Vercel
- [ ] Tenho a chave API de produção do Abacate Pay: `abc_prod_QkKGJ5WWJP2atNTAZQuFYtxC`
- [ ] O código está funcionando localmente
- [ ] Fiz commit de todas as alterações no Git
- [ ] Fiz push para o repositório remoto

---

## 🔧 Configuração do Supabase

### Edge Functions - Variáveis de Ambiente

- [ ] Acessei o Supabase Dashboard > Settings > Edge Functions
- [ ] Adicionei a variável `ABACATE_PAY_API_KEY` = `abc_prod_QkKGJ5WWJP2atNTAZQuFYtxC`
- [ ] Adicionei a variável `ABACATE_PAY_BASE_URL` = `https://api.abacatepay.com/v1`

### Deploy das Edge Functions

- [ ] Instalei o Supabase CLI
- [ ] Fiz login: `supabase login`
- [ ] Linkei o projeto: `supabase link --project-ref YOUR_PROJECT_REF`
- [ ] Deploy da function `create-pix-payment`: `supabase functions deploy create-pix-payment`
- [ ] Deploy da function `check-payment-status`: `supabase functions deploy check-payment-status`
- [ ] Deploy da function `webhook-abacate-pay`: `supabase functions deploy webhook-abacate-pay`
- [ ] Anotei as URLs das functions (ex: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/...`)

### Tabelas e Permissões

- [ ] Verifiquei que a tabela `payments` existe
- [ ] Verifiquei que a tabela `appointments` existe
- [ ] Verifiquei que as políticas RLS estão configuradas

---

## 🔔 Configuração do Webhook - Abacate Pay

- [ ] Acessei o dashboard: [https://app.abacatepay.com](https://app.abacatepay.com)
- [ ] Naveguei para Configurações > Webhooks
- [ ] Cliquei em "Adicionar Webhook"
- [ ] Colei a URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-abacate-pay`
- [ ] Selecionei os eventos:
  - [ ] `pixQrCode.paid`
  - [ ] `pixQrCode.expired`
  - [ ] `pixQrCode.cancelled`
- [ ] Ativei o webhook
- [ ] Salvei o webhook
- [ ] (Opcional) Testei o webhook pelo dashboard

---

## 🌐 Deploy na Vercel

### Importar Projeto

- [ ] Acessei [https://vercel.com](https://vercel.com)
- [ ] Importei o repositório do GitHub
- [ ] Selecionei o framework correto (Vite)

### Variáveis de Ambiente

- [ ] Acessei Settings > Environment Variables
- [ ] Adicionei `VITE_SUPABASE_URL` (Production)
- [ ] Adicionei `VITE_SUPABASE_ANON_KEY` (Production)
- [ ] Fiz Redeploy após adicionar as variáveis

### Deploy

- [ ] Cliquei em "Deploy"
- [ ] Aguardei o build finalizar
- [ ] Anotei a URL de produção (ex: `https://seu-projeto.vercel.app`)

---

## ✅ Testes em Produção

### Teste Manual - Fluxo Completo

- [ ] Acessei a URL de produção
- [ ] Naveguei até a página de agendamento
- [ ] Selecionei um profissional
- [ ] Escolhi uma data e horário
- [ ] Preenchi os dados do paciente
- [ ] Confirnei o agendamento
- [ ] Cheguei na tela de pagamento
- [ ] O QR Code PIX foi exibido
- [ ] Copiei o código PIX (Pix Copia e Cola)

### Verificação no Banco de Dados

- [ ] Acessei o Supabase Dashboard > Table Editor > payments
- [ ] Encontrei o pagamento criado
- [ ] Verifiquei que o status está como `PENDING` ou `WAITING`
- [ ] Verifiquei que os dados do paciente estão corretos

### Teste de Pagamento (Opcional - Custa R$1,00)

- [ ] Paguei o PIX usando um app bancário
- [ ] Aguardei alguns segundos
- [ ] Voltei ao Supabase > payments
- [ ] Verifiquei que o status mudou para `PAID`
- [ ] Verifiquei que um appointment foi criado na tabela `appointments`

### Logs e Monitoramento

- [ ] Verifiquei logs da Vercel (nenhum erro crítico)
- [ ] Verifiquei logs do Supabase > Edge Functions
  - [ ] `create-pix-payment` - Sem erros
  - [ ] `webhook-abacate-pay` - Recebeu o webhook
  - [ ] `check-payment-status` - Funcionando

---

## 📊 Monitoramento Contínuo

### Primeiros Dias

- [ ] Configurei alertas no Supabase (se disponível)
- [ ] Configurei alertas na Vercel (se disponível)
- [ ] Monitorei os logs diariamente
- [ ] Verifiquei se os pagamentos estão sendo processados
- [ ] Verifiquei se os webhooks estão chegando

### Semanal

- [ ] Revisei métricas de erro
- [ ] Revisei tempo de resposta das APIs
- [ ] Verifiquei taxa de conversão de pagamentos
- [ ] Identifiquei possíveis melhorias

---

## 🐛 Troubleshooting Rápido

### Se o QR Code não aparecer:

1. Verifique os logs da function `create-pix-payment`
2. Confirme a chave API nas variáveis de ambiente do Supabase
3. Teste a API do Abacate Pay diretamente

### Se o webhook não funcionar:

1. Verifique a URL do webhook no dashboard do Abacate Pay
2. Teste o webhook manualmente
3. Verifique os logs da function `webhook-abacate-pay`
4. Confirme que os eventos corretos estão selecionados

### Se o appointment não for criado:

1. Verifique se o pagamento existe na tabela `payments`
2. Verifique os logs do webhook
3. Confirme que não há erros de RLS no Supabase
4. Verifique se o `payment_id` está correto no appointment

---

## 🎉 Deploy Concluído!

Se todos os itens acima estão marcados, seu sistema está em produção! 🚀

**Próximos passos:**
- Monitore os logs regularmente
- Ajuste valores conforme necessário
- Implemente melhorias baseadas no feedback dos usuários
- Mantenha as dependências atualizadas

---

**Data do Deploy:** _______________

**Responsável:** _______________

**URL de Produção:** _______________

**Observações:**
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________

