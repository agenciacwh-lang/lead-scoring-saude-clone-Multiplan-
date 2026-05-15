# 🚀 Guia Completo de Deploy - Lead Scoring Hapvida para Hostinger

## ✅ REVISÃO FINAL DO PROJETO

Todos os componentes foram verificados e validados:

| Componente | Status | Detalhes |
|-----------|--------|----------|
| **Processo de Inatividade** | ✅ Funcional | 10 minutos de inatividade → Lead incompleto enviado |
| **Regras de Lead Scoring** | ✅ Funcional | Frio (0-3), Morno (4-7), Quente (8-10) |
| **Meta Pixel** | ✅ Integrado | ID: 1404885653239987 |
| **Google Sheets** | ✅ Integrado | Webhook: Google Apps Script ativo |
| **BotConversa** | ✅ Integrado | Webhook: Automação de leads |
| **Pop-up Desconto** | ✅ Funcional | 15% OFF - Aparece na Home |
| **Rotas** | ✅ Corretas | / (Home), /obrigado, /confirmado |
| **Testes** | ✅ 26/26 Passando | Sem erros |

---

## 📋 PRÉ-REQUISITOS PARA HOSTINGER

Antes de começar o deploy, você precisa ter:

1. ✅ **Conta Hostinger ativa**
2. ✅ **Domínio registrado** (ou compre um na Hostinger)
3. ✅ **Acesso SSH ao servidor** (dados de login do Hostinger)
4. ✅ **Node.js 18+ instalado** (Hostinger fornece)
5. ✅ **MySQL/MariaDB disponível** (Hostinger fornece)
6. ✅ **Variáveis de ambiente** (DATABASE_URL, JWT_SECRET, etc.)

---

## 🔧 PASSO A PASSO DE DEPLOY

### FASE 1: Preparar o Projeto Localmente

#### 1.1 Build de Produção
```bash
cd /home/ubuntu/lead-scoring-saude
pnpm build
```

Isso vai gerar:
- `dist/public/` - Arquivos estáticos (HTML, CSS, JS)
- `dist/index.js` - Servidor Express compilado

#### 1.2 Verificar Build
```bash
ls -lah dist/
```

Você deve ver:
- `dist/public/` (pasta com arquivos estáticos)
- `dist/index.js` (arquivo do servidor)

---

### FASE 2: Preparar Hostinger

#### 2.1 Acessar Hostinger via SSH

```bash
ssh seu_usuario@seu_servidor.hostinger.com
```

Você receberá as credenciais SSH do Hostinger por email.

#### 2.2 Criar Diretório do Projeto

```bash
mkdir -p ~/public_html/lead-scoring
cd ~/public_html/lead-scoring
```

#### 2.3 Verificar Node.js

```bash
node --version
npm --version
```

Deve retornar versões (ex: v18.0.0, 9.0.0).

---

### FASE 3: Fazer Upload dos Arquivos

#### 3.1 Opção A: Usando SCP (Recomendado)

No seu computador local:

```bash
scp -r /home/ubuntu/lead-scoring-saude/dist/* seu_usuario@seu_servidor.hostinger.com:~/public_html/lead-scoring/
scp /home/ubuntu/lead-scoring-saude/package.json seu_usuario@seu_servidor.hostinger.com:~/public_html/lead-scoring/
scp /home/ubuntu/lead-scoring-saude/pnpm-lock.yaml seu_usuario@seu_servidor.hostinger.com:~/public_html/lead-scoring/
```

#### 3.2 Opção B: Usando SFTP (Alternativa)

Use um cliente SFTP como FileZilla:
1. Host: `seu_servidor.hostinger.com`
2. Usuário: `seu_usuario`
3. Senha: `sua_senha`
4. Porta: `22`

Faça upload de:
- `dist/` → `/public_html/lead-scoring/`
- `package.json` → `/public_html/lead-scoring/`
- `pnpm-lock.yaml` → `/public_html/lead-scoring/`

