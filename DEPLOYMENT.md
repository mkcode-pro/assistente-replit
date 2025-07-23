# 🚀 Guia de Deploy - Império Pharma

Este documento contém instruções detalhadas para deploy do sistema em diferentes ambientes.

## 📋 Pré-requisitos

### Obrigatórios
- Node.js 20+ instalado
- Banco PostgreSQL disponível
- Google Gemini API key ativa
- SSL/TLS configurado (produção)

### Recomendados
- CDN para assets estáticos
- Monitoring service (DataDog, NewRelic)
- Backup automático do banco
- Load balancer (múltiplas instâncias)

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente Obrigatórias

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# AI Integration  
GEMINI_API_KEY="your-gemini-api-key"

# Security (auto-gerado se não fornecido)
SESSION_SECRET="random-secret-string-256-bits"

# Optional
PORT="5000"
NODE_ENV="production"
```

### Configuração do Banco de Dados

```sql
-- Criar database
CREATE DATABASE imperio_pharma;

-- Criar usuário dedicado  
CREATE USER pharma_app WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE imperio_pharma TO pharma_app;
```

## 🎯 Deploy no Replit (Recomendado)

### 1. Configuração Inicial

```bash
# Fork o projeto no Replit
# Configure as secrets no painel:
DATABASE_URL=postgresql://...
GEMINI_API_KEY=your-key
```

### 2. Deploy Automático

```bash
# O deploy acontece automaticamente no push
git push origin main

# Ou via interface do Replit
# Run → Deploy
```

### 3. Configuração de Domínio

```bash
# Via Replit console:
# Deployments → Custom Domain → Configure
```

## 🐳 Deploy com Docker (Alternativo)

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 5000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NODE_ENV=production
    depends_on:
      - postgres
      
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: imperio_pharma
      POSTGRES_USER: pharma_app
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## ☁️ Deploy na AWS/Google Cloud

### Estrutura recomendada

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   App Instance  │    │   PostgreSQL    │
│   (ALB/GCP LB)  │────│   (EC2/GCE)     │────│   (RDS/Cloud    │
│                 │    │                 │    │    SQL)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
    ┌─────────┐            ┌─────────┐            ┌─────────┐
    │   CDN   │            │  Redis  │            │ Backups │
    │(CloudF) │            │ (Cache) │            │(S3/GCS) │
    └─────────┘            └─────────┘            └─────────┘
```

### Scripts de Deploy

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Iniciando deploy do Império Pharma..."

# Build da aplicação
echo "📦 Building application..."
npm run build

# Database migrations
echo "🗃️  Running database migrations..."
npm run db:push

# Health check
echo "🏥 Health check..."
curl -f http://localhost:5000/api/health || exit 1

# Deploy assets to CDN
echo "📡 Uploading assets..."
aws s3 sync ./dist/assets s3://your-bucket/assets --cache-control max-age=31536000

echo "✅ Deploy completed successfully!"
```

## 🔍 Verificação Pós-Deploy

### Health Checks

```bash
# API Health
curl https://your-domain.com/api/health

# Database connectivity  
curl https://your-domain.com/api/admin/dashboard

# AI Integration
curl -X POST https://your-domain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
```

### Logs de Monitoramento

```bash
# Application logs
tail -f logs/app.log

# Database logs
tail -f logs/db.log

# Error logs
tail -f logs/error.log
```

## 🔧 Configuração Inicial do Sistema

### 1. Acesso Administrativo

```
URL: https://your-domain.com/admin
Usuário: admin  
Senha: senha123
```

### 2. Configurações Essenciais

Via Admin Panel (`/admin` → Configurações):

```bash
# IA Settings
ai_system_prompt: "Configure o comportamento da IA"
ai_temperature: "0.7"  
ai_model: "gemini-2.5-flash"

# Security
rate_limit_minutes: "1"
rate_limit_requests: "10"

# Application  
app_name: "Império Pharma"
app_subtitle: "Seu assistente de protocolos ergogênicos"
```

### 3. Validação Funcional

- [ ] Landing page carrega corretamente
- [ ] Chat com IA responde adequadamente  
- [ ] Calculadoras executam cálculos
- [ ] Admin panel acessa dashboard
- [ ] Configurações são salvas/aplicadas
- [ ] Rate limiting funciona
- [ ] Responsividade mobile OK

## 🚨 Troubleshooting

### Problemas Comuns

#### Database Connection Error
```bash
# Verificar string de conexão
echo $DATABASE_URL

# Testar conectividade
npm run db:studio
```

#### AI API Errors
```bash
# Verificar API key
echo $GEMINI_API_KEY | head -c 20

# Test API call
curl -H "Authorization: Bearer $GEMINI_API_KEY" \
     https://generativelanguage.googleapis.com/v1/models
```

#### Build Failures
```bash
# Limpar cache
rm -rf node_modules dist
npm install
npm run build
```

#### Performance Issues
```bash
# Monitor resources
htop
iostat -x 1
netstat -tulpn
```

## 📊 Métricas e Monitoramento

### KPIs Essenciais
- Response time < 2s
- Uptime > 99.9%
- Database connections < 80% pool
- Memory usage < 80%
- CPU usage < 70%

### Alertas Críticos
- API errors > 5%  
- Database connectivity lost
- Disk space < 10%
- Memory usage > 90%
- SSL certificate expiring

## 🔄 Rollback Strategy

### Rollback Automático
```bash
#!/bin/bash
# rollback.sh

echo "🔄 Iniciando rollback..."

# Reverter para versão anterior
git checkout previous-stable-tag

# Rebuild
npm install
npm run build

# Restart services
pm2 restart all

echo "✅ Rollback completed"
```

### Rollback Manual
1. Via Replit: Deployments → Previous Version → Activate
2. Via Git: `git revert HEAD && git push`
3. Via Docker: `docker pull previous-tag && docker-compose up -d`

---

## 📞 Suporte ao Deploy

**Em caso de problemas:**
- Verificar logs em tempo real
- Consultar documentação técnica
- Usar rollback se necessário
- Contatar equipe de suporte

**Status Page**: https://status.your-domain.com  
**Monitoring**: https://monitoring.your-domain.com