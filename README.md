# 🧬 Império Pharma - AI Ergogenic Assistant

> Sistema inteligente de consultoria em protocolos ergogênicos para o mercado brasileiro

[![Deploy Status](https://img.shields.io/badge/deploy-live-success)](https://replit.com/@username/imperio-pharma)
[![Node Version](https://img.shields.io/badge/node-20.x-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Private-red)](LICENSE)

## 🎯 Sobre o Projeto

Plataforma web moderna que combina inteligência artificial avançada com design futurista para fornecer consultoria personalizada em protocolos ergogênicos. Desenvolvido especificamente para profissionais da saúde e entusiastas do fitness no Brasil.

### ✨ Principais Características

- 🤖 **IA Conversacional**: Powered by Google Gemini 2.5-flash
- 📱 **Mobile First**: Interface otimizada para dispositivos móveis
- 🧪 **Calculadoras Científicas**: TMB, Macros e Calorias
- 🛡️ **Admin Panel**: Dashboard completo com analytics
- 🎨 **Design Futurista**: Glassmorphism + animações CSS
- 🇧🇷 **100% em Português**: Linguagem e cultura brasileira

## 🚀 Demo

- **App Principal**: [https://seu-dominio.replit.app](https://seu-dominio.replit.app)
- **Calculadoras**: [/calculators](https://seu-dominio.replit.app/calculators)  
- **Admin Panel**: [/admin](https://seu-dominio.replit.app/admin) (admin/senha123)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** + TypeScript
- **Vite** para build ultra-rápido
- **Tailwind CSS** + sistema de design customizado
- **Radix UI** + shadcn/ui para componentes
- **TanStack Query** para gerenciamento de estado
- **Wouter** para roteamento minimalista

### Backend  
- **Node.js 20** + Express.js
- **PostgreSQL** + Drizzle ORM
- **Google Gemini AI** para conversas
- **Passport.js** para autenticação
- **Rate limiting** configurável

### DevOps
- **Replit** para deploy automático
- **Neon Database** PostgreSQL serverless
- **TypeScript** com ESM modules
- **Drizzle Kit** para migrações

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 20+
- PostgreSQL database
- Google Gemini API key

### 1. Clone e instale dependências

```bash
git clone https://github.com/seu-usuario/imperio-pharma.git
cd imperio-pharma
npm install
```

### 2. Configure variáveis de ambiente

```bash
# .env
DATABASE_URL="postgresql://user:password@host:5432/database"
GEMINI_API_KEY="sua-chave-do-gemini"
```

### 3. Configure o banco de dados

```bash
npm run db:push
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5000`

## 🎮 Como Usar

### Para Usuários
1. Acesse a página inicial
2. Preencha seu perfil de saúde
3. Converse com a IA sobre protocolos
4. Use as calculadoras científicas

### Para Administradores
1. Acesse `/admin`
2. Login: `admin` / `senha123`
3. Configure prompts da IA
4. Monitore usuários e conversas
5. Ajuste configurações do sistema

## 📊 Funcionalidades

### 🤖 IA Conversacional
- Chat em tempo real com context awareness
- Prompts personalizáveis via admin
- Rate limiting configurável
- Histórico completo de conversas

### 🧮 Calculadoras Científicas
- **TMB**: Taxa Metabólica Basal + fatores de atividade
- **Macros**: Distribuição de macronutrientes por objetivo
- **Calorias**: Planejamento calórico com metas temporais

### 📈 Dashboard Administrativo
- Métricas de usuários em tempo real
- Monitoramento de conversas
- Controle total de configurações
- Analytics de uso da API

### 🎨 Design System
- Tema dark com gradientes animados
- Efeitos glassmorphism
- Logo molecular com animações CSS
- 100% responsivo para mobile

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor com HMR
npm run build        # Build para produção
npm run start        # Servidor de produção

# Database
npm run db:push      # Sincronizar schema
npm run db:studio    # Interface visual do DB

# Utilitários
npm run type-check   # Verificar tipos TypeScript
npm run lint         # Linting do código
```

## 📁 Estrutura do Projeto

```
império-pharma/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Componentes UI
│   │   ├── pages/       # Páginas da app
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utils e config
├── server/              # Express backend  
│   ├── services/        # Serviços (IA, config)
│   ├── routes.ts        # API routes
│   ├── admin-routes.ts  # Admin endpoints
│   └── storage.ts       # Database layer
├── shared/              # Tipos compartilhados
└── docs/               # Documentação adicional
```

## 🔒 Segurança

- ✅ Rate limiting configurável
- ✅ Validação de entrada com Zod
- ✅ Sessions seguras no PostgreSQL
- ✅ CORS configurado
- ✅ Sanitização de dados
- ✅ Admin protegido por autenticação

## 📈 Performance

- ⚡ Vite para builds ultra-rápidos
- 🗃️ Query caching inteligente
- 📱 Lazy loading de componentes
- 🎯 Bundle splitting automático
- 💨 PostgreSQL connection pooling

## 🐛 Resolução de Problemas

### Database connection issues
```bash
# Verificar status do banco
npm run db:studio

# Recriar schema
npm run db:push
```

### Build errors
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### API rate limiting
Configure via admin panel em `/admin` → Configurações → Segurança

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

## 👥 Equipe

- **Desenvolvimento**: IA Assistant + Replit
- **Design**: Sistema futurista customizado
- **Backend**: Express.js + PostgreSQL
- **IA**: Google Gemini Integration

## 📞 Suporte

- 📧 Email: suporte@imperiopharma.com.br
- 💬 Chat: Disponível na plataforma
- 📖 Docs: `/docs` na aplicação

---

<div align="center">

**Feito com ❤️ e 🤖 para a comunidade brasileira de saúde e fitness**

[Website](https://seu-dominio.replit.app) • [Admin](https://seu-dominio.replit.app/admin) • [Calculadoras](https://seu-dominio.replit.app/calculators)

</div>