# 🎨 Fluxo de Deploy - Visual

Este documento mostra visualmente todo o fluxo de deploy do sistema em produção.

---

## 🗺️ Mapa Completo do Deploy

```
┌─────────────────────────────────────────────────────────────────────┐
│                    🎯 VOCÊ ESTÁ AQUI                                │
│                  START_HERE_DEPLOY.md                               │
│                                                                     │
│  Escolha seu caminho:                                               │
│  👶 Iniciante  |  🚀 Intermediário  |  💪 Avançado                  │
└─────────┬───────────────────┬───────────────────┬───────────────────┘
          │                   │                   │
          ↓                   ↓                   ↓
  ┌───────────────┐   ┌───────────────┐   ┌──────────────┐
  │ DEPLOY_       │   │ COMANDOS_     │   │ COMANDOS_    │
  │ PRODUCAO.md   │   │ DEPLOY.md     │   │ DEPLOY.md    │
  │ (Detalhado)   │   │ (Resumido)    │   │ (Só comandos)│
  └───────┬───────┘   └───────┬───────┘   └──────┬───────┘
          │                   │                   │
          └───────────────────┴───────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │ Executar Passos     │
                    │ de Deploy           │
                    └─────────┬───────────┘
                              ↓
          ┌───────────────────────────────────────┐
          │      FLUXO DE EXECUÇÃO DO DEPLOY      │
          └───────────────────────────────────────┘
                              ↓
                    [Veja diagrama abaixo]
```

---

## 📋 Fluxo de Execução - 5 Etapas Principais

```
╔════════════════════════════════════════════════════════════════════╗
║                        ETAPA 1: SUPABASE                           ║
║                  Configurar Variáveis de Ambiente                  ║
╚════════════════════════════════════════════════════════════════════╝
                              │
                              ↓
                    ┌─────────────────────┐
                    │ Dashboard Supabase  │
                    │ Settings > Edge Fns │
                    └─────────┬───────────┘
                              ↓
              ┌───────────────────────────────┐
              │ Add Secret:                   │
              │ • ABACATE_PAY_API_KEY        │
              │ • ABACATE_PAY_BASE_URL       │
              └───────────────┬───────────────┘
                              ↓
                         ✅ Concluído
                              │
                              ↓
╔════════════════════════════════════════════════════════════════════╗
║                  ETAPA 2: EDGE FUNCTIONS                           ║
║                Deploy das Funções no Supabase                      ║
╚════════════════════════════════════════════════════════════════════╝
                              │
                              ↓
                    ┌─────────────────────┐
                    │ Terminal / CLI      │
                    └─────────┬───────────┘
                              ↓
              ┌───────────────────────────────┐
              │ $ supabase login              │
              │ $ supabase link               │
              └───────────────┬───────────────┘
                              ↓
              ┌───────────────────────────────┐
              │ Deploy 3 Functions:           │
              │ • create-pix-payment         │
              │ • check-payment-status       │
              │ • webhook-abacate-pay        │
              └───────────────┬───────────────┘
                              ↓
                         ✅ Concluído
                              │
                              ↓
╔════════════════════════════════════════════════════════════════════╗
║                    ETAPA 3: WEBHOOK                                ║
║              Configurar no Dashboard Abacate Pay                   ║
╚════════════════════════════════════════════════════════════════════╝
                              │
                              ↓
                    ┌─────────────────────┐
                    │ app.abacatepay.com  │
                    │ Configurações       │
                    └─────────┬───────────┘
                              ↓
              ┌───────────────────────────────┐
              │ URL do Webhook:               │
              │ https://YOUR_PROJECT_REF      │
              │ .supabase.co/functions/v1/    │
              │ webhook-abacate-pay           │
              └───────────────┬───────────────┘
                              ↓
              ┌───────────────────────────────┐
              │ Eventos selecionados:         │
              │ ✓ pixQrCode.paid             │
              │ ✓ pixQrCode.expired          │
              │ ✓ pixQrCode.cancelled        │
              └───────────────┬───────────────┘
                              ↓
                         ✅ Concluído
                              │
                              ↓
╔════════════════════════════════════════════════════════════════════╗
║                     ETAPA 4: VERCEL                                ║
║                 Deploy do Frontend na Vercel                       ║
╚════════════════════════════════════════════════════════════════════╝
                              │
                              ↓
                    ┌─────────────────────┐
                    │ vercel.com/new      │
                    └─────────┬───────────┘
                              ↓
              ┌───────────────────────────────┐
              │ Import from GitHub            │
              └───────────────┬───────────────┘
                              ↓
              ┌───────────────────────────────┐
              │ Environment Variables:        │
              │ • VITE_SUPABASE_URL          │
              │ • VITE_SUPABASE_ANON_KEY     │
              └───────────────┬───────────────┘
                              ↓
              ┌───────────────────────────────┐
              │ Click: Deploy                 │
              └───────────────┬───────────────┘
                              ↓
                  ⏳ Aguardar build...
                              ↓
                         ✅ Concluído
                              │
                              ↓
╔════════════════════════════════════════════════════════════════════╗
║                      ETAPA 5: TESTES                               ║
║              Validar o Sistema em Produção                         ║
╚════════════════════════════════════════════════════════════════════╝
                              │
                              ↓
              ┌───────────────────────────────┐
              │ Acessar URL de Produção       │
              │ https://seu-app.vercel.app    │
              └───────────────┬───────────────┘
                              ↓
              ┌───────────────────────────────┐
              │ 1. Fazer agendamento          │
              │ 2. Verificar QR Code          │
              │ 3. Testar pagamento (opt)     │
              │ 4. Verificar banco de dados   │
              │ 5. Verificar logs             │
              └───────────────┬───────────────┘
                              ↓
              ┌───────────────────────────────┐
              │ Tudo funcionando?             │
              │      ┌───────┬────────┐       │
              │      ↓ SIM   │  NÃO   ↓       │
              └──────┬───────┴────────┬───────┘
                     ↓                ↓
                ✅ Sucesso!    ❌ Troubleshooting
                     │                ↓
                     │         [Ver guias de
                     │          troubleshooting]
                     ↓
╔════════════════════════════════════════════════════════════════════╗
║                    🎉 SISTEMA EM PRODUÇÃO!                         ║
╚════════════════════════════════════════════════════════════════════╝
```

