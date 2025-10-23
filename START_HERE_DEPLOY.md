# 🚀 START HERE - Deploy para Produção

**Bem-vindo!** Este guia vai te ajudar a colocar seu sistema de agendamentos em produção com a API do Abacate Pay.

---

## ⏱️ Tempo Estimado

- **Primeira vez:** 30-60 minutos
- **Já tem experiência:** 10-20 minutos

---

## 🎯 O que você precisa ter pronto

Antes de começar, certifique-se de ter:

- ✅ Conta no [Supabase](https://supabase.com) (grátis)
- ✅ Conta na [Vercel](https://vercel.com) (grátis)
- ✅ Conta no [Abacate Pay](https://abacatepay.com) com API key de produção
- ✅ Repositório do projeto no GitHub
- ✅ Node.js instalado no seu computador
- ✅ O sistema funcionando localmente

---

## 🗺️ Qual caminho seguir?

### 👶 Nunca fiz deploy antes

**Seu caminho:**

1. 📖 Leia **[DEPLOY_PRODUCAO.md](./DEPLOY_PRODUCAO.md)**
   - Guia completo e detalhado
   - Explica cada conceito
   - Com exemplos e screenshots mentais

2. ✅ Use **[CHECKLIST_DEPLOY.md](./CHECKLIST_DEPLOY.md)**
   - Para marcar o que já fez
   - Garantir que não esqueceu nada

3. 🔔 Quando chegar na parte do webhook, consulte **[CONFIGURAR_WEBHOOK_ABACATEPAY.md](./CONFIGURAR_WEBHOOK_ABACATEPAY.md)**
   - Passo a passo específico
   - Com troubleshooting

**Tempo estimado:** 45-60 minutos

---

### 🚀 Já fiz deploy de outros projetos

**Seu caminho:**

1. ⚡ Vá direto para **[COMANDOS_DEPLOY.md](./COMANDOS_DEPLOY.md)**
   - Lista de comandos essenciais
   - Sem enrolação
   - Ordem de execução clara

2. 🔔 Configure o webhook: **[CONFIGURAR_WEBHOOK_ABACATEPAY.md](./CONFIGURAR_WEBHOOK_ABACATEPAY.md)**

3. ✅ Confira se não esqueceu nada: **[CHECKLIST_DEPLOY.md](./CHECKLIST_DEPLOY.md)**

**Tempo estimado:** 15-25 minutos

---

### 💪 Sou avançado, só preciso de referência

**Seu caminho:**

1. ⚡ **[COMANDOS_DEPLOY.md](./COMANDOS_DEPLOY.md)** - Comandos rápidos
2. ✅ **[CHECKLIST_DEPLOY.md](./CHECKLIST_DEPLOY.md)** - Checklist final

**Tempo estimado:** 10-15 minutos

---

## 🔑 Informações Importantes

### API Key de Produção do Abacate Pay

```
abc_prod_QkKGJ5WWJP2atNTAZQuFYtxC
```

⚠️ **ATENÇÃO:** 
- Esta chave processa pagamentos **REAIS**
- Nunca commite ela no Git
- Configure apenas nas variáveis de ambiente do Supabase

---

## 📋 Checklist Rápido (5 Passos)

Marque conforme completar:

- [ ] **1. Configurar Variáveis de Ambiente no Supabase**
  - Acesse: Dashboard > Settings > Edge Functions
  - Adicione: `ABACATE_PAY_API_KEY` e `ABACATE_PAY_BASE_URL`

- [ ] **2. Deploy das Edge Functions**
  ```bash
  supabase login
  supabase link --project-ref YOUR_PROJECT_REF
  supabase functions deploy create-pix-payment
  supabase functions deploy check-payment-status
  supabase functions deploy webhook-abacate-pay
  ```

- [ ] **3. Configurar Webhook no Abacate Pay**
  - Dashboard: https://app.abacatepay.com
  - URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-abacate-pay`
  - Eventos: `paid`, `expired`, `cancelled`

- [ ] **4. Deploy do Frontend na Vercel**
  - Acesse: https://vercel.com/new
  - Importe o repositório
  - Configure: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
  - Clique em Deploy

- [ ] **5. Testar em Produção**
  - Acesse a URL da Vercel
  - Faça um agendamento completo
  - Verifique se o QR Code aparece
  - (Opcional) Teste com pagamento real

---

## 🆘 Precisa de Ajuda?

### Documentos por Tipo de Problema

**Problema:** Não sei por onde começar
- **Solução:** Leia [DEPLOY_PRODUCAO.md](./DEPLOY_PRODUCAO.md)

**Problema:** Webhook não está funcionando
- **Solução:** Consulte [CONFIGURAR_WEBHOOK_ABACATEPAY.md](./CONFIGURAR_WEBHOOK_ABACATEPAY.md)

**Problema:** Diferenças entre dev e prod
- **Solução:** Leia [DIFERENCA_DEV_PROD.md](./DIFERENCA_DEV_PROD.md)

**Problema:** Quero só os comandos
- **Solução:** Use [COMANDOS_DEPLOY.md](./COMANDOS_DEPLOY.md)

**Problema:** Não sei qual documento ler
- **Solução:** Consulte [GUIA_DEPLOY_INDEX.md](./GUIA_DEPLOY_INDEX.md)

---

## 📚 Todos os Documentos Disponíveis

| Documento | O que é | Quando usar |
|-----------|---------|-------------|
| **START_HERE_DEPLOY.md** | Este documento! 👋 | Primeiro acesso |
| **[GUIA_DEPLOY_INDEX.md](./GUIA_DEPLOY_INDEX.md)** | Índice de todos os guias | Navegação |
| **[DEPLOY_PRODUCAO.md](./DEPLOY_PRODUCAO.md)** | Guia completo passo a passo | Iniciantes |
| **[COMANDOS_DEPLOY.md](./COMANDOS_DEPLOY.md)** | Comandos rápidos | Experientes |
| **[CONFIGURAR_WEBHOOK_ABACATEPAY.md](./CONFIGURAR_WEBHOOK_ABACATEPAY.md)** | Como configurar webhook | Todos |
| **[CHECKLIST_DEPLOY.md](./CHECKLIST_DEPLOY.md)** | Checklist interativo | Todos |
| **[DIFERENCA_DEV_PROD.md](./DIFERENCA_DEV_PROD.md)** | Dev vs Produção | Iniciantes |

---

## ⚡ Quick Start de 1 Minuto

Se você é **MUITO** experiente e só quer começar agora:

```bash
# 1. Supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy create-pix-payment
supabase functions deploy check-payment-status
supabase functions deploy webhook-abacate-pay

# 2. Configure no Supabase Dashboard:
# - ABACATE_PAY_API_KEY=abc_prod_QkKGJ5WWJP2atNTAZQuFYtxC
# - ABACATE_PAY_BASE_URL=https://api.abacatepay.com/v1

# 3. Configure webhook no Abacate Pay:
# URL: https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-abacate-pay
# Eventos: paid, expired, cancelled

# 4. Vercel
# Dashboard > New Project > Import Repo
# Adicione: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
# Deploy
```

---

## 🎬 Pronto para Começar?

**Escolha seu caminho:**

- 👶 **Iniciante?** → Abra [DEPLOY_PRODUCAO.md](./DEPLOY_PRODUCAO.md)
- 🚀 **Intermediário?** → Abra [COMANDOS_DEPLOY.md](./COMANDOS_DEPLOY.md)
- 💪 **Avançado?** → Use o Quick Start acima

---

## ❓ Perguntas Frequentes

### Vai custar dinheiro?

**Supabase e Vercel:** Planos gratuitos disponíveis (suficiente para começar)

**Abacate Pay:** Cobra taxa por transação processada (ex: 1-3% + R$ 0,xx)

**Para testar:** Configure o valor do pagamento para R$ 0,01 (1 centavo)

### Quanto tempo demora?

- Setup inicial: 30-60 minutos
- Deploys futuros: 5-10 minutos

### É seguro?

Sim! Desde que você:
- ✅ Configure as variáveis de ambiente corretamente
- ✅ Não commite a API key no Git
- ✅ Ative Row Level Security (RLS) no Supabase

### E se algo der errado?

Todos os guias têm seções de "Troubleshooting" com soluções para problemas comuns.

---

## 🎉 Sucesso!

Depois do deploy, você terá:

- ✅ Sistema acessível em URL pública (Vercel)
- ✅ Pagamentos reais funcionando via PIX
- ✅ Webhooks recebendo notificações automáticas
- ✅ Banco de dados em produção (Supabase)

**Próximos passos após o deploy:**
1. Monitore os logs nos primeiros dias
2. Teste com pagamentos reais (valores pequenos)
3. Ajuste conforme necessário
4. 🎉 Celebre! Você colocou um sistema completo no ar!

---

## 🚀 Vamos lá!

**Clique no documento correspondente ao seu nível:**

<div align="center">

### [📖 DEPLOY_PRODUCAO.md](./DEPLOY_PRODUCAO.md)
*Iniciantes - Guia completo*

### [⚡ COMANDOS_DEPLOY.md](./COMANDOS_DEPLOY.md)
*Experientes - Comandos rápidos*

### [📚 GUIA_DEPLOY_INDEX.md](./GUIA_DEPLOY_INDEX.md)
*Todos - Índice completo*

</div>

---

**Boa sorte com o deploy! 🚀**

*Se tiver dúvidas, consulte o documento apropriado na tabela acima.*

