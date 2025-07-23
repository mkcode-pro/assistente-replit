# 📚 Documentação - Império Pharma

Bem-vindo à documentação completa do sistema Império Pharma.

## 📋 Índice da Documentação

### 📖 Documentação Principal
- **[README.md](../README.md)** - Visão geral do projeto e guia de início rápido
- **[replit.md](../replit.md)** - Documentação técnica detalhada e preferências do usuário
- **[CHANGELOG.md](../CHANGELOG.md)** - Histórico de versões e mudanças

### 🚀 Deploy e Operações
- **[DEPLOYMENT.md](../DEPLOYMENT.md)** - Guia completo de deploy em diferentes ambientes
- **[API.md](../API.md)** - Documentação completa da API REST

### 📁 Estrutura de Arquivos

```
império-pharma/
├── 📚 docs/                    # Documentação centralizada
├── 🖥️ client/                 # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── hooks/            # Custom hooks React
│   │   └── lib/              # Utilitários e configurações
├── ⚙️ server/                 # Backend Express + TypeScript
│   ├── services/             # Serviços (IA, ConfigManager)
│   ├── routes.ts            # Rotas principais da API
│   ├── admin-routes.ts      # Endpoints administrativos
│   ├── storage.ts           # Camada de dados
│   └── db.ts               # Configuração PostgreSQL
├── 🔗 shared/                # Tipos e schemas compartilhados
│   └── schema.ts           # Schemas Drizzle + Zod
└── 📦 Arquivos de configuração
    ├── package.json        # Dependências e scripts
    ├── tailwind.config.ts  # Configuração do Tailwind
    ├── vite.config.ts      # Build configuration
    └── drizzle.config.ts   # Database configuration
```

## 🎯 Guias Rápidos

### Para Desenvolvedores
1. **Configuração inicial**: Consulte [README.md](../README.md)
2. **Arquitetura técnica**: Veja [replit.md](../replit.md)
3. **API endpoints**: Documentação em [API.md](../API.md)
4. **Deploy**: Instruções em [DEPLOYMENT.md](../DEPLOYMENT.md)

### Para Administradores
1. **Acesso ao painel**: `/admin` (admin/senha123)
2. **Configurações do sistema**: Dashboard → Configurações
3. **Monitoramento**: Dashboard → Analytics
4. **Gestão de usuários**: Dashboard → Usuários

### Para Usuários Finais
1. **Acesso principal**: Página inicial `/`
2. **Calculadoras**: `/calculators`
3. **Chat com IA**: Após completar perfil
4. **Suporte**: Via chat na plataforma

## 🔧 Configurações Importantes

### Variáveis de Ambiente
```bash
DATABASE_URL="postgresql://..."     # PostgreSQL connection
GEMINI_API_KEY="your-api-key"      # Google Gemini AI
SESSION_SECRET="auto-generated"     # Sessions security
```

### Configurações Dinâmicas (Via Admin)
- **IA**: Prompts, temperatura, modelo
- **Segurança**: Rate limiting, timeouts
- **Aplicação**: Nome, mensagens, tema

## 🚨 Troubleshooting

### Problemas Comuns
- **Database não conecta**: Verificar `DATABASE_URL`
- **IA não responde**: Validar `GEMINI_API_KEY`
- **Build falha**: Executar `npm install && npm run build`
- **Admin não autentica**: Credenciais: admin/senha123

### Logs e Debugging
- **Application logs**: Workflow console no Replit
- **Database logs**: `npm run db:studio`
- **API errors**: Verificar responses em DevTools
- **Performance**: Monitoring via admin dashboard

## 📊 Métricas e Monitoramento

### KPIs Principais
- ✅ Response time < 2s
- ✅ Uptime > 99.9%
- ✅ Mobile usability 100%
- ✅ Lighthouse score > 90

### Analytics Disponíveis
- Total de usuários registrados
- Conversas com IA realizadas
- Calculadoras utilizadas
- API calls e custos
- Performance em tempo real

## 🔄 Processo de Atualização

### Desenvolvimento
1. Fazer alterações no código
2. Testar localmente com `npm run dev`
3. Verificar types com `npm run type-check`
4. Atualizar documentação relevante

### Deploy
1. Push para repositório principal
2. Auto-deploy via Replit (automático)
3. Verificar health check em `/api/health`
4. Monitorar logs por possíveis erros

### Configurações
1. Sempre alterar via admin panel
2. Mudanças aplicadas em tempo real
3. Backup automático das configurações
4. Rollback disponível se necessário

## 📞 Suporte e Contato

### Canais de Suporte
- 🔧 **Técnico**: Consultar esta documentação
- 💬 **Funcional**: Chat na plataforma
- 🛡️ **Admin**: Painel administrativo
- 📊 **Monitoramento**: Dashboard analytics

### Atualizações da Documentação
- **Frequência**: A cada versão major
- **Responsável**: Equipe de desenvolvimento
- **Aprovação**: Via admin panel
- **Histórico**: Mantido no CHANGELOG.md

---

## 📋 Checklist de Manutenção

### Diário
- [ ] Verificar métricas no dashboard
- [ ] Monitorar logs de erro
- [ ] Validar responses da IA
- [ ] Conferir uptime do sistema

### Semanal  
- [ ] Backup do banco de dados
- [ ] Análise de performance
- [ ] Review de conversas dos usuários
- [ ] Atualização de configurações se necessário

### Mensal
- [ ] Análise de custos de API
- [ ] Review completo de segurança
- [ ] Atualização da documentação
- [ ] Planejamento de melhorias

---

**📈 Status da Documentação**
- ✅ Completa e atualizada
- ✅ Indexada e organizada
- ✅ Mobile-friendly
- ✅ Multi-idioma (PT-BR foco)

**🎯 Última revisão**: Janeiro 2025  
**📋 Próxima revisão**: Fevereiro 2025