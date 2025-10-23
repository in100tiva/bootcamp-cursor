# Teste de Componentes shadcn/ui

## Como Verificar se os Componentes Estão Funcionando

### 1. Servidor de Desenvolvimento
O servidor já está rodando em segundo plano. Acesse:
```
http://localhost:5173
```

### 2. Verificações Visuais

#### ✅ Botões (Button)
- Devem ter cor azul primária por padrão
- Hover deve escurecer levemente
- Bordas arredondadas (0.75rem)

#### ✅ Cards
- Fundo branco com sombra sutil
- Bordas arredondadas
- Espaçamento interno consistente

#### ✅ Inputs e Formulários
- Borda cinza clara
- Focus ring azul quando clicado
- Labels com cor cinza escura

#### ✅ Calendar (Date Picker)
- Deve mostrar dias do mês corretamente
- Data de hoje destacada
- Dias selecionados em azul
- Navegação entre meses funcional

#### ✅ Alerts e Badges
- Cores de status funcionando:
  - Pendente: Amarelo
  - Confirmado: Verde
  - Cancelado: Vermelho
  - Concluído: Azul

#### ✅ Toaster (Notificações)
- Toast deve aparecer no canto da tela
- Ícones apropriados para cada tipo
- Animação de entrada/saída suave

### 3. Verificação no Console
Abra o DevTools (F12) e verifique:
- ❌ NÃO deve haver erros relacionados a:
  - `Cannot find module`
  - `Zod version mismatch`
  - `date-fns locale`
  - `react-day-picker`
  
- ✅ Deve ver:
  - Vite carregando corretamente
  - React rodando sem warnings críticos

### 4. Teste de Funcionalidades

#### Página Inicial (/)
- [ ] Hero section com botão "Agendar Consulta"
- [ ] Cards com informações
- [ ] Design responsivo

#### Página de Agendamento (/agendar)
- [ ] Seleção de data (Calendar funcionando)
- [ ] Cards de profissionais
- [ ] Formulário com validação
- [ ] Navegação entre steps
- [ ] Confirmação final

#### Painel Admin (/admin/login)
- [ ] Formulário de login
- [ ] Campos com validação
- [ ] Botão de submit estilizado

### 5. Teste de Tema (Opcional)
As variáveis CSS estão configuradas em `src/style.css`:
- Tema claro (padrão)
- Tema escuro (adicione classe `dark` no `<html>`)

### 6. Comandos Úteis

```bash
# Parar o servidor (Ctrl+C no terminal)

# Rebuild completo se necessário
npm run build

# Verificar tipos TypeScript
npx tsc --noEmit

# Limpar cache do Vite
rm -rf node_modules/.vite
npm run dev
```

## Problemas Comuns

### Estilos não aplicados?
1. Verifique se o servidor reiniciou após as mudanças
2. Limpe o cache do navegador (Ctrl+Shift+R)
3. Verifique se `src/style.css` está sendo importado no `main.tsx`

### Erros de importação?
1. Verifique se todos os arquivos têm `from 'date-fns/locale/pt-BR'`
2. Reinicie o servidor
3. Verifique se o `@/` alias está funcionando no `vite.config.ts`

### Calendar não funciona?
- Verifique se `react-day-picker@8.10.1` está instalado
- O componente deve usar a API antiga (não a v9)

## Resultado Esperado
✅ Todos os componentes shadcn/ui devem estar:
- Visualmente corretos
- Com estilos aplicados
- Funcionais e interativos
- Responsivos
- Sem erros no console




