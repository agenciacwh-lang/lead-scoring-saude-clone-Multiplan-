# Guia de Troubleshooting - Leads Não Aparecem no Dashboard

## 🔍 Diagnóstico Rápido

Se os leads que você preencheu não estão aparecendo no dashboard, siga este guia passo a passo.

---

## 📋 Checklist de Verificação

### 1. Verificar se o Lead Foi Criado

**Passo 1: Abrir Console do Navegador**
- Pressione `F12` para abrir o DevTools
- Vá para a aba "Console"
- Procure por mensagens com `[Lead]` ou `[Dashboard]`

**Passo 2: Procurar por Logs de Envio**
```
[Lead] Enviando lead para automação: { nome: "...", email: "...", ... }
[Lead] Lead enviado com sucesso para automação
```

Se você vir essas mensagens, o lead foi enviado para o backend. ✅

**Passo 3: Se Não Vir Logs de Envio**
- Verifique se você completou TODO o quiz até a página de agradecimento (`/obrigado` ou `/confirmado`)
- Verifique se há mensagem de erro: `[Lead] Erro ao enviar lead:`
- Verifique se os dados do formulário foram preenchidos corretamente

---

### 2. Verificar Conexão WebSocket

**Passo 1: Procurar por Logs WebSocket**
```
[WebSocket Hook] Conectando a: ws://...
[WebSocket Hook] Conectado com ID: socket_id
[WebSocket Hook] Novo lead recebido: { ... }
```

**Passo 2: Se Não Conectar**
- Verifique se o servidor está rodando
- Verifique se há erro de CORS
- Tente recarregar a página

**Passo 3: Se Conectar mas Não Receber Leads**
- Verifique se o lead foi realmente criado no banco (veja seção abaixo)
- Verifique se há erro no broadcast: `[WebSocket] Enviando novo lead para sala`

---

### 3. Verificar Banco de Dados

**Passo 1: Acessar o Painel de Banco de Dados**
- Vá para o Management UI do projeto Manus
- Clique em "Database"
- Procure pela tabela `leads`

**Passo 2: Verificar se o Lead Existe**
- Procure pelo email ou nome do lead que você preencheu
- Verifique se a data `createdAt` é recente
- Verifique se o status é `completo`, `incompleto` ou `confirmado`

**Passo 3: Se o Lead Não Existir**
- O problema está na criação do lead (não chegou ao backend)
- Veja a seção "Verificar Logs do Servidor" abaixo

**Passo 4: Se o Lead Existir mas Não Aparecer no Dashboard**
- O problema está no WebSocket ou no carregamento inicial
- Veja a seção "Verificar Logs do Servidor" abaixo

---

### 4. Verificar Logs do Servidor

**Passo 1: Abrir Logs do Servidor**
- No Management UI, clique em "Dashboard"
- Procure por "Recent output" ou "Logs"
- Procure por mensagens com `[Leads Router]` ou `[WebSocket]`

**Passo 2: Procurar por Logs de Criação**
```
[Leads Router] Recebido novo lead: João Silva joao@email.com
[Leads Router] Lead salvo no banco: { insertId: 123 }
[Leads Router] Enviando broadcast do novo lead com ID: 123
[WebSocket] Enviando novo lead para sala: leads-room
```

**Passo 3: Se Vir Esses Logs**
- O lead foi criado e o broadcast foi enviado
- O problema está no cliente (Dashboard não recebeu)
- Recarregue o Dashboard e verifique se o lead aparece

**Passo 4: Se Não Vir Esses Logs**
- O lead não chegou ao servidor
- Verifique se há erro na submissão do formulário
- Verifique se o tRPC está funcionando corretamente

---

## 🔧 Soluções Comuns

### Problema: "Lead enviado com sucesso" mas não aparece no dashboard

**Causa Provável**: WebSocket não está conectado ou o Dashboard não está inscrito na sala de leads

**Solução**:
1. Recarregue o Dashboard
2. Verifique se o indicador de conexão mostra 🟢 (conectado)
3. Abra o console e procure por `[WebSocket Hook] Conectado`
4. Se não conectar, reinicie o servidor

---

### Problema: "Erro ao enviar lead"

**Causa Provável**: Erro na validação dos dados ou no banco de dados

**Solução**:
1. Verifique o erro exato no console: `[Lead] Erro ao enviar lead: ...`
2. Verifique se todos os campos obrigatórios foram preenchidos
3. Verifique se o email é válido
4. Verifique se o servidor está rodando

---

### Problema: Dashboard mostra "Desconectado" 🔴

**Causa Provável**: Servidor WebSocket não está inicializado ou há problema de conexão

**Solução**:
1. Reinicie o servidor: `pnpm dev`
2. Verifique se não há erro na inicialização do WebSocket
3. Verifique se o servidor está rodando na porta correta
4. Tente acessar o Dashboard em uma aba diferente

---

### Problema: Leads aparecem mas depois desaparecem

**Causa Provável**: Página foi recarregada e o estado foi perdido

**Solução**:
- Isso é normal. O Dashboard carrega os leads do banco de dados ao abrir
- Se o lead foi criado, ele deve aparecer após recarregar
- Se não aparecer após recarregar, o lead não foi salvo no banco

---

## 📊 Fluxo Completo de um Lead

```
1. Usuário preenche formulário (Home)
   ↓
2. Usuário completa quiz (Quiz)
   ↓
3. Usuário é redirecionado para /obrigado ou /confirmado (Obrigado)
   ↓
4. useEffect no Obrigado envia lead para backend (tRPC)
   ↓
5. Backend recebe lead e salva no banco (Leads Router)
   ↓
6. Backend envia broadcast via WebSocket (broadcastNewLead)
   ↓
7. Dashboard recebe evento "lead:new" via WebSocket
   ↓
8. Dashboard adiciona lead à lista e exibe
```

Se o lead não aparecer, identifique em qual etapa o fluxo quebrou usando os logs.

---

## 🛠️ Ferramentas de Debug

### Verificar Conexão WebSocket
```javascript
// No console do navegador
socket.connected  // true se conectado
socket.id         // ID da conexão
socket.rooms      // Salas inscritas
```

### Verificar Dados do Lead
```javascript
// No console do navegador
// Procure por logs com [Lead] ou [Dashboard]
// Copie o payload e verifique se está correto
```

### Verificar Banco de Dados
- Use o Management UI → Database
- Procure pela tabela `leads`
- Verifique se o lead existe e tem os dados corretos

---

## 📞 Próximas Ações

Se ainda não conseguir resolver:

1. **Verifique os logs do servidor** (Management UI → Dashboard → Recent output)
2. **Verifique o console do navegador** (F12 → Console)
3. **Verifique o banco de dados** (Management UI → Database)
4. **Reinicie o servidor** (Management UI → Restart)
5. **Limpe o cache** (Ctrl+Shift+Delete)

---

## 📝 Informações Úteis

- **PIN do Dashboard**: 8814
- **Página de Agradecimento**: `/obrigado` (leads quentes/mornos) ou `/confirmado` (leads frios)
- **Banco de Dados**: Tabela `leads`
- **WebSocket**: Porta 3000 (mesma do servidor)
- **Logs do Servidor**: Management UI → Dashboard → Recent output

---

**Versão**: 1.0.0  
**Data**: 14 de Maio de 2026  
**Status**: ✅ Pronto para Diagnóstico
