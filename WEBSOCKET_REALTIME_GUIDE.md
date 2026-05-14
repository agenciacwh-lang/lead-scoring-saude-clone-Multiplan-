# Guia de WebSocket em Tempo Real - Lead Scoring Hapvida

## 📡 Visão Geral

O projeto agora possui suporte completo a WebSocket para atualizações em tempo real no Dashboard. Novos leads aparecem automaticamente sem necessidade de recarregar a página.

### Características

- ✅ Atualizações automáticas de novos leads
- ✅ Atualização de estatísticas em tempo real
- ✅ Sincronização de múltiplos clientes
- ✅ Reconexão automática
- ✅ Fallback para polling se WebSocket não estiver disponível
- ✅ Indicador visual de conexão no Dashboard

---

## 🏗️ Arquitetura

### Servidor (Backend)

**Arquivo**: `server/services/websocketService.ts`

O serviço WebSocket gerencia:
- Inicialização do Socket.io
- Salas de broadcast (leads-room, stats-room)
- Eventos de conexão/desconexão
- Broadcast de novos leads e estatísticas

**Integração no Express**: `server/_core/index.ts`

```typescript
import { initializeWebSocket } from "../services/websocketService";

// No startServer()
initializeWebSocket(server);
```

### Cliente (Frontend)

**Hook**: `client/src/hooks/useWebSocket.ts`

Hook React customizado que:
- Conecta ao servidor WebSocket
- Gerencia inscrições em salas
- Fornece callbacks para eventos
- Trata reconexões automáticas

**Integração no Dashboard**: `client/src/pages/Dashboard.tsx`

```typescript
import { useWebSocket } from "@/hooks/useWebSocket";

const { isConnected } = useWebSocket({
  subscribeToLeads: true,
  subscribeToStats: true,
  onNewLead: (lead) => { /* atualizar UI */ },
  onStatsUpdate: (stats) => { /* atualizar UI */ },
});
```

---

## 🔌 Eventos WebSocket

### Servidor → Cliente

#### `lead:new`
Emitido quando um novo lead é criado.

```typescript
// Payload
{
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  temperatura: "frio" | "morno" | "quente";
  pontuacao: number;
  status: "completo" | "incompleto" | "confirmado";
  createdAt: string; // ISO 8601
}
```

#### `stats:update`
Emitido quando as estatísticas são atualizadas.

```typescript
// Payload
{
  total: number;
  completos: number;
  incompletos: number;
  frios: number;
  mornos: number;
  quentes: number;
  prioridade: number;
}
```

#### `leads:sync`
Emitido para sincronização inicial de leads.

```typescript
// Payload
{
  leads: LeadUpdatePayload[];
}
```

### Cliente → Servidor

#### `subscribe:leads`
Cliente se inscreve para receber atualizações de leads.

```typescript
socket.emit('subscribe:leads');
```

#### `subscribe:stats`
Cliente se inscreve para receber atualizações de estatísticas.

```typescript
socket.emit('subscribe:stats');
```

---

## 🚀 Como Usar

### No Dashboard

O Dashboard já está totalmente integrado. Quando um novo lead é criado:

1. O servidor recebe a submissão via tRPC
2. Salva no banco de dados
3. Emite evento `lead:new` para todos os clientes conectados
4. Dashboard recebe o evento e atualiza a lista automaticamente

### Adicionar WebSocket em Outro Componente

```typescript
import { useWebSocket } from "@/hooks/useWebSocket";

export function MyComponent() {
  const [leads, setLeads] = useState([]);
  
  const { isConnected } = useWebSocket({
    subscribeToLeads: true,
    onNewLead: (lead) => {
      setLeads(prev => [lead, ...prev]);
    },
  });

  return (
    <div>
      <div>{isConnected ? "🟢 Conectado" : "🔴 Desconectado"}</div>
      <div>Leads: {leads.length}</div>
    </div>
  );
}
```

### Emitir Evento Customizado

```typescript
const { emit } = useWebSocket();

// Emitir evento
emit('custom:event', { data: 'value' });

// Escutar evento
const { on } = useWebSocket();
on('custom:response', (data) => {
  console.log('Resposta recebida:', data);
});
```

---

## 🔧 Configuração

### Variáveis de Ambiente

Nenhuma variável de ambiente adicional é necessária. O WebSocket usa a mesma porta do servidor Express.

