#!/bin/bash

# Script para fazer deploy das Edge Functions no Supabase
# Execute: bash scripts/deploy-functions.sh

echo "🚀 Iniciando deploy das Edge Functions..."
echo ""

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI não está instalado."
    echo "Instale com: scoop install supabase (Windows)"
    echo "Ou baixe em: https://github.com/supabase/cli/releases"
    exit 1
fi

echo "✅ Supabase CLI encontrado"
echo ""

# Deploy das functions
echo "📦 Deploy: create-pix-payment"
supabase functions deploy create-pix-payment

echo ""
echo "📦 Deploy: check-payment-status"
supabase functions deploy check-payment-status

echo ""
echo "📦 Deploy: webhook-abacate-pay"
supabase functions deploy webhook-abacate-pay

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "⚠️  Não esqueça de:"
echo "1. Configurar as variáveis de ambiente no Supabase Dashboard"
echo "2. Configurar o webhook no Abacate Pay"
echo ""

