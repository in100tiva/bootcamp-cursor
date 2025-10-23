# 📚 Índice - Guias de Deploy para Produção

Este é o índice dos documentos que vão te ajudar a colocar o sistema em produção com a API do Abacate Pay.

---

## 🎯 Por onde começar?

Depende do seu nível de experiência:

### 👶 Iniciante - Primeira vez fazendo deploy

**Leia nesta ordem:**

1. 📖 **`DEPLOY_PRODUCAO.md`** *(Comece aqui!)*
   - Guia completo e detalhado
   - Explica cada passo
   - Inclui screenshots mentais
   - Tempo estimado: 30-45 minutos

2. 📋 **`CHECKLIST_DEPLOY.md`**
   - Use junto com o guia acima
   - Marque cada item conforme completa
   - Garante que não esqueceu nada

3. 🔔 **`CONFIGURAR_WEBHOOK_ABACATEPAY.md`**
   - Específico para configurar o webhook
   - Passo a passo com imagens mentais
   - Troubleshooting detalhado

### 🚀 Intermediário - Já fez deploy antes

**Leia nesta ordem:**

1. ⚡ **`COMANDOS_DEPLOY.md`** *(Comece aqui!)*
   - Lista de comandos essenciais
   - Ordem de execução
   - Sem enrolação

2. 🔔 **`CONFIGURAR_WEBHOOK_ABACATEPAY.md`**
   - Para configurar o webhook no Abacate Pay

3. 📋 **`CHECKLIST_DEPLOY.md`**
   - Para garantir que não esqueceu nada

### 💪 Avançado - Só preciso de uma referência rápida

**Consulte:**

- ⚡ **`COMANDOS_DEPLOY.md`** - Comandos diretos
- 📋 **`CHECKLIST_DEPLOY.md`** - Checklist rápido

---

## 📄 Descrição Detalhada dos Documentos

### 1. 📖 DEPLOY_PRODUCAO.md
**O que é:** Guia completo de deploy passo a passo

**Quando usar:** Quando você quer entender todo o processo

**Conteúdo:**
- Configuração do Supabase (variáveis de ambiente)
- Deploy das Edge Functions
- Configuração do webhook no Abacate Pay
- Deploy na Vercel
- Testes em produção
- Troubleshooting

**Para quem:** Iniciantes e intermediários

---

### 2. ⚡ COMANDOS_DEPLOY.md
**O que é:** Referência rápida de comandos

**Quando usar:** Quando você já sabe o que fazer, só precisa dos comandos

**Conteúdo:**
- Comandos CLI do Supabase
- Comandos CLI da Vercel
- Como ver logs
- Como atualizar código
- Ordem de execução

**Para quem:** Intermediários e avançados

---

### 3. 🔔 CONFIGURAR_WEBHOOK_ABACATEPAY.md
**O que é:** Guia específico para configurar o webhook

**Quando usar:** Quando você está na etapa de configurar o webhook no dashboard do Abacate Pay

**Conteúdo:**
- Como acessar o dashboard
- Como criar o webhook
- Quais eventos selecionar
- Como testar
- Troubleshooting específico de webhooks

**Para quem:** Todos

---

### 4. 📋 CHECKLIST_DEPLOY.md
**O que é:** Checklist completo de deploy

**Quando usar:** Durante o processo de deploy para marcar o que já foi feito

**Conteúdo:**
- Lista de pré-requisitos
- Checkboxes para cada etapa
- Testes a serem executados
- Área para anotações

**Para quem:** Todos (especialmente iniciantes)

---

### 5. 📜 Scripts de Deploy

#### `scripts/deploy-functions.sh` (Linux/Mac)
Script Bash para fazer deploy de todas as Edge Functions de uma vez.

```bash
bash scripts/deploy-functions.sh
```

#### `scripts/deploy-functions.ps1` (Windows)
Script PowerShell para fazer deploy de todas as Edge Functions de uma vez.

```powershell
.\scripts\deploy-functions.ps1
```

---

## 🗺️ Fluxo de Deploy Recomendado