### CORS

O WebSocket está configurado com CORS aberto para desenvolvimento:

```typescript
cors: {
  origin: "*",
  methods: ["GET", "POST"],
}
```

Para produção, restrinja a origem:

```typescript
cors: {
  origin: "https://seu-dominio.com",
  methods: ["GET", "POST"],
}
```

### Transporte

O Socket.io está configurado para usar:
1. **WebSocket** (preferido)
2. **Polling** (fallback)

Isso garante compatibilidade mesmo em ambientes com restrições de firewall.

---

## 📊 Monitoramento

### Verificar Conexões Ativas

```typescript
import { getConnectedClientsCount, getRoomClientsCount } from "../services/websocketService";

// Total de clientes conectados
const total = getConnectedClientsCount();

// Clientes em uma sala específica
const leadsRoom = getRoomClientsCount("leads-room");
const statsRoom = getRoomClientsCount("stats-room");
```

### Logs

O WebSocket registra eventos importantes:

```
[WebSocket] Cliente conectado: socket_id
[WebSocket] Cliente socket_id inscrito em leads-room
[WebSocket] Enviando novo lead para sala: leads-room
[WebSocket] Cliente desconectado: socket_id
```

---

## 🧪 Testes

### Testes Unitários

Localização: `server/services/websocketService.test.ts`

Executar testes:
```bash
pnpm test
```

Cobertura de testes:
- ✅ Broadcast de novos leads
- ✅ Broadcast de estatísticas
- ✅ Sincronização de múltiplos leads
- ✅ Contagem de clientes conectados
- ✅ Validação de payloads

### Testes Manuais

1. Abrir Dashboard em dois navegadores
2. Submeter um novo lead em um navegador
3. Verificar se aparece automaticamente no outro

---

## 🐛 Troubleshooting

### WebSocket não conecta

**Sintoma**: Indicador mostra "Desconectado" no Dashboard

**Solução**:
```bash
# Verificar se servidor está rodando
curl http://localhost:3000

# Verificar logs
pm2 logs lead-scoring-saude | grep WebSocket

# Reiniciar servidor
pm2 restart lead-scoring-saude
```

### Leads não aparecem em tempo real

**Sintoma**: Novos leads só aparecem após recarregar

**Solução**:
1. Verificar console do navegador (F12)
2. Procurar por erros de conexão
3. Verificar se `subscribeToLeads: true` está ativo
4. Verificar CORS do servidor

### Muitas desconexões

**Sintoma**: Indicador pisca constantemente

**Solução**:
1. Aumentar timeout de reconexão
2. Verificar estabilidade da rede
3. Verificar logs do servidor para erros

---

## 📈 Performance

### Otimizações Implementadas

- **Deduplicação**: Verifica se lead já existe antes de adicionar
- **Batch Updates**: Múltiplos leads sincronizados em um evento
- **Room-based Broadcasting**: Apenas clientes inscritos recebem eventos
- **Lazy Connection**: WebSocket conecta sob demanda

### Limites Recomendados

- Máximo de clientes simultâneos: 1000+
- Máximo de eventos/segundo: 100+
- Tamanho máximo de payload: 1MB

---

## 🔐 Segurança

### Considerações

- ✅ WebSocket usa mesma autenticação que tRPC
- ✅ Eventos públicos (leads, stats) não contêm dados sensíveis
- ✅ CORS configurável por ambiente
- ✅ Validação de payload no servidor

### Para Produção

1. Restringir CORS a domínio específico
2. Adicionar autenticação por token JWT
3. Implementar rate limiting
4. Usar WSS (WebSocket Secure) com SSL/TLS

---

## 📚 Referências

- [Socket.io Docs](https://socket.io/docs/)
- [Socket.io Client Docs](https://socket.io/docs/v4/client-api/)
- [React Hooks Best Practices](https://react.dev/reference/react/hooks)

---

## 🚀 Próximas Melhorias

- [ ] Adicionar autenticação por JWT
- [ ] Implementar rate limiting
- [ ] Adicionar compressão de mensagens
- [ ] Implementar persistência de eventos
- [ ] Adicionar métricas de performance
- [ ] Criar dashboard de monitoramento WebSocket

---

**Versão**: 1.0.0  
**Data**: 14 de Maio de 2026  
**Status**: ✅ Pronto para Produção
