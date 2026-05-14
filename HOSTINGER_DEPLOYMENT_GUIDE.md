# Guia Completo de Deploy - Lead Scoring Hapvida para Hostinger

## 📋 Resumo Executivo

Este é um aplicativo **Node.js 22+ com React 19 + Express + tRPC + MySQL** pronto para produção. O projeto foi validado com 100% de testes passando e todas as integrações funcionais.

### Características Principais
- ✅ Multi-step lead capture (Formulário → Quiz → Obrigado)
- ✅ Lead scoring automático (Frio/Morno/Quente)
- ✅ Integração BotConversa (webhook)
- ✅ Integração Google Sheets (webhook)
- ✅ Meta Pixel tracking (ID: 1404885653239987)
- ✅ Dashboard público sem autenticação (/dashboardcwh)
- ✅ Detecção de inatividade (10 minutos)
- ✅ Branding Multi Plan + Hapvida
- ✅ Redirecionamento de leads frios para /confirmado

---

## 🚀 Pré-requisitos

### No Servidor Hostinger
- **Node.js**: 22.x ou superior
- **npm/pnpm**: Gerenciador de pacotes
- **MySQL**: 8.0+ ou compatível (TiDB)
- **PM2**: Para gerenciamento de processos (recomendado)
- **Nginx/Apache**: Para reverse proxy (recomendado)

### Verificar Versões
```bash
node --version    # v22.x.x
npm --version     # 10.x.x ou superior
mysql --version   # 8.0+
```

---

## 📦 Passo 1: Upload do Projeto

### Opção A: Via SFTP
```bash
# Conectar via SFTP e fazer upload da pasta do projeto
# Recomendado: usar FileZilla ou WinSCP
# Destino: /home/seu-usuario/public_html/lead-scoring-saude/
```

### Opção B: Via Git
```bash
cd /home/seu-usuario/public_html
git clone <seu-repositorio> lead-scoring-saude
cd lead-scoring-saude
```

---

## 🔧 Passo 2: Instalar Dependências

```bash
cd /home/seu-usuario/public_html/lead-scoring-saude

# Instalar dependências
npm install
# ou
pnpm install
```

**Tempo esperado**: 3-5 minutos

---

## 🗄️ Passo 3: Configurar Banco de Dados

### 3.1 Criar Banco de Dados MySQL

```bash
# Via cPanel/Hostinger Admin
# Ou via SSH:
mysql -u seu-usuario -p

# No MySQL:
CREATE DATABASE lead_scoring_db;
CREATE USER 'lead_user'@'localhost' IDENTIFIED BY 'sua-senha-forte';
GRANT ALL PRIVILEGES ON lead_scoring_db.* TO 'lead_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3.2 Executar Migrações

```bash
cd /home/seu-usuario/public_html/lead-scoring-saude

# Gerar e executar migrações Drizzle
npm run db:push
```

**Nota**: Este comando cria todas as tabelas necessárias automaticamente.

---

## 🔐 Passo 4: Configurar Variáveis de Ambiente

### 4.1 Criar arquivo `.env`

```bash
cd /home/seu-usuario/public_html/lead-scoring-saude
nano .env
```

### 4.2 Adicionar Variáveis Necessárias

```env
# Banco de Dados
DATABASE_URL=mysql://lead_user:sua-senha-forte@localhost:3306/lead_scoring_db

# Servidor
NODE_ENV=production
PORT=3000

# OAuth (se usar autenticação Manus)
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
JWT_SECRET=sua-chave-secreta-jwt-muito-longa-e-aleatoria

# Proprietário
OWNER_OPEN_ID=seu_owner_id
OWNER_NAME=seu_nome

# Integrações
BOTCONVERSA_WEBHOOK_URL=https://new-backend.botconversa.com.br/api/v1/webhooks-automation/catch/171551/d6MvHVh47DPY/
GOOGLE_SHEETS_WEBHOOK_URL=seu_webhook_google_apps_script

# Manus APIs (se usar)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_api
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend

# Analytics (opcional)
VITE_ANALYTICS_ENDPOINT=seu_endpoint_analytics
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
```

### 4.3 Proteger o arquivo .env

```bash
chmod 600 .env
```

---

## 🏗️ Passo 5: Build de Produção

```bash
cd /home/seu-usuario/public_html/lead-scoring-saude

# Gerar build de produção
npm run build
```

**Resultado esperado**:
- `dist/index.js` - Servidor compilado (39KB)
- `dist/public/` - Arquivos estáticos (HTML, CSS, JS)

---

## ▶️ Passo 6: Iniciar o Servidor

### Opção A: PM2 (Recomendado para Produção)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicação
cd /home/seu-usuario/public_html/lead-scoring-saude
pm2 start dist/index.js --name "lead-scoring-saude"

# Configurar para iniciar ao rebootar
pm2 startup
pm2 save

# Verificar status
pm2 status
pm2 logs lead-scoring-saude
```

### Opção B: Node Direto

```bash
cd /home/seu-usuario/public_html/lead-scoring-saude
NODE_ENV=production node dist/index.js
```

### Opção C: Screen (Desenvolvimento)

```bash
screen -S lead-scoring
cd /home/seu-usuario/public_html/lead-scoring-saude
NODE_ENV=production node dist/index.js
# Pressionar Ctrl+A depois D para desanexar
```

---

## 🌐 Passo 7: Configurar Reverse Proxy (Nginx)

### 7.1 Criar Configuração Nginx

```bash
sudo nano /etc/nginx/sites-available/lead-scoring-saude
```