---

## 🔄 Fluxo de Dados em Produção

```
┌─────────────┐
│  USUÁRIO    │
│  (Cliente)  │
└──────┬──────┘
       │
       │ 1. Acessa o site
       ↓
┌─────────────────┐
│     VERCEL      │
│  (Frontend)     │
│  React + Vite   │
└─────────┬───────┘
          │
          │ 2. Faz agendamento
          ↓
┌──────────────────────────────┐
│       SUPABASE               │
│  Edge Function:              │
│  create-pix-payment          │
└────────┬─────────────────────┘
         │
         │ 3. Chama API
         ↓
┌──────────────────────────────┐
│      ABACATE PAY API         │
│  Gera QR Code PIX            │
└────────┬─────────────────────┘
         │
         │ 4. Retorna dados
         ↓
┌──────────────────────────────┐
│      SUPABASE                │
│  Salva na tabela payments    │
└────────┬─────────────────────┘
         │
         │ 5. Retorna QR Code
         ↓
┌──────────────────────────────┐
│      VERCEL (Frontend)       │
│  Exibe QR Code para usuário  │
└────────┬─────────────────────┘
         │
         │ 6. Usuário paga
         ↓
┌──────────────────────────────┐
│   BANCO DO USUÁRIO           │
│   (App bancário)             │
└────────┬─────────────────────┘
         │
         │ 7. Processa pagamento
         ↓
┌──────────────────────────────┐
│      ABACATE PAY             │
│  Recebe confirmação          │
└────────┬─────────────────────┘
         │
         │ 8. Envia webhook
         ↓
┌──────────────────────────────┐
│      SUPABASE                │
│  Edge Function:              │
│  webhook-abacate-pay         │
└────────┬─────────────────────┘
         │
         │ 9. Atualiza status
         ↓
┌──────────────────────────────┐
│      SUPABASE                │
│  • payments: status = PAID   │
│  • appointments: criado      │
└────────┬─────────────────────┘
         │
         │ 10. Polling/Refresh
         ↓
┌──────────────────────────────┐
│      VERCEL (Frontend)       │
│  Mostra confirmação          │
└────────┬─────────────────────┘
         │
         ↓
┌──────────────────────────────┐
│        USUÁRIO               │
│  Agendamento confirmado! ✅  │
└──────────────────────────────┘
```

---

## 🏗️ Arquitetura do Sistema em Produção

```
                    ┌──────────────────────────┐
                    │      INTERNET            │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────┴─────────────┐
                    │                          │
                    ↓                          ↓
        ┌───────────────────┐      ┌──────────────────┐
        │     VERCEL        │      │   ABACATE PAY    │
        │   (Frontend)      │      │   (Webhooks)     │
        │                   │      └────────┬─────────┘
        │ • React           │               │
        │ • TypeScript      │               │
        │ • Vite            │               │
        │ • Tailwind CSS    │               │
        └─────────┬─────────┘               │
                  │                         │
                  │                         │
                  ↓                         ↓
        ┌─────────────────────────────────────────┐
        │            SUPABASE                     │
        │  ┌─────────────────────────────────┐   │
        │  │  Edge Functions                 │   │
        │  │  • create-pix-payment          │   │
        │  │  • check-payment-status        │   │
        │  │  • webhook-abacate-pay         │   │
        │  └─────────────┬───────────────────┘   │
        │                ↓                        │
        │  ┌─────────────────────────────────┐   │
        │  │  PostgreSQL Database            │   │
        │  │  • professionals                │   │
        │  │  • schedules                    │   │
        │  │  • appointments                 │   │
        │  │  • payments                     │   │
        │  └─────────────────────────────────┘   │
        └─────────────────────────────────────────┘
                          ↕
        ┌─────────────────────────────────────────┐
        │          ABACATE PAY API                │
        │  https://api.abacatepay.com/v1          │
        │  • PIX QR Code Generation               │
        │  • Payment Processing                   │
        │  • Webhook Notifications                │
        └─────────────────────────────────────────┘
```

