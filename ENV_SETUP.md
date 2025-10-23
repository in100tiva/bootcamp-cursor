# Configuração de Variáveis de Ambiente

## Frontend (.env.local)

Crie um arquivo `.env.local` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## Edge Functions (Supabase Dashboard)

Configure no Supabase Dashboard → Settings → Edge Functions → Environment Variables:

```
ABACATE_PAY_API_KEY=abc_dev_n4LbGgxrHCFJRsZXQ4bBun2b
ABACATE_PAY_BASE_URL=https://api.abacatepay.com/v1
```

## Notas

- As variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são fornecidas automaticamente pelo Supabase nas Edge Functions
- Nunca commite arquivos `.env` para o repositório
- Use sempre HTTPS em produção

