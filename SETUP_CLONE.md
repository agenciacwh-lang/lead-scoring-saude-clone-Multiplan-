# 🏥 Simulador Hapvida - Clone (Nova Campanha)

Este é um clone exato do projeto "Simulador Hapvida" com banco de dados e webhooks novos para uma campanha isolada.

---

## 📋 Checklist de Setup

### 1️⃣ Banco de Dados Supabase

- [ ] Criar novo projeto Supabase
- [ ] Copiar a string de conexão `DATABASE_URL`
- [ ] Abrir SQL Editor no Supabase
- [ ] Executar o script `SQL_SETUP.sql` (arquivo neste repositório)
- [ ] Verificar se as tabelas `users` e `leads` foram criadas

### 2️⃣ Variáveis de Ambiente

Criar arquivo `.env` na raiz do projeto com:

```env
# Database
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]

# OAuth Manus
VITE_APP_ID=seu_app_id_aqui
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im

# Webhooks
BOTCONVERSA_WEBHOOK_URL=https://seu-webhook-botconversa.com/webhook
GOOGLE_SHEETS_WEBHOOK_URL=https://seu-webhook-google-sheets.com/webhook

# Outros
JWT_SECRET=sua_chave_jwt_secreta_aqui
OWNER_NAME=Seu Nome
OWNER_OPEN_ID=seu_open_id
```

### 3️⃣ Dependências

```bash
pnpm install
```

### 4️⃣ Migrations do Banco

```bash
pnpm db:push
```

### 5️⃣ Iniciar Desenvolvimento

```bash
pnpm dev
```

---

## 🔧 Arquitetura do Backend

### Fluxo de Dados do Lead

```
1. Formulário Frontend
   ↓
2. Validação (LeadForm.tsx)
   ↓
3. Quiz (6 perguntas)
   ↓
4. Cálculo de Score (calculateLeadScore)
   ↓
5. Envio para Backend (trpc.leads.submit)
   ↓
6. Salvar no Supabase
   ↓
7. Formatar Valores (acima_6000 → "Acima de R$ 6.000")
   ↓
8. Enviar para BotConversa (webhook)
   ↓
9. Enviar para Google Sheets (webhook)
```

### Estrutura de Payload para BotConversa

**⚠️ IMPORTANTE: Todos os campos na RAIZ do JSON (não aninhados)**

```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "5585987654321",
  "cidade": "Fortaleza",
  "pontuacao": 8,
  "temperatura": "Quente",
  "tempo_compra": "O quanto antes",
  "situacao_atual": "Tenho e quero trocar",
  "renda": "Acima de R$ 6.000",
  "criterio_escolha": "Qualidade e atendimento",
  "cnpj_mei": "Sim, tenho CNPJ/MEI",
  "idades": "35, 32, 8"
}
```

### Dicionário de Tradução (valueMapper.ts)

Antes de enviar para BotConversa, os valores são traduzidos:

| Valor Bruto | Valor Formatado |
|---|---|
| `sim_cnpj` | Sim, tenho CNPJ/MEI |
| `nao_pessoa_fisica` | Não, sou pessoa física |
| `acima_6000` | Acima de R$ 6.000 |
| `1500_3000` | R$ 1.500 a R$ 3.000 |
| `quanto_antes` | O quanto antes |
| `proximos_meses` | Nos próximos meses |
| `tenho_quero_trocar` | Tenho e quero trocar |
| `qualidade_atendimento` | Qualidade e atendimento |

---

## 📁 Arquivos Críticos

### Backend

- `server/routers/leadsRouter.ts` - Lógica de submissão de leads
- `server/services/botconversaService.ts` - Envio para BotConversa
- `server/services/sheetsSync.ts` - Envio para Google Sheets
- `server/utils/valueMapper.ts` - Dicionário de tradução
- `drizzle/schema.ts` - Schema do banco de dados

### Frontend

- `client/src/components/LeadForm.tsx` - Formulário de dados pessoais
- `client/src/components/Quiz.tsx` - Quiz de 6 perguntas
- `client/src/contexts/LeadContext.tsx` - Contexto global de leads
- `client/src/lib/quizData.ts` - Perguntas e opções do quiz

---

## 🚀 Deploy

### Hostinger / Servidor Próprio

1. Push para GitHub
2. Pull no servidor
3. `pnpm install`
4. `pnpm build`
5. Configurar variáveis de ambiente no servidor
6. Iniciar com PM2 ou similar

### Manus Platform

1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático

---

## ✅ Validação

Após setup, teste:

1. **Formulário**: Preencher nome, telefone, email, cidade
2. **Quiz**: Responder todas as 6 perguntas
3. **Submissão**: Verificar se o lead foi salvo no Supabase
4. **Webhooks**: Verificar se BotConversa e Google Sheets receberam os dados
5. **Formatação**: Confirmar que valores estão legíveis (ex: "Acima de R$ 6.000")

---

## 📞 Suporte

Para dúvidas ou problemas:
- Verificar logs do servidor
- Confirmar variáveis de ambiente
- Testar webhooks com Postman

---

## 📝 Notas

- Este é um clone exato do projeto original
- Mesma interface, cores, operadora e perguntas
- Banco de dados e webhooks completamente isolados
- Pronto para campanha independente

---

**Criado em:** 2026-05-19
**Versão:** 1.0.0