### 7.2 Adicionar Configuração

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Redirecionar HTTP para HTTPS (opcional)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    # Configurações SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Proxy para Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Servir arquivos estáticos com cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 7.3 Ativar Site

```bash
sudo ln -s /etc/nginx/sites-available/lead-scoring-saude /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Passo 8: SSL/HTTPS com Let's Encrypt

```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot certonly --nginx -d seu-dominio.com -d www.seu-dominio.com

# Auto-renovação
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## ✅ Passo 9: Verificar Funcionamento

### 9.1 Testar Servidor

```bash
# Verificar se servidor está rodando
curl http://localhost:3000

# Verificar logs
pm2 logs lead-scoring-saude

# Testar API tRPC
curl http://localhost:3000/api/trpc/leads.getAll
```

### 9.2 Testar no Navegador

1. Abrir `https://seu-dominio.com`
2. Verificar:
   - ✅ Formulário carrega corretamente
   - ✅ Pop-up de desconto 15% OFF aparece
   - ✅ Quiz funciona com 6 perguntas
   - ✅ Redirecionamento para /obrigado ou /confirmado
   - ✅ Dashboard acessível em /dashboardcwh
   - ✅ Meta Pixel carrega (verificar em DevTools)

### 9.3 Testar Integrações

```bash
# Testar BotConversa
curl -X POST http://localhost:3000/api/trpc/leads.testBotConversa

# Verificar logs
pm2 logs lead-scoring-saude | grep BotConversa
```

---

## 📊 Passo 10: Monitoramento e Manutenção

### 10.1 Monitorar Aplicação

```bash
# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs lead-scoring-saude

# Ver estatísticas
pm2 monit

# Reiniciar aplicação
pm2 restart lead-scoring-saude

# Parar aplicação
pm2 stop lead-scoring-saude

# Remover aplicação
pm2 delete lead-scoring-saude
```

### 10.2 Backup do Banco de Dados

```bash
# Backup manual
mysqldump -u lead_user -p lead_scoring_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
mysql -u lead_user -p lead_scoring_db < backup_20260514_150000.sql

# Backup automático (cron)
# Adicionar ao crontab: crontab -e
0 2 * * * mysqldump -u lead_user -p'senha' lead_scoring_db > /backups/lead_scoring_db_$(date +\%Y\%m\%d).sql
```

### 10.3 Monitorar Espaço em Disco

```bash
df -h
du -sh /home/seu-usuario/public_html/lead-scoring-saude
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```bash
# Reinstalar dependências
rm -rf node_modules pnpm-lock.yaml
npm install
npm run build
```

### Erro: "Database connection failed"

```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão MySQL
mysql -u lead_user -p -h localhost -e "SELECT 1"

# Verificar arquivo .env
cat .env | grep DATABASE_URL
```

### Erro: "Port 3000 already in use"

```bash
# Encontrar processo usando porta 3000
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
PORT=3001 node dist/index.js
```

### Erro: "SSL certificate error"

```bash
# Renovar certificado
sudo certbot renew --force-renewal

# Verificar certificado
sudo certbot certificates
```

### Aplicação lenta ou travando

```bash
# Verificar uso de memória
pm2 monit

# Aumentar limite de memória
pm2 start dist/index.js --name "lead-scoring-saude" --max-memory-restart 500M

# Verificar logs de erro
pm2 logs lead-scoring-saude --err
```

---

## 📈 Performance e Otimização

### Recomendações

1. **Ativar Gzip no Nginx**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   gzip_min_length 1000;
   ```

2. **Cache de Arquivos Estáticos**
   ```nginx
   expires 30d;
   add_header Cache-Control "public, immutable";
   ```

3. **Monitorar Performance**
   ```bash
   # Usar ferramentas como:
   # - New Relic
   # - DataDog
   # - Sentry (para erros)
   ```

---

## 🔄 Atualizar Aplicação

### Quando há novas mudanças:

```bash
cd /home/seu-usuario/public_html/lead-scoring-saude

# Parar aplicação
pm2 stop lead-scoring-saude

# Atualizar código
git pull origin main
# ou fazer upload via SFTP

# Instalar dependências (se houver novas)
npm install

# Executar migrações (se houver)
npm run db:push

# Build
npm run build

# Reiniciar
pm2 restart lead-scoring-saude

# Verificar logs
pm2 logs lead-scoring-saude
```

---

## 📞 Suporte e Contato

### Documentação Adicional
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Express.js Docs](https://expressjs.com/)
- [tRPC Docs](https://trpc.io/)
- [Nginx Docs](https://nginx.org/en/docs/)

### Contato
Para dúvidas específicas sobre o projeto, consulte a documentação interna ou entre em contato com o desenvolvedor.

---

## ✅ Checklist Final de Deploy

- [ ] Node.js 22+ instalado
- [ ] MySQL criado e testado
- [ ] Arquivo `.env` configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] Migrações executadas (`npm run db:push`)
- [ ] Build gerado (`npm run build`)
- [ ] PM2 instalado e configurado
- [ ] Nginx configurado com reverse proxy
- [ ] SSL/HTTPS ativo
- [ ] Domínio apontando para servidor
- [ ] Aplicação iniciada e testada
- [ ] Logs verificados
- [ ] Integrações testadas (BotConversa, Sheets, Pixel)
- [ ] Backup do banco configurado
- [ ] Monitoramento ativo

---

**Versão**: 1.0.0  
**Data**: 14 de Maio de 2026  
**Status**: ✅ Pronto para Produção