---

### FASE 4: Configurar Banco de Dados

#### 4.1 Criar Banco de Dados no Hostinger

1. Acesse o painel Hostinger
2. Vá para **Banco de Dados**
3. Clique em **Criar Novo Banco de Dados**
4. Nome: `lead_scoring_db`
5. Usuário: `lead_user`
6. Senha: `senha_forte_aqui`
7. Clique em **Criar**

#### 4.2 Anotar Credenciais

```
Host: localhost (ou seu_servidor.hostinger.com)
Banco: lead_scoring_db
Usuário: lead_user
Senha: senha_forte_aqui
Porta: 3306
```

#### 4.3 Construir CONNECTION STRING

```
DATABASE_URL=mysql://lead_user:senha_forte_aqui@localhost:3306/lead_scoring_db
```

---

### FASE 5: Configurar Variáveis de Ambiente

#### 5.1 Conectar via SSH

```bash
ssh seu_usuario@seu_servidor.hostinger.com
cd ~/public_html/lead-scoring
```

#### 5.2 Criar Arquivo .env

```bash
nano .env
```

Cole as seguintes variáveis (substitua pelos seus valores):

```env
# Banco de Dados
DATABASE_URL=mysql://lead_user:senha_forte_aqui@localhost:3306/lead_scoring_db

# Autenticação
JWT_SECRET=sua_chave_secreta_muito_longa_aqui_minimo_32_caracteres

# OAuth Manus
VITE_APP_ID=seu_app_id_manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Integrações
BOTCONVERSA_WEBHOOK_URL=https://seu_webhook_botconversa.com
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbwQfJQQriDPiG-B3KYS-b1iIaXwNFRWkQeWHYau6hkNVkAAH6YCsBS4lX2ZMnW5mp5Ijw/exec

# Analytics
VITE_ANALYTICS_ENDPOINT=https://seu_analytics.com
VITE_ANALYTICS_WEBSITE_ID=seu_website_id

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im/v1
BUILT_IN_FORGE_API_KEY=sua_chave_api_manus
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/v1
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend_manus

# Informações do Proprietário
OWNER_NAME=seu_nome
OWNER_OPEN_ID=seu_open_id_manus

# App Info
VITE_APP_TITLE=Lead Scoring Hapvida
VITE_APP_LOGO=https://seu_logo_url.png
```

Pressione `Ctrl+X`, depois `Y`, depois `Enter` para salvar.

---

### FASE 6: Instalar Dependências

#### 6.1 Instalar pnpm (se não tiver)

```bash
npm install -g pnpm
```

#### 6.2 Instalar Dependências do Projeto

```bash
cd ~/public_html/lead-scoring
pnpm install
```

Isso vai instalar todas as dependências listadas em `package.json`.

---

### FASE 7: Executar Migrações do Banco

#### 7.1 Executar Migrações

```bash
pnpm db:push
```

Isso vai criar todas as tabelas no banco de dados.

---

### FASE 8: Configurar Nginx (Reverse Proxy)

#### 8.1 Editar Configuração Nginx

```bash
sudo nano /etc/nginx/sites-available/lead-scoring
```

Cole a seguinte configuração:

```nginx
server {
    listen 80;
    server_name seu_dominio.com www.seu_dominio.com;

    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu_dominio.com www.seu_dominio.com;

    # Certificado SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/seu_dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu_dominio.com/privkey.pem;

    # Configurações SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logs
    access_log /var/log/nginx/lead-scoring-access.log;
    error_log /var/log/nginx/lead-scoring-error.log;

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
    }

    # Servir arquivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 8.2 Ativar Configuração

```bash
sudo ln -s /etc/nginx/sites-available/lead-scoring /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### FASE 9: Configurar SSL (Let's Encrypt)

#### 9.1 Instalar Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

#### 9.2 Gerar Certificado

