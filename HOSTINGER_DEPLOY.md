# Guia de Deploy para Hostinger

## Pré-requisitos
- Node.js 22+ instalado no servidor
- npm ou pnpm instalado
- Banco de dados MySQL/TiDB configurado

## Passos para Deploy

### 1. Upload dos Arquivos
```bash
# Fazer upload de todos os arquivos do projeto para o servidor Hostinger
# Recomendado: usar SFTP ou Git
```

### 2. Instalar Dependências
```bash
cd /caminho/do/projeto
pnpm install
# ou
npm install
```

### 3. Configurar Variáveis de Ambiente
Criar arquivo `.env` na raiz do projeto com as variáveis necessárias (ver seção de Secrets abaixo)

### 4. Fazer Build
```bash
pnpm build
```

### 5. Executar o Servidor
```bash
# Opção 1: Node direto
node dist/index.js

# Opção 2: Com PM2 (recomendado para produção)
npm install -g pm2
pm2 start dist/index.js --name "lead-scoring-saude"
```

### 6. Configurar Reverse Proxy (Nginx/Apache)
Se usando Nginx:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7. SSL (HTTPS)
Usar Let's Encrypt:
```bash
certbot certonly --nginx -d seu-dominio.com
```

## Variáveis de Ambiente Necessárias

```
DATABASE_URL=mysql://usuario:senha@host:porta/banco_dados
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
JWT_SECRET=sua_chave_secreta_jwt
OWNER_OPEN_ID=seu_owner_id
OWNER_NAME=seu_nome
BOTCONVERSA_WEBHOOK_URL=https://new-backend.botconversa.com.br/api/v1/webhooks-automation/catch/171551/d6MvHVh47DPY/
GOOGLE_SHEETS_WEBHOOK_URL=seu_webhook_google_sheets
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend
VITE_ANALYTICS_ENDPOINT=seu_endpoint
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
```

## Estrutura de Pastas
```
lead-scoring-saude/
├── client/              # Frontend React
├── server/              # Backend Express
├── drizzle/             # Migrações do banco
├── dist/                # Build de produção
├── package.json
├── .env                 # Variáveis de ambiente
└── pnpm-lock.yaml
```

## Troubleshooting

### Erro de conexão com banco de dados
- Verificar DATABASE_URL
- Verificar credenciais do MySQL
- Verificar firewall

### Erro de OAuth
- Verificar VITE_APP_ID
- Verificar OAUTH_SERVER_URL
- Verificar se domínio está registrado

### Erro de BotConversa
- Verificar BOTCONVERSA_WEBHOOK_URL
- Testar webhook manualmente

## Monitoramento
```bash
# Ver logs
pm2 logs lead-scoring-saude

# Reiniciar
pm2 restart lead-scoring-saude

# Parar
pm2 stop lead-scoring-saude
```

## Backup
Fazer backup regular do banco de dados:
```bash
mysqldump -u usuario -p banco_dados > backup.sql
```

## Suporte
Para dúvidas sobre deploy, consulte a documentação da Hostinger ou entre em contato com o suporte.