```
┌─────────────────────────────────────────────────┐
│ 1. Ler DEPLOY_PRODUCAO.md                      │
│    (ou COMANDOS_DEPLOY.md se já tem experiência)│
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ 2. Configurar Variáveis no Supabase            │
│    - ABACATE_PAY_API_KEY                       │
│    - ABACATE_PAY_BASE_URL                      │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ 3. Deploy das Edge Functions                    │
│    - create-pix-payment                         │
│    - check-payment-status                       │
│    - webhook-abacate-pay                        │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ 4. Configurar Webhook no Abacate Pay           │
│    (Seguir CONFIGURAR_WEBHOOK_ABACATEPAY.md)   │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ 5. Deploy do Frontend na Vercel                │
│    - Configurar variáveis de ambiente           │
│    - Fazer deploy                               │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ 6. Testar em Produção                          │
│    - Fazer um agendamento completo              │
│    - Verificar logs                             │
│    - Confirmar funcionamento                    │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ 7. ✅ Sistema em Produção!                     │
└─────────────────────────────────────────────────┘
```

---

## 🎓 Perguntas Frequentes

### Q: Qual documento devo ler primeiro?

**A:** Se é sua primeira vez, leia `DEPLOY_PRODUCAO.md`. Se já tem experiência, vá direto para `COMANDOS_DEPLOY.md`.

### Q: Preciso ler todos os documentos?

**A:** Não necessariamente. Use o `COMANDOS_DEPLOY.md` para uma referência rápida, e consulte os outros documentos quando precisar de mais detalhes.

### Q: Quanto tempo leva para fazer o deploy completo?

**A:** 
- Primeira vez: 30-60 minutos
- Já tem experiência: 10-20 minutos

### Q: O que fazer se algo der errado?

**A:** Consulte a seção "Troubleshooting" no `DEPLOY_PRODUCAO.md` ou `CONFIGURAR_WEBHOOK_ABACATEPAY.md`.

### Q: Preciso pagar para fazer deploy?

**A:**
- **Supabase:** Plano gratuito disponível (suficiente para começar)
- **Vercel:** Plano gratuito disponível (suficiente para começar)
- **Abacate Pay:** Cobra taxa por transação processada

### Q: Posso testar sem gastar dinheiro?

**A:** Sim! Configure o valor do pagamento para R$ 0,01 (1 centavo) na Edge Function `create-pix-payment`. Veja detalhes no `DEPLOY_PRODUCAO.md`.

---

## 🆘 Precisa de Ajuda?

### Recursos Oficiais

- **Supabase:** https://supabase.com/docs
- **Vercel:** https://vercel.com/docs
- **Abacate Pay:** https://docs.abacatepay.com

### Troubleshooting

1. Verifique a seção de Troubleshooting no `DEPLOY_PRODUCAO.md`
2. Consulte os logs (comandos em `COMANDOS_DEPLOY.md`)
3. Verifique se completou todos os itens do `CHECKLIST_DEPLOY.md`

---

## ✅ Checklist Rápido

Antes de começar, certifique-se de ter:

- [ ] Conta no Supabase (gratuita)
- [ ] Conta na Vercel (gratuita)
- [ ] Conta no Abacate Pay (com API key de produção)
- [ ] Repositório no GitHub
- [ ] Supabase CLI instalado
- [ ] Node.js instalado

---

## 🚀 Começar Agora

**Para iniciantes:**
1. Abra o `DEPLOY_PRODUCAO.md`
2. Tenha o `CHECKLIST_DEPLOY.md` aberto em outra aba
3. Siga passo a passo

**Para experientes:**
1. Abra o `COMANDOS_DEPLOY.md`
2. Execute os comandos na ordem
3. Use o `CHECKLIST_DEPLOY.md` para garantir que não esqueceu nada

---

## 📊 Estrutura dos Documentos

```
📁 Documentação de Deploy
│
├── 📄 GUIA_DEPLOY_INDEX.md (você está aqui)
│   └── Índice e visão geral de todos os documentos
│
├── 📖 DEPLOY_PRODUCAO.md
│   └── Guia completo e detalhado passo a passo
│
├── ⚡ COMANDOS_DEPLOY.md
│   └── Referência rápida de comandos
│
├── 🔔 CONFIGURAR_WEBHOOK_ABACATEPAY.md
│   └── Guia específico para configurar o webhook
│
├── 📋 CHECKLIST_DEPLOY.md
│   └── Checklist interativo para marcar progresso
│
└── 📜 scripts/
    ├── deploy-functions.sh (Linux/Mac)
    └── deploy-functions.ps1 (Windows)
```

---

## 🎉 Pronto para começar?

Escolha seu caminho:

- 🐣 **Iniciante:** `DEPLOY_PRODUCAO.md` + `CHECKLIST_DEPLOY.md`
- 🚀 **Intermediário:** `COMANDOS_DEPLOY.md`
- 💪 **Avançado:** `COMANDOS_DEPLOY.md` (apenas referência)

**Boa sorte com o deploy! 🚀**

---

*Última atualização: Outubro 2025*