```bash
sudo certbot certonly --nginx -d seu_dominio.com -d www.seu_dominio.com
```

Siga as instruções na tela.

---

### FASE 10: Iniciar Aplicação com PM2

#### 10.1 Instalar PM2

```bash
npm install -g pm2
```

#### 10.2 Criar Arquivo de Configuração PM2

```bash
cd ~/public_html/lead-scoring
nano ecosystem.config.js
```

Cole:

```javascript
module.exports = {
  apps: [
    {
      name: 'lead-scoring',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
```

#### 10.3 Iniciar com PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

### FASE 11: Verificar Status

#### 11.1 Verificar PM2

```bash
pm2 status
pm2 logs lead-scoring
```

#### 11.2 Verificar Nginx

```bash
sudo systemctl status nginx
```

#### 11.3 Testar Conexão

```bash
curl http://localhost:3000
```

Deve retornar HTML da aplicação.

---

### FASE 12: Configurar DNS

#### 12.1 Apontar Domínio para Hostinger

1. Vá para seu registrador de domínio
2. Edite os registros DNS
3. Aponte para os nameservers do Hostinger:
   - `ns1.hostinger.com`
   - `ns2.hostinger.com`
   - `ns3.hostinger.com`
   - `ns4.hostinger.com`

Ou configure registros A:
- `seu_dominio.com` → IP do servidor Hostinger
- `www.seu_dominio.com` → IP do servidor Hostinger

---

## 🔍 VERIFICAÇÃO FINAL

### Checklist de Validação

- [ ] Domínio aponta para Hostinger
- [ ] SSL está ativo (HTTPS funciona)
- [ ] Banco de dados está criado e migrado
- [ ] Variáveis de ambiente estão configuradas
- [ ] PM2 está rodando a aplicação
- [ ] Nginx está funcionando
- [ ] Formulário carrega corretamente
- [ ] Pop-up de desconto aparece
- [ ] Quiz funciona
- [ ] Leads aparecem no Google Sheets
- [ ] Leads chegam no BotConversa
- [ ] Meta Pixel está rastreando

### Testes de Funcionalidade

1. **Teste o Formulário**
   - Acesse `https://seu_dominio.com`
   - Preencha o formulário
   - Responda o quiz
   - Verifique se o lead aparece no Google Sheets

2. **Teste o Pop-up**
   - Recarregue a página
   - O pop-up deve aparecer
   - Clique em "OK, QUERO MEU DESCONTO"

3. **Teste a Inatividade**
   - Preencha o formulário
   - Aguarde 10 minutos sem atividade
   - Um lead incompleto deve ser criado

---

## 🆘 TROUBLESHOOTING

### Problema: Aplicação não inicia

**Solução:**
```bash
pm2 logs lead-scoring
# Verifique os erros nos logs
```

### Problema: Banco de dados não conecta

**Solução:**
```bash
mysql -h localhost -u lead_user -p lead_scoring_db
# Verifique se consegue conectar
```

### Problema: Nginx retorna 502 Bad Gateway

**Solução:**
```bash
sudo systemctl restart nginx
pm2 restart lead-scoring
```

### Problema: SSL não funciona

**Solução:**
```bash
sudo certbot renew --dry-run
# Teste renovação de certificado
```

---

## 📞 SUPORTE

Se tiver problemas:

1. Verifique os logs: `pm2 logs lead-scoring`
2. Verifique o Nginx: `sudo systemctl status nginx`
3. Verifique o banco: `mysql -u lead_user -p`
4. Reinicie tudo: `pm2 restart all && sudo systemctl restart nginx`

---

## ✅ CONCLUSÃO

Parabéns! Seu projeto Lead Scoring Hapvida está pronto para produção no Hostinger!

**Próximos passos:**
1. Monitorar logs regularmente
2. Fazer backup do banco de dados
3. Configurar alertas de erro
4. Acompanhar métricas de leads

