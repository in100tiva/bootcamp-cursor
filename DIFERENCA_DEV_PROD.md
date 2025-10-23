# 🔄 Diferenças entre Desenvolvimento e Produção

Este documento explica as principais diferenças entre o ambiente de desenvolvimento (local) e o ambiente de produção.

---

## 🔑 Chaves de API

### Desenvolvimento (Local)

```
abc_dev_XXXXXXXXXXXXXX
```

- Começa com `abc_dev_`
- Usada para testes
- Não processa pagamentos reais
- Dados de teste
- Pode usar funções de simulação

### Produção

```
abc_prod_QkKGJ5WWJP2atNTAZQuFYtxC
```

- Começa com `abc_prod_`
- Processa pagamentos reais
- Cobra taxas por transação
- Dados reais de clientes
- **ATENÇÃO:** Pagamentos reais custam dinheiro!

---

## 🌐 URLs

### Desenvolvimento (Local)

**Frontend:**
```
http://localhost:5173
```

**Backend (Edge Functions):**
```
http://localhost:54321/functions/v1/create-pix-payment
http://localhost:54321/functions/v1/check-payment-status
http://localhost:54321/functions/v1/webhook-abacate-pay
```

### Produção

**Frontend:**
```
https://seu-projeto.vercel.app
```

**Backend (Edge Functions):**
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-pix-payment
https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-payment-status
https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-abacate-pay
```

---

## 💳 Pagamentos

### Desenvolvimento

- **Simulação:** Usa a API de desenvolvimento do Abacate Pay
- **Testes:** Pode simular pagamentos sem custo
- **QR Codes:** Podem ser de teste (não funcionam em apps bancários reais)
- **Webhooks:** Podem ser testados com ferramentas como ngrok

### Produção

- **Real:** Pagamentos são processados de verdade
- **Custos:** Cada transação tem uma taxa
- **QR Codes:** Funcionam em qualquer app bancário
- **Webhooks:** Enviados automaticamente pelo Abacate Pay

---

## 🗄️ Banco de Dados

### Desenvolvimento

**Supabase Local (se configurado):**
```
http://localhost:54321
```

**Ou Supabase Cloud (projeto de dev):**
```
https://dev-project.supabase.co
```

- Dados de teste
- Pode resetar quando quiser
- Sem preocupação com perda de dados

### Produção

**Supabase Cloud:**
```
https://prod-project.supabase.co
```

- Dados reais de clientes
- **CUIDADO:** Não delete dados de produção!
- Backup recomendado
- Políticas de RLS devem estar ativas

---

## 🔔 Webhooks

### Desenvolvimento

**Desafio:** Webhooks precisam de uma URL pública

**Soluções:**
1. Usar ferramentas como **ngrok** para expor localhost
2. Deploy em ambiente de staging
3. Testar manualmente a função do webhook

**URL de exemplo com ngrok:**
```
https://abc123.ngrok.io/functions/v1/webhook-abacate-pay
```

### Produção

**Simples:** URL já é pública

**URL de produção:**
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-abacate-pay
```

**Configuração:** Direto no dashboard do Abacate Pay

---

## ⚙️ Variáveis de Ambiente

### Desenvolvimento

**Arquivo `.env.local`:**
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key

# Edge Functions (configuradas localmente)
ABACATE_PAY_API_KEY=abc_dev_XXXXXXXXXXXXXX
ABACATE_PAY_BASE_URL=https://api.abacatepay.com/v1
```

### Produção

**Vercel (Frontend):**
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
```

**Supabase (Edge Functions):**
```env
ABACATE_PAY_API_KEY=abc_prod_QkKGJ5WWJP2atNTAZQuFYtxC
ABACATE_PAY_BASE_URL=https://api.abacatepay.com/v1
```

⚠️ **IMPORTANTE:** Nunca commite `.env.local` no Git!

---

## 📊 Logs e Monitoramento

### Desenvolvimento

**Frontend:**
- Console do navegador (F12)
- Logs aparecem em tempo real

**Backend:**
```bash
supabase functions serve --env-file .env.local
```
- Logs aparecem no terminal

**Banco de Dados:**
- Supabase Dashboard > Table Editor
- SQL Editor para queries

### Produção

**Frontend:**
- Vercel Dashboard > Logs
- Ferramentas de analytics (Google Analytics, etc.)

**Backend:**
```bash
supabase functions logs webhook-abacate-pay --tail
```
- Ou Supabase Dashboard > Edge Functions > Logs

**Banco de Dados:**
- Supabase Dashboard > Table Editor
- Configurar alertas (se disponível no plano)

---

## 🚀 Deploy

### Desenvolvimento

```bash
# Frontend
npm run dev

# Backend (Edge Functions)
supabase functions serve
```

**Mudanças:** Aplicadas instantaneamente (hot reload)

### Produção

**Frontend:**
```bash
git push origin main
```
Vercel faz deploy automático

**Backend:**
```bash
supabase functions deploy nome-da-function
```
Demora alguns segundos para propagar

**Mudanças:** Precisam de novo deploy

---

## 💰 Custos

### Desenvolvimento

**Supabase:**
- Plano gratuito geralmente suficiente
- Sem custos para testes locais

**Vercel:**
- Não aplicável (rodando local)

**Abacate Pay:**
- Sem custos (API de desenvolvimento)

**Total:** R$ 0,00 / mês

### Produção

**Supabase:**
- Plano gratuito: 500MB de banco, 2GB de armazenamento
- Plano Pro: ~$25/mês se precisar de mais recursos

