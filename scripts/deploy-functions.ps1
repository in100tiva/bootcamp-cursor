# Script PowerShell para fazer deploy das Edge Functions no Supabase
# Execute: .\scripts\deploy-functions.ps1

Write-Host "🚀 Iniciando deploy das Edge Functions..." -ForegroundColor Cyan
Write-Host ""

# Verificar se o Supabase CLI está instalado
$supabaseCmd = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseCmd) {
    Write-Host "❌ Supabase CLI não está instalado." -ForegroundColor Red
    Write-Host "Instale com: scoop install supabase (Windows)" -ForegroundColor Yellow
    Write-Host "Ou baixe em: https://github.com/supabase/cli/releases" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Supabase CLI encontrado" -ForegroundColor Green
Write-Host ""

# Deploy das functions
Write-Host "📦 Deploy: create-pix-payment" -ForegroundColor Blue
supabase functions deploy create-pix-payment

Write-Host ""
Write-Host "📦 Deploy: check-payment-status" -ForegroundColor Blue
supabase functions deploy check-payment-status

Write-Host ""
Write-Host "📦 Deploy: webhook-abacate-pay" -ForegroundColor Blue
supabase functions deploy webhook-abacate-pay

Write-Host ""
Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Não esqueça de:" -ForegroundColor Yellow
Write-Host "1. Configurar as variáveis de ambiente no Supabase Dashboard"
Write-Host "2. Configurar o webhook no Abacate Pay"
Write-Host ""

