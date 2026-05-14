# Troubleshooting Hostinger - Lead Scoring Hapvida

## Problemas Comuns e Soluções

### 1. Erro: "Cannot find module 'express'"

**Causa**: Dependências não instaladas ou corrompidas.

**Solução**:
```bash
cd /home/seu-usuario/public_html/lead-scoring-saude
rm -rf node_modules pnpm-lock.yaml package-lock.json
npm install
npm run build
pm2 restart lead-scoring-saude
```

---

### 2. Erro: "Database connection failed"

**Causa**: DATABASE_URL incorreta ou MySQL não acessível.

**Solução**:
```bash
# Verificar variável de ambiente
echo $DATABASE_URL

# Testar conexão MySQL
mysql -u lead_user -p -h localhost -e "SELECT 1"

# Verificar arquivo .env
cat .env | grep DATABASE_URL

# Formato correto:
# mysql://usuario:senha@localhost:3306/nome_banco
```

**Verificação de Credenciais**:
```bash
# No MySQL
mysql -u root -p
SELECT user, host FROM mysql.user WHERE user='lead_user';
SHOW GRANTS FOR 'lead_user'@'localhost';
```

---

### 3. Erro: "Port 3000 already in use"

**Causa**: Outra aplicação usando a porta 3000.

**Solução**:
```bash
# Encontrar processo
lsof -i :3000

# Matar processo (se necessário)
kill -9 <PID>

# Ou usar porta diferente
PORT=3001 node dist/index.js

# Ou via PM2
pm2 start dist/index.js --name "lead-scoring" -- --port 3001
```

---

### 4. Erro: "SSL certificate error"

**Causa**: Certificado SSL expirado ou não configurado.

**Solução**:
```bash
# Verificar certificado
sudo certbot certificates

# Renovar certificado
sudo certbot renew --force-renewal

# Verificar data de expiração
openssl x509 -in /etc/letsencrypt/live/seu-dominio.com/cert.pem -noout -dates

# Auto-renovação
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

### 5. Erro: "Nginx 502 Bad Gateway"

**Causa**: Node.js não está rodando ou não responde.

**Solução**:
```bash
# Verificar se Node está rodando
pm2 status

# Ver logs
pm2 logs lead-scoring-saude

# Reiniciar
pm2 restart lead-scoring-saude

# Verificar se porta 3000 está aberta
curl http://localhost:3000

# Verificar configuração Nginx
sudo nginx -t
sudo systemctl restart nginx
```

---

### 6. Erro: "ENOENT: no such file or directory"

**Causa**: Arquivo ou diretório não encontrado durante build.

**Solução**:
```bash
# Verificar estrutura
ls -la dist/
ls -la dist/public/

# Recriar build
rm -rf dist/
npm run build

# Verificar permissões
chmod -R 755 dist/
```

---

### 7. Erro: "BotConversa webhook failed"

**Causa**: URL do webhook incorreta ou serviço indisponível.

**Solução**:
```bash
# Verificar variável
echo $BOTCONVERSA_WEBHOOK_URL

# Testar webhook manualmente
curl -X POST "https://new-backend.botconversa.com.br/api/v1/webhooks-automation/catch/171551/d6MvHVh47DPY/" \
  -H "Content-Type: application/json" \
  -d '{"teste": "true"}'

# Verificar logs
pm2 logs lead-scoring-saude | grep BotConversa

# Testar via API
curl -X POST http://localhost:3000/api/trpc/leads.testBotConversa
```

---

### 8. Erro: "Google Sheets webhook failed"

**Causa**: URL do webhook não configurada ou inválida.

**Solução**:
```bash
# Verificar variável
echo $GOOGLE_SHEETS_WEBHOOK_URL

# Se vazio, configurar
export GOOGLE_SHEETS_WEBHOOK_URL="sua-url-aqui"

# Atualizar .env
nano .env
# Adicionar: GOOGLE_SHEETS_WEBHOOK_URL=sua-url-aqui

# Reiniciar
pm2 restart lead-scoring-saude

# Verificar logs
pm2 logs lead-scoring-saude | grep "Sheets Sync"
```

---

### 9. Erro: "Application memory leak"

**Causa**: Aplicação consumindo muita memória.

**Solução**:
```bash
# Monitorar memória
pm2 monit

# Reiniciar com limite de memória
pm2 delete lead-scoring-saude
pm2 start dist/index.js --name "lead-scoring-saude" --max-memory-restart 500M

# Verificar processos
ps aux | grep node

# Aumentar limite se necessário
pm2 start dist/index.js --name "lead-scoring-saude" --max-memory-restart 1G
```

---

### 10. Erro: "Slow response time"

**Causa**: Aplicação lenta ou banco de dados sobrecarregado.

**Solução**:
```bash
# Verificar performance
pm2 monit

# Verificar logs de erro
pm2 logs lead-scoring-saude --err

# Otimizar Nginx
sudo nano /etc/nginx/nginx.conf
# Adicionar:
# gzip on;
# gzip_types text/plain text/css application/json;
# gzip_min_length 1000;

# Reiniciar Nginx
sudo systemctl restart nginx