---

## ⏱️ Linha do Tempo do Deploy

```
┌───────────────────────────────────────────────────────────┐
│               LINHA DO TEMPO - DEPLOY                     │
└───────────────────────────────────────────────────────────┘

00:00 ├─┐ Início
      │ └─ Ler START_HERE_DEPLOY.md (5 min)
      │
05:00 ├─┐ Fase 1: Supabase
      │ ├─ Configurar variáveis (3 min)
      │ └─ Verificar configuração (2 min)
      │
10:00 ├─┐ Fase 2: Edge Functions
      │ ├─ Login no CLI (2 min)
      │ ├─ Link project (2 min)
      │ ├─ Deploy function 1 (3 min)
      │ ├─ Deploy function 2 (3 min)
      │ └─ Deploy function 3 (3 min)
      │
25:00 ├─┐ Fase 3: Webhook
      │ ├─ Acessar dashboard (2 min)
      │ ├─ Configurar webhook (5 min)
      │ └─ Testar webhook (3 min)
      │
35:00 ├─┐ Fase 4: Vercel
      │ ├─ Import repo (2 min)
      │ ├─ Configurar env vars (3 min)
      │ ├─ Iniciar build (1 min)
      │ └─ Aguardar build (5 min)
      │
46:00 ├─┐ Fase 5: Testes
      │ ├─ Teste funcional (5 min)
      │ ├─ Verificar logs (3 min)
      │ └─ Validação final (2 min)
      │
56:00 ├─┐ Finalização
      │ ├─ Checklist final (2 min)
      │ └─ Documentar (2 min)
      │
60:00 ├─┘ ✅ Deploy Concluído!
```

**Tempo total estimado: 45-60 minutos (primeira vez)**

---

## 🎯 Checklist Visual Rápido

```
┌────────────────────────────────────────────┐
│      CHECKLIST VISUAL DE DEPLOY            │
└────────────────────────────────────────────┘

Pré-requisitos:
  [ ] Conta Supabase
  [ ] Conta Vercel
  [ ] API Key Abacate Pay
  [ ] Repositório GitHub

Supabase:
  [ ] Variáveis de ambiente configuradas
  [ ] Edge Functions deployadas
  [ ] URLs anotadas

Webhook:
  [ ] Dashboard acessado
  [ ] URL configurada
  [ ] Eventos selecionados
  [ ] Webhook ativo

Vercel:
  [ ] Projeto importado
  [ ] Variáveis configuradas
  [ ] Build concluído
  [ ] URL de produção anotada

Testes:
  [ ] Site acessível
  [ ] Agendamento funciona
  [ ] QR Code aparece
  [ ] Pagamento processado (opcional)
  [ ] Logs sem erros

✅ Pronto para produção!
```

---

## 🚨 Pontos de Atenção

```
⚠️  IMPORTANTE
┌────────────────────────────────────────┐
│  1. API Key de Produção                │
│     • Configure APENAS no Supabase     │
│     • NUNCA commite no Git             │
│                                        │
│  2. Webhook URL                        │
│     • Substitua YOUR_PROJECT_REF       │
│     • Teste antes de ir ao ar          │
│                                        │
│  3. Variáveis de Ambiente              │
│     • Supabase: 2 variáveis            │
│     • Vercel: 2 variáveis              │
│                                        │
│  4. Pagamentos Reais                   │
│     • Teste com valores pequenos       │
│     • Monitore nos primeiros dias      │
│                                        │
│  5. Logs                               │
│     • Monitore ativamente              │
│     • Configure alertas                │
└────────────────────────────────────────┘
```

---

## 🎉 Sucesso!

```
╔═══════════════════════════════════════════╗
║                                           ║
║         🎉 DEPLOY CONCLUÍDO! 🎉          ║
║                                           ║
║    Seu sistema está em produção!         ║
║                                           ║
║    ✅ Frontend: Vercel                   ║
║    ✅ Backend: Supabase                  ║
║    ✅ Pagamentos: Abacate Pay            ║
║    ✅ Webhook: Configurado               ║
║                                           ║
║         Parabéns! 🚀                     ║
║                                           ║
╚═══════════════════════════════════════════╝
```

---

## 📚 Documentos Relacionados

- 📖 [DEPLOY_PRODUCAO.md](./DEPLOY_PRODUCAO.md) - Guia completo
- ⚡ [COMANDOS_DEPLOY.md](./COMANDOS_DEPLOY.md) - Comandos rápidos
- 🔔 [CONFIGURAR_WEBHOOK_ABACATEPAY.md](./CONFIGURAR_WEBHOOK_ABACATEPAY.md) - Webhook
- ✅ [CHECKLIST_DEPLOY.md](./CHECKLIST_DEPLOY.md) - Checklist
- 📚 [GUIA_DEPLOY_INDEX.md](./GUIA_DEPLOY_INDEX.md) - Índice

---

*Última atualização: Outubro 2025*