**Vercel:**
- Plano gratuito: 100GB de banda, builds ilimitados
- Plano Pro: $20/mês se precisar de mais

**Abacate Pay:**
- Taxa por transação (ex: 1-3% + R$ 0,xx)
- Depende do volume

**Total:** R$ 0,00 a R$ 150,00 / mês (dependendo do uso)

---

## 🔒 Segurança

### Desenvolvimento

**Relaxado:**
- RLS pode estar desativado para facilitar testes
- Pode usar chaves de API diretamente no código
- Logs podem mostrar dados sensíveis

**OK porque:**
- Apenas você tem acesso
- Dados são de teste

### Produção

**Rigoroso:**
- ✅ RLS (Row Level Security) deve estar ativo
- ✅ Variáveis de ambiente configuradas corretamente
- ✅ Logs não devem expor dados sensíveis
- ✅ HTTPS em todas as conexões
- ✅ Validação de entrada de dados
- ✅ Políticas de acesso configuradas

**Importante porque:**
- Dados reais de clientes
- Conformidade com LGPD
- Segurança financeira

---

## 🧪 Testes

### Desenvolvimento

**Pode testar:**
- ✅ Múltiplos agendamentos
- ✅ Fluxos de erro
- ✅ Pagamentos simulados
- ✅ Resetar banco de dados
- ✅ Simular delays

**Sem preocupações:**
- Não custa dinheiro
- Pode quebrar à vontade
- Fácil de resetar

### Produção

**Teste com cuidado:**
- ⚠️ Pagamentos reais custam dinheiro
- ⚠️ Dados vão para o banco de produção
- ⚠️ Clientes podem ver mudanças

**Recomendações:**
1. Teste tudo em desenvolvimento primeiro
2. Use valores pequenos se for testar pagamento (R$ 0,01)
3. Tenha um ambiente de staging (opcional)
4. Monitore logs ativamente nos primeiros dias

---

## 📈 Performance

### Desenvolvimento

**Pode ser lento:**
- Rodando local
- Sem otimizações
- Hot reload ativo
- Logs detalhados

**OK porque:**
- Facilita debugging
- Apenas você está usando

### Produção

**Deve ser rápido:**
- CDN (Vercel)
- Code splitting
- Minificação
- Otimização de imagens
- Cache configurado

**Importante porque:**
- Experiência do usuário
- SEO (Google considera velocidade)
- Taxa de conversão

---

## 🔄 Fluxo de Trabalho Recomendado

```
┌─────────────────┐
│ Desenvolvimento │
│   (Local)       │
└────────┬────────┘
         │
         │ 1. Implementar feature
         │ 2. Testar localmente
         │ 3. Validar com dados de teste
         │
         ▼
┌─────────────────┐
│ Staging         │ (Opcional)
│ (Vercel Preview)│
└────────┬────────┘
         │
         │ 4. Deploy para branch de staging
         │ 5. Testes finais
         │ 6. Validação por stakeholders
         │
         ▼
┌─────────────────┐
│ Produção        │
│ (Vercel)        │
└─────────────────┘
         │
         │ 7. Merge para main
         │ 8. Deploy automático
         │ 9. Monitorar logs
         │ 10. Validar com usuários reais
```

---

## ✅ Checklist de Migração Dev → Prod

Antes de ir para produção:

- [ ] Todos os testes passaram em desenvolvimento
- [ ] Variáveis de ambiente configuradas (produção)
- [ ] Edge Functions deployadas
- [ ] Webhook configurado no Abacate Pay
- [ ] RLS (Row Level Security) ativado
- [ ] Chave de API de produção configurada
- [ ] Frontend deployado na Vercel
- [ ] Testei o fluxo completo em produção
- [ ] Configurei monitoramento de erros
- [ ] Documentei o processo

---

## 🎯 Principais Diferenças - Resumo

| Aspecto | Desenvolvimento | Produção |
|---------|----------------|----------|
| **API Key** | `abc_dev_` | `abc_prod_` |
| **URL** | `localhost` | `*.vercel.app` |
| **Pagamentos** | Simulados | Reais ($$) |
| **Dados** | Teste | Reais |
| **Webhooks** | ngrok/local | URL pública |
| **Custos** | R$ 0,00 | Variável |
| **Segurança** | Relaxada | Rigorosa |
| **Performance** | Lenta OK | Deve ser rápida |
| **Logs** | Terminal | Dashboard |
| **Mudanças** | Instantâneas | Precisa deploy |

---

## 🚨 ATENÇÃO - Chave de Produção

Você recebeu a chave:
```
abc_prod_QkKGJ5WWJP2atNTAZQuFYtxC
```

**⚠️ CUIDADOS:**

1. **NUNCA** commite essa chave no Git
2. Configure apenas nas variáveis de ambiente do Supabase
3. Com essa chave, pagamentos são REAIS
4. Cada transação pode ter uma taxa
5. Mantenha a chave segura

**Onde configurar:**
- ✅ Supabase Dashboard > Settings > Edge Functions
- ❌ Não coloque no código
- ❌ Não coloque no `.env.local` (que pode ser commitado por engano)
- ❌ Não compartilhe publicamente

---

## 🎉 Pronto para Produção?

Se você entendeu as diferenças acima, está pronto para fazer o deploy!

**Próximos passos:**
1. Leia o `DEPLOY_PRODUCAO.md`
2. Siga o `CHECKLIST_DEPLOY.md`
3. Configure tudo em produção
4. Teste com cuidado
5. 🚀 Celebre!

---

*Boa sorte com o deploy! 🚀*

