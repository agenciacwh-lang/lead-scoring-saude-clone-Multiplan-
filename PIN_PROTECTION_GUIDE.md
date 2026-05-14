# Guia de Proteção por PIN - Dashboard

## 📋 Visão Geral

O dashboard agora possui proteção por PIN de 4 dígitos. Usuários devem inserir o PIN correto antes de acessar o dashboard. O PIN é armazenado na sessão do navegador, então o usuário só precisa inserir uma vez por sessão.

### Características

- ✅ PIN de 4 dígitos simples
- ✅ Máximo de 3 tentativas (configurável)
- ✅ Bloqueio de 5 minutos após máximo de tentativas
- ✅ Indicador visual de tentativas restantes
- ✅ Opção de mostrar/ocultar PIN
- ✅ Suporte a entrada via teclado (Enter para submeter)
- ✅ Armazenamento em sessionStorage (limpo ao fechar navegador)

---

## 🔐 Configuração

### PIN Padrão

O PIN padrão é **1234**. Para alterar, edite o arquivo `client/src/pages/Dashboard.tsx`:

```typescript
// Linha 46
if (!isPinUnlocked) {
  return <PinProtection onUnlock={handlePinUnlock} correctPin="NOVO_PIN" maxAttempts={3} />;
}
```

### Máximo de Tentativas

O padrão é 3 tentativas. Para alterar, modifique o parâmetro `maxAttempts`:

```typescript
<PinProtection onUnlock={handlePinUnlock} correctPin="1234" maxAttempts={5} />
```

---

## 🎯 Como Usar

### Acessar o Dashboard

1. Navegue para `/dashboardcwh`
2. Tela de PIN aparecerá
3. Digite o PIN de 4 dígitos
4. Clique em "Acessar" ou pressione Enter
5. Dashboard carregará

### Mostrar/Ocultar PIN

Clique no botão com os círculos (●●●● ou ○○○○) para alternar a visibilidade do PIN.

### Limpar PIN

Clique em "Limpar" para remover o PIN digitado e começar novamente.

### Tentativas Bloqueadas

Se exceder o máximo de tentativas, uma mensagem aparecerá:
```
Muitas tentativas. Tente novamente em 5 minutos.
```

Aguarde 5 minutos ou feche o navegador e abra novamente.

---

## 🏗️ Arquitetura

### Componente PinProtection

**Arquivo**: `client/src/components/PinProtection.tsx`

Props:
- `onUnlock: () => void` - Callback quando PIN é correto
- `correctPin: string` - PIN correto (4 dígitos)
- `maxAttempts?: number` - Máximo de tentativas (padrão: 3)

### Integração no Dashboard

**Arquivo**: `client/src/pages/Dashboard.tsx`

```typescript
// Estado de desbloqueio
const [isPinUnlocked, setIsPinUnlocked] = useState(false);

// Verificar se já foi desbloqueado na sessão
useEffect(() => {
  const unlocked = sessionStorage.getItem('dashboardPinUnlocked');
  if (unlocked === 'true') {
    setIsPinUnlocked(true);
  }
}, []);

// Callback de desbloqueio
const handlePinUnlock = () => {
  setIsPinUnlocked(true);
  sessionStorage.setItem('dashboardPinUnlocked', 'true');
};

// Se não desbloqueado, mostrar tela de PIN
if (!isPinUnlocked) {
  return <PinProtection onUnlock={handlePinUnlock} correctPin="1234" maxAttempts={3} />;
}
```

---

## 🧪 Testes

### Testes Unitários

Localização: `server/services/pinValidation.test.ts`

Cobertura de testes:
- ✅ Validação de PIN correto/incorreto
- ✅ Validação de comprimento
- ✅ Contagem de tentativas
- ✅ Bloqueio após máximo de tentativas
- ✅ Desbloqueio manual
- ✅ Sanitização de entrada
- ✅ PIN customizado
- ✅ maxAttempts customizado
- ✅ Casos extremos (zeros, números altos, entrada vazia)

