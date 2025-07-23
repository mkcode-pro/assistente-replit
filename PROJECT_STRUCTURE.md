# 📁 Estrutura do Projeto - Império Pharma

Documentação completa da organização de arquivos e diretórios do sistema.

## 🗂️ Visão Geral da Estrutura

```
império-pharma/
├── 📚 docs/                    # Documentação centralizada
│   └── README.md              # Índice da documentação
├── 🖥️ client/                 # Frontend React + TypeScript
│   ├── src/
│   │   ├── 🧩 components/     # Componentes UI reutilizáveis
│   │   │   └── ui/           # Componentes shadcn/ui
│   │   ├── 📄 pages/         # Páginas da aplicação
│   │   │   ├── home.tsx      # Landing page principal
│   │   │   ├── calculators.tsx # Calculadoras científicas
│   │   │   ├── admin-dashboard.tsx # Painel administrativo
│   │   │   ├── admin-login.tsx # Login do admin
│   │   │   └── not-found.tsx # Página 404
│   │   ├── 🪝 hooks/         # Custom hooks React
│   │   │   ├── use-mobile.tsx # Hook para detecção mobile
│   │   │   └── use-toast.ts  # Hook para notificações
│   │   └── 📚 lib/           # Utilitários e configurações
│   │       ├── queryClient.ts # TanStack Query config
│   │       └── utils.ts      # Funções utilitárias
│   ├── index.html            # Template HTML principal
│   └── public/               # Assets estáticos
├── ⚙️ server/                 # Backend Express + TypeScript
│   ├── 🔧 services/          # Serviços de negócio
│   │   ├── gemini.ts        # Integração com Gemini AI
│   │   └── config-manager.ts # Gerenciador de configurações
│   ├── routes.ts            # Rotas principais da API
│   ├── admin-routes.ts      # Endpoints administrativos
│   ├── storage.ts           # Camada de acesso a dados
│   ├── db.ts               # Configuração PostgreSQL
│   ├── index.ts            # Entry point do servidor
│   └── vite.ts             # Integração Vite middleware
├── 🔗 shared/                # Código compartilhado
│   └── schema.ts           # Schemas Drizzle + Zod
├── 📦 Configuração
│   ├── package.json        # Dependências e scripts
│   ├── tailwind.config.ts  # Configuração Tailwind CSS
│   ├── vite.config.ts      # Build e desenvolvimento
│   ├── drizzle.config.ts   # Configuração do ORM
│   ├── tsconfig.json       # TypeScript config
│   └── postcss.config.js   # PostCSS plugins
└── 📋 Documentação
    ├── README.md           # Guia principal do projeto
    ├── replit.md          # Documentação técnica Replit
    ├── CHANGELOG.md       # Histórico de versões
    ├── DEPLOYMENT.md      # Guia de deploy
    ├── API.md            # Documentação da API
    └── PROJECT_STRUCTURE.md # Este arquivo
```

## 🎯 Detalhamento por Diretório

### 📁 `/client` - Frontend React

**Propósito**: Interface do usuário construída em React com TypeScript

#### 📄 `/client/src/pages`
- **home.tsx**: Landing page com design futurista e logo molecular
- **calculators.tsx**: Calculadoras TMB, Macros e Calorias
- **admin-dashboard.tsx**: Painel administrativo completo
- **admin-login.tsx**: Autenticação de administradores
- **not-found.tsx**: Página de erro 404