# Verificar índices do banco
mysql -u lead_user -p lead_scoring_db
SHOW INDEXES FROM leads;
```

---

### 11. Erro: "Meta Pixel not tracking"

**Causa**: Pixel ID incorreto ou bloqueado por ad blocker.

**Solução**:
```bash
# Verificar ID no HTML
grep "fbq('init'" client/index.html

# Deve ser: fbq('init', '1404885653239987');

# Verificar em DevTools (F12)
# Console → procurar por "fbq"
# Network → procurar por "facebook.com"

# Se bloqueado, usar servidor proxy
# Configurar em Nginx para redirecionar requisições do Pixel
```

---

### 12. Erro: "Dashboard não carrega dados"

**Causa**: Banco de dados vazio ou query lenta.

**Solução**:
```bash
# Verificar dados no banco
mysql -u lead_user -p lead_scoring_db
SELECT COUNT(*) FROM leads;

# Verificar logs
pm2 logs lead-scoring-saude | grep Dashboard

# Testar API
curl http://localhost:3000/api/trpc/leads.getAll
curl http://localhost:3000/api/trpc/leads.getStats

# Verificar performance
EXPLAIN SELECT * FROM leads;
```

---

### 13. Erro: "Inactivity timeout not working"

**Causa**: Timer não resetando ou não disparando.

**Solução**:
```bash
# Verificar logs do cliente
# F12 → Console → procurar por "[Inactividade]"

# Verificar se o lead foi submetido
mysql -u lead_user -p lead_scoring_db
SELECT * FROM leads WHERE status='incompleto' ORDER BY createdAt DESC;

# Verificar timeout em código
# client/src/contexts/InactivityContext.tsx
# INACTIVITY_TIMEOUT = 10 * 60 * 1000 (10 minutos)
```

---

### 14. Erro: "CORS error"

**Causa**: Requisições bloqueadas por CORS.

**Solução**:
```bash
# Verificar headers no Nginx
sudo nano /etc/nginx/sites-available/lead-scoring-saude

# Adicionar:
add_header Access-Control-Allow-Origin "*";
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";

# Reiniciar
sudo systemctl restart nginx

# Ou no Express (server/_core/index.ts)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
```

---

### 15. Erro: "Build size too large"

**Causa**: Bundle JavaScript muito grande.

**Solução**:
```bash
# Analisar bundle
npm run build

# Verificar tamanho
ls -lh dist/public/assets/

# Se > 1MB, considerar:
# - Code splitting
# - Lazy loading
# - Remover dependências não usadas

# Verificar dependências
npm list --depth=0

# Remover não usadas
npm uninstall <package-name>
```

---

## Logs Importantes

### Onde encontrar logs

```bash
# PM2 logs
pm2 logs lead-scoring-saude

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# MySQL logs
sudo tail -f /var/log/mysql/error.log

# Sistema
journalctl -u nginx -f
```

### Filtrar logs específicos

```bash
# Apenas erros
pm2 logs lead-scoring-saude --err

# Apenas saída
pm2 logs lead-scoring-saude --out

# Últimas 100 linhas
pm2 logs lead-scoring-saude --lines 100

# Buscar por padrão
pm2 logs lead-scoring-saude | grep BotConversa
pm2 logs lead-scoring-saude | grep "Sheets Sync"
pm2 logs lead-scoring-saude | grep "ERROR"
```

---

## Comandos Úteis

```bash
# Status geral
pm2 status
pm2 monit

# Reiniciar aplicação
pm2 restart lead-scoring-saude

# Parar aplicação
pm2 stop lead-scoring-saude

# Iniciar aplicação
pm2 start lead-scoring-saude

# Deletar aplicação
pm2 delete lead-scoring-saude

# Salvar configuração
pm2 save

# Restaurar configuração
pm2 resurrect

# Limpar logs
pm2 flush

# Atualizar código
cd /home/seu-usuario/public_html/lead-scoring-saude
git pull origin main
npm install
npm run build
pm2 restart lead-scoring-saude

# Backup do banco
mysqldump -u lead_user -p lead_scoring_db > backup.sql

# Restaurar backup
mysql -u lead_user -p lead_scoring_db < backup.sql
```

---

## Monitoramento Proativo

### Health Check Script

```bash
#!/bin/bash
# health-check.sh

# Verificar se Node está rodando
if ! pgrep -f "node dist/index.js" > /dev/null; then
    echo "Node não está rodando!"
    pm2 restart lead-scoring-saude
fi

# Verificar se Nginx está rodando
if ! systemctl is-active --quiet nginx; then
    echo "Nginx não está rodando!"
    sudo systemctl restart nginx
fi

# Verificar se MySQL está rodando
if ! systemctl is-active --quiet mysql; then
    echo "MySQL não está rodando!"
    sudo systemctl restart mysql
fi

# Verificar espaço em disco
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo "Espaço em disco baixo: $DISK_USAGE%"
fi

echo "Health check concluído: $(date)"
```

### Adicionar ao Cron

```bash
crontab -e

# Adicionar linha:
*/5 * * * * /home/seu-usuario/health-check.sh >> /home/seu-usuario/health-check.log 2>&1
```

---

## Contato e Suporte

Para problemas não listados aqui, consulte:
- Documentação do Hostinger
- Logs da aplicação (pm2 logs)
- Documentação do Node.js
- Documentação do Nginx

---

**Última atualização**: 14 de Maio de 2026  
**Versão**: 1.0.0
