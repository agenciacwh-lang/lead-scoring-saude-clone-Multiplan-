# Lead Scoring Hapvida - Qualificação de Plano de Saúde

## 📋 Visão Geral

Sistema de qualificação de leads para planos de saúde da Hapvida. O site coleta dados do usuário através de um formulário e um quiz interativo, depois envia automaticamente para BotConversa e Google Sheets para análise e follow-up.

## 🎯 Funcionalidades

### Frontend
- ✅ Formulário de captura de dados (nome, telefone, email, cidade)
- ✅ Quiz interativo com 6 perguntas sobre saúde
- ✅ Página de agradecimento com design Hapvida
- ✅ Persistência de dados com localStorage
- ✅ Design responsivo e moderno
- ✅ Integração com WhatsApp

### Backend
- ✅ API tRPC para comunicação frontend-backend
- ✅ Integração com BotConversa (webhook)
- ✅ Integração com Google Sheets (automação)
- ✅ Sistema de scoring de leads (frio/morno/quente)
- ✅ Autenticação OAuth Manus
- ✅ Banco de dados MySQL/TiDB

## 📦 Stack Tecnológico

### Frontend
- React 19
- TypeScript
- Tailwind CSS 4
- Vite
- wouter (roteamento)
- Lucide Icons

### Backend
- Express 4
- tRPC 11
- Drizzle ORM
- MySQL/TiDB
- Node.js 22

### Integrações
- BotConversa (automação de leads)
- Google Sheets (armazenamento de dados)
- Manus OAuth (autenticação)

## 🚀 Deploy

### Opção 1: Manus (Recomendado)
O site já está pronto para publicar na plataforma Manus com um clique!

### Opção 2: Hostinger
Seguir o guia em `HOSTINGER_DEPLOY.md` para fazer deploy em servidor próprio.

### Opção 3: Outro Servidor
O projeto é um aplicação Node.js padrão que pode ser deployada em qualquer servidor com Node.js 22+.

## 📁 Estrutura do Projeto

```
lead-scoring-saude/
├── client/                      # Frontend React
│   ├── src/
│   │   ├── pages/              # Páginas (Home, Obrigado, etc)
│   │   ├── components/         # Componentes React
│   │   ├── contexts/           # Contextos (LeadContext, etc)
│   │   ├── lib/                # Utilitários (tRPC, quiz data)
│   │   └── App.tsx             # Componente raiz
│   └── index.html              # HTML principal
├── server/                      # Backend Express
│   ├── routers/                # Rotas tRPC
│   ├── services/               # Serviços (BotConversa, Sheets, etc)
│   ├── db.ts                   # Query helpers
│   └── _core/                  # Framework core
├── drizzle/                     # Migrações do banco
│   ├── schema.ts               # Definição de tabelas
│   └── migrations/             # Arquivos de migração
├── dist/                        # Build de produção
├── package.json                # Dependências
├── vite.config.ts              # Configuração Vite
├── tsconfig.json               # Configuração TypeScript
├── HOSTINGER_DEPLOY.md         # Guia de deploy
└── SETUP_HOSTINGER.txt         # Setup rápido
```

## 🔧 Configuração

### Variáveis de Ambiente Necessárias

```
DATABASE_URL                    # Conexão com MySQL
VITE_APP_ID                     # ID da app Manus OAuth
OAUTH_SERVER_URL                # URL do servidor OAuth
JWT_SECRET                      # Chave para JWT
BOTCONVERSA_WEBHOOK_URL         # Webhook do BotConversa
GOOGLE_SHEETS_WEBHOOK_URL       # Webhook do Google Sheets
BUILT_IN_FORGE_API_KEY          # Chave da API Manus
```

## 📊 Fluxo de Dados

1. **Usuário acessa o site**
   - Vê formulário com logo Hapvida
   - Preenche: nome, telefone, email, cidade

2. **Quiz Interativo**
   - 6 perguntas sobre saúde
   - Respostas são salvas localmente

3. **Página de Agradecimento**
   - Dados são enviados para BotConversa
   - Dados são enviados para Google Sheets
   - Usuário pode clicar em "Falar no WhatsApp"

4. **Automação**
   - BotConversa recebe lead com scoring
   - Google Sheets registra todos os dados
   - Sistema de follow-up é acionado

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Testes incluem:
# - BotConversa Service
# - Google Sheets Sync
# - Auth Logout
```

## 📝 Notas Importantes

### Números de Telefone
- O sistema remove caracteres especiais automaticamente
- Envia apenas dígitos para BotConversa

### Scoring de Leads
- **Frio**: Menos de 50 pontos
- **Morno**: 50-75 pontos
- **Quente**: Mais de 75 pontos

### Persistência de Dados
- Dados são salvos em localStorage
- Se o usuário recarregar a página, os dados são recuperados
- Após envio bem-sucedido, os dados são limpos

### Integrações
- BotConversa: Recebe leads para automação
- Google Sheets: Armazena histórico de todos os leads
- WhatsApp: Link para contato direto

## 🐛 Troubleshooting

### Dados não chegam no BotConversa
- Verificar BOTCONVERSA_WEBHOOK_URL
- Testar webhook manualmente
- Verificar logs do servidor

### Erro de conexão com banco
- Verificar DATABASE_URL
- Verificar credenciais MySQL
- Verificar firewall

### Página em branco
- Verificar console do navegador (F12)
- Verificar logs do servidor
- Limpar cache do navegador

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte os arquivos de documentação
2. Verifique os logs do servidor
3. Teste as integrações manualmente

## 📄 Licença

Projeto desenvolvido para Hapvida.

---

**Última atualização**: 12 de maio de 2026
**Versão**: 1.0.0
**Status**: Pronto para produção ✅