#### 🧩 `/client/src/components`
- **ui/**: Componentes shadcn/ui (Button, Input, Dialog, etc.)
- Componentes reutilizáveis do sistema de design

#### 🪝 `/client/src/hooks`
- **use-mobile.tsx**: Detecção responsiva para mobile
- **use-toast.ts**: Sistema de notificações toast

#### 📚 `/client/src/lib`
- **queryClient.ts**: Configuração TanStack React Query
- **utils.ts**: Funções utilitárias (clsx, twMerge, etc.)

### 📁 `/server` - Backend Express

**Propósito**: API REST em Express.js com TypeScript

#### 🔧 `/server/services`
- **gemini.ts**: Integração com Google Gemini AI
- **config-manager.ts**: Sistema de configurações dinâmicas

#### 📋 Arquivos principais
- **routes.ts**: Rotas principais (/api/chat, /api/users, etc.)
- **admin-routes.ts**: Endpoints admin (/api/admin/*)
- **storage.ts**: Camada de abstração do banco de dados
- **db.ts**: Configuração e conexão PostgreSQL
- **index.ts**: Servidor Express principal
- **vite.ts**: Middleware para integração Vite

### 📁 `/shared` - Código Compartilhado

**Propósito**: Tipos e schemas usados no frontend e backend

- **schema.ts**: Definições Drizzle ORM + validações Zod

### 📁 Configuração do Projeto

#### ⚙️ Configurações de Build
- **vite.config.ts**: Configuração do bundler Vite
- **tailwind.config.ts**: Sistema de design e cores
- **postcss.config.js**: Plugins CSS (Tailwind, Autoprefixer)
- **tsconfig.json**: Configuração TypeScript strict

#### 🗃️ Configurações de Banco
- **drizzle.config.ts**: ORM e migrações
- **drizzle/**: Arquivos de migração (auto-gerado)

## 🔄 Fluxo de Desenvolvimento

### 1. Frontend Development
```
client/src/pages → client/src/components → client/src/lib
```

### 2. Backend Development  
```
server/routes.ts → server/services → server/storage.ts → shared/schema.ts
```

### 3. Database Changes
```
shared/schema.ts → npm run db:push → server/storage.ts
```

## 📂 Convenções de Nomenclatura

### Arquivos
- **PascalCase**: Componentes React (HomePage.tsx)
- **kebab-case**: Páginas e utilitários (admin-dashboard.tsx)
- **camelCase**: Funções e serviços (configManager.ts)

### Diretórios
- **kebab-case**: Todos os diretórios (admin-routes, use-mobile)
- **lowercase**: Diretórios raiz (client, server, shared)

### Variáveis e Funções
- **camelCase**: JavaScript/TypeScript padrão
- **UPPER_CASE**: Constantes e environment variables
- **snake_case**: Database fields (seguindo convenção SQL)

## 🔧 Scripts e Comandos

### Development
```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build para produção
npm run start      # Servidor de produção
```

### Database
```bash
npm run db:push    # Sincronizar schema
npm run db:studio  # Interface visual do banco
```

### Utilities
```bash
npm run type-check # Verificar tipos TypeScript
npm run clean      # Limpar cache e build
```

## 📋 Boas Práticas

### 📁 Organização de Arquivos
- ✅ Agrupar por funcionalidade, não por tipo
- ✅ Manter componentes próximos ao seu uso
- ✅ Separar lógica de negócio da apresentação
- ✅ Usar index.ts para exports limpos

### 🏗️ Arquitetura
- ✅ Separação clara client/server/shared
- ✅ Camada de abstração para banco de dados
- ✅ Serviços reutilizáveis e testáveis
- ✅ Types compartilhados entre frontend/backend

### 📝 Documentação
- ✅ README em cada diretório importante
- ✅ Comentários JSDoc em funções públicas
- ✅ Schemas Zod servem como documentação
- ✅ Nomes descritivos para arquivos e variáveis

## 🚀 Deploy e Build

### Build Process
1. **TypeScript compilation**: `tsc`
2. **Vite bundle**: Frontend assets
3. **Database sync**: `npm run db:push`
4. **Server start**: `npm run start`

### Assets Pipeline
- **Vite**: Bundle e otimização do frontend
- **Tailwind**: CSS compilation e purging
- **PostCSS**: Transformações CSS
- **TypeScript**: Type checking e compilation

## 📊 Métricas da Estrutura

### 📈 Estatísticas
- **Total de arquivos**: ~50 arquivos principais
- **Lines of code**: ~5000 LOC TypeScript
- **Dependencies**: ~80 packages
- **Build time**: <30 segundos
- **Bundle size**: <500KB (gzipped)

### 🎯 Performance
- ✅ Code splitting automático
- ✅ Lazy loading de componentes
- ✅ Tree shaking habilitado
- ✅ Asset optimization via Vite

---

**📋 Última atualização**: Janeiro 2025  
**🔄 Próxima revisão**: Quando houver mudanças arquiteturais significativas