Executar testes:
```bash
pnpm test
```

---

## 🔒 Segurança

### Considerações Importantes

1. **PIN em Produção**: Altere o PIN padrão (1234) antes de fazer deploy
2. **HTTPS**: Use HTTPS em produção para proteger a transmissão do PIN
3. **Session Storage**: O PIN é armazenado em sessionStorage (limpo ao fechar navegador)
4. **Sem Persistência**: O PIN não é armazenado no servidor
5. **Bloqueio Temporário**: Bloqueio de 5 minutos após máximo de tentativas

### Melhorias Futuras

- [ ] Armazenar PIN hash no servidor
- [ ] Adicionar autenticação por JWT
- [ ] Implementar rate limiting
- [ ] Adicionar logs de acesso
- [ ] Notificações de acesso suspeito

---

## 🐛 Troubleshooting

### PIN não funciona

**Sintoma**: PIN correto é rejeitado

**Solução**:
1. Verifique se o PIN está correto em `Dashboard.tsx`
2. Limpe o cache do navegador
3. Feche e reabra o navegador
4. Verifique o console (F12) para erros

### Bloqueado por 5 minutos

**Sintoma**: Mensagem "Muitas tentativas"

**Solução**:
1. Aguarde 5 minutos
2. Ou feche o navegador e abra novamente (limpa sessionStorage)
3. Ou use Ctrl+Shift+Delete para limpar dados de site

### PIN visível quando não deveria

**Sintoma**: PIN aparece como texto em vez de pontos

**Solução**:
1. Clique no botão de mostrar/ocultar
2. Verifique se o input type está correto
3. Limpe o cache do navegador

---

## 📊 Fluxo de Acesso

```
┌─────────────────────┐
│   Acessar /dashboard│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│ Verificar sessionStorage    │
│ (dashboardPinUnlocked)      │
└──────────┬──────────────────┘
           │
      ┌────┴────┐
      │          │
   Sim│          │Não
      │          │
      ▼          ▼
  ┌─────────┐  ┌──────────────────┐
  │Dashboard│  │ Tela de PIN      │
  └─────────┘  │ - Input PIN      │
               │ - Validar        │
               │ - Contar Tentativas
               │ - Bloquear se >3 │
               └────┬─────────────┘
                    │
              ┌─────┴─────┐
              │            │
          Correto│     Incorreto│
              │            │
              ▼            ▼
        ┌──────────┐  ┌──────────────┐
        │Desbloquear│  │Erro + Tentativa
        │Dashboard  │  │Restante
        └──────────┘  └──────────────┘
```

---

## 💡 Dicas

### Alterar PIN Dinamicamente

Para alterar o PIN sem fazer deploy, você pode criar uma variável de ambiente:

```typescript
const correctPin = process.env.VITE_DASHBOARD_PIN || '1234';
```

Então defina em `.env`:
```
VITE_DASHBOARD_PIN=5678
```

### Desabilitar PIN Temporariamente

Para desabilitar o PIN durante desenvolvimento:

```typescript
// Descomente para desabilitar PIN
// if (!isPinUnlocked) {
//   return <PinProtection onUnlock={handlePinUnlock} correctPin="1234" maxAttempts={3} />;
// }
```

### Adicionar Logs de Acesso

Você pode adicionar logs quando o PIN é inserido corretamente:

```typescript
const handlePinUnlock = () => {
  console.log('[Dashboard] PIN desbloqueado em:', new Date().toISOString());
  setIsPinUnlocked(true);
  sessionStorage.setItem('dashboardPinUnlocked', 'true');
};
```

---

## 📚 Referências

- [Session Storage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
- [React Hooks](https://react.dev/reference/react/hooks)
- [Vitest](https://vitest.dev/)

---

**Versão**: 1.0.0  
**Data**: 14 de Maio de 2026  
**Status**: ✅ Pronto para Produção
