# Império Pharma - AI-Powered Ergogenic Protocol Assistant

## Visão Geral do Projeto

Sistema web avançado de consultoria em protocolos ergogênicos, desenvolvido exclusivamente para o mercado brasileiro. Combina inteligência artificial com design futurista para fornecer recomendações científicas personalizadas em saúde e performance.

### Status Atual
✅ **Produção** - Sistema completamente funcional e otimizado para mobile

## Preferências do Usuário

- **Linguagem**: Português brasileiro (PT-BR) exclusivamente
- **Comunicação**: Linguagem simples e cotidiana
- **Design**: Mobile-first com responsividade total
- **Tema**: Futurista com efeitos glassmorphism

## Arquitetura Técnica

### Stack Frontend
- **Framework**: React 18 + TypeScript
- **Build**: Vite com HMR
- **Styling**: Tailwind CSS + Sistema customizado
- **UI**: Radix UI + shadcn/ui
- **Estado**: TanStack React Query v5
- **Roteamento**: Wouter
- **Validação**: Zod + React Hook Form

### Stack Backend
- **Runtime**: Node.js 20 + Express.js
- **Linguagem**: TypeScript (ESM)
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: Google Gemini 2.5-flash
- **Autenticação**: Passport.js + Sessions
- **Rate Limiting**: Express-rate-limit configurável

### Infraestrutura
- **Database**: Neon PostgreSQL Serverless
- **Deploy**: Replit Autoscale
- **Sessions**: PostgreSQL session store
- **Logs**: Middleware integrado

## Funcionalidades Implementadas

### 1. Sistema de IA Conversacional
- Chat em tempo real com Gemini AI
- Contexto mantido entre conversas  
- Prompts do sistema totalmente configuráveis
- Rate limiting dinâmico via admin
- Respostas focadas em protocolos ergogênicos

### 2. Calculadoras Científicas
- **TMB**: Taxa Metabólica Basal com fatores de atividade
- **Macros**: Distribuição personalizada de macronutrientes
- **Calorias**: Planejamento calórico orientado a objetivos
- Interface mobile-first com validação completa

### 3. Painel Administrativo Completo
- **Dashboard**: Métricas em tempo real
- **Usuários**: Gestão completa de perfis
- **Conversas**: Monitoramento de todas as interações
- **Configurações**: Sistema dinâmico de configuração
- **Analytics**: Rastreamento de uso e custos de API

### 4. Sistema de Configuração Dinâmica
- **IA**: Prompts, temperatura, modelo configuráveis
- **Segurança**: Rate limiting e proteções
- **Aplicação**: Nome, subtítulo, mensagens
- **Interface**: Organizada por categorias no admin

### 5. Design System Futurista
- Tema escuro com gradientes animados (#0a1628 + #00ff88)
- Efeitos glassmorphism e glow
- Animações CSS customizadas
- Logo molecular flutuante
- Responsividade mobile perfeita

## Estrutura do Projeto

```
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── hooks/            # Custom hooks
│   │   └── lib/              # Utilitários e configurações
├── server/                   # Backend Express
│   ├── services/            # Serviços (AI, Config)
│   ├── routes.ts           # Rotas principais
│   ├── admin-routes.ts     # Rotas do admin
│   ├── storage.ts          # Camada de dados
│   └── db.ts              # Configuração do banco
├── shared/                  # Tipos compartilhados
│   └── schema.ts           # Schemas Drizzle + Zod
└── docs/                   # Documentação
```

## Fluxo de Dados

1. **Landing Page** → **Perfil do Usuário** → **Chat com IA**
2. **Admin Login** → **Dashboard** → **Configurações**  
3. **Calculadoras** → **Resultados** → **Histórico**

## Configurações do Sistema

### Variáveis de Ambiente
- `DATABASE_URL`: URL do PostgreSQL
- `GEMINI_API_KEY`: Chave da API do Google Gemini
- `SESSION_SECRET`: Segredo para sessões (auto-gerado)

### Configurações Dinâmicas (Via Admin)
- **IA**: `ai_system_prompt`, `ai_temperature`, `ai_model`
- **Segurança**: `rate_limit_minutes`, `rate_limit_requests`
- **App**: `app_name`, `app_subtitle`, `welcome_message`

## Credenciais de Acesso

### Admin Panel
- **URL**: `/admin`
- **Usuário**: `admin`
- **Senha**: `senha123`

## Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento com HMR
npm run build      # Build para produção  
npm run start      # Servidor de produção
npm run db:push    # Sincronizar schema do banco
```

## Recursos de Desenvolvimento

### Debugging
- Console logs integrados no Express
- React DevTools compatível
- TypeScript strict mode
- LSP diagnostics completos

### Performance
- Lazy loading de componentes
- Query optimization via TanStack
- Caching inteligente
- Bundle splitting automático

## Roadmap Técnico

### Próximas Implementações
- [ ] Autenticação OAuth (Google/Facebook)  
- [ ] PWA com service workers
- [ ] Notificações push
- [ ] Export de dados para PDF
- [ ] Multi-idiomas (manter PT-BR como padrão)

### Melhorias Planejadas
- [ ] Testes automatizados (Jest + Cypress)
- [ ] CI/CD pipeline
- [ ] Monitoramento de performance
- [ ] Backup automático do banco

## Notas de Manutenção

- **Database**: Sempre usar `npm run db:push` para mudanças no schema
- **Config**: Alterações de sistema devem ser feitas via admin panel
- **Deploy**: Replit auto-deploy no push para main
- **Logs**: Verificar workflow console para debugging

---

**Última atualização**: Janeiro 2025  
**Versão**: 2.0.0  
**Status**: Produção estável