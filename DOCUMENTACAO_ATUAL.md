# DOCUMENTAÇÃO TÉCNICA ATUALIZADA - IMPÉRIO PHARMA

## 1. Objetivo e Tecnologias

### Objetivo Principal
Sistema web de consultoria especializada em protocolos ergogênicos com inteligência artificial, desenvolvido para o mercado brasileiro. A aplicação fornece:
- Consultas personalizadas com IA para recomendações de protocolos ergogênicos
- Sistema de consulta única para evitar confusão e garantir respostas completas
- Calculadoras científicas (TMB, Macros, Calorias)
- Painel administrativo completo com gestão de base de conhecimento
- Interface totalmente em português brasileiro

### Tecnologias e Frameworks Utilizados

#### Frontend
- **React 18** com TypeScript
- **Vite** como bundler e servidor de desenvolvimento
- **Tailwind CSS** para estilização
- **Radix UI** + **shadcn/ui** para componentes de interface
- **TanStack React Query v5** para gerenciamento de estado e cache
- **Wouter** para roteamento client-side
- **React Hook Form** + **Zod** para formulários e validação

#### Backend
- **Node.js 20** com Express.js
- **TypeScript** com ESM (ECMAScript Modules)
- **PostgreSQL** (Neon Serverless) como banco de dados
- **Drizzle ORM** para gerenciamento de dados
- **Google Gemini AI** (modelo 2.5-flash) para inteligência artificial
- **Express Session** com PostgreSQL store para sessões
- **Express Rate Limit** para controle de requisições

## 2. Estrutura de Arquivos

### Árvore de Arquivos Principal
```
./
├── client/                          # Frontend React
│   ├── src/
│   │   ├── App.tsx                 # Componente principal com rotas
│   │   ├── main.tsx                # Entry point do React
│   │   ├── components/
│   │   │   ├── chat-interface.tsx  # Interface de chat com IA
│   │   │   ├── landing.tsx         # Página inicial
│   │   │   ├── molecular-logo.tsx  # Logo molecular animado
│   │   │   ├── profile-form.tsx    # Formulário de perfil do usuário
│   │   │   └── ui/                 # Componentes shadcn/ui
│   │   ├── pages/
│   │   │   ├── home.tsx            # Página principal (controla fluxo)
│   │   │   ├── calculators.tsx     # Calculadoras científicas
│   │   │   ├── admin-dashboard.tsx # Dashboard administrativo
│   │   │   ├── admin-login.tsx     # Login do admin
│   │   │   └── not-found.tsx       # Página 404
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx      # Hook para detecção mobile
│   │   │   └── use-toast.ts        # Hook para notificações
│   │   └── lib/
│   │       ├── queryClient.ts      # Configuração React Query
│   │       └── utils.ts            # Utilitários gerais
│   └── index.html                  # HTML principal
│
├── server/                          # Backend Express
│   ├── index.ts                    # Servidor Express principal
│   ├── routes.ts                   # Rotas da API principais
│   ├── admin-routes.ts             # Rotas administrativas
│   ├── storage.ts                  # Camada de acesso a dados
│   ├── db.ts                       # Configuração PostgreSQL
│   ├── vite.ts                     # Integração Vite/Express
│   └── services/
│       ├── gemini.ts               # Integração Google Gemini AI
│       └── config-manager.ts       # Gerenciador de configurações
│
├── shared/                          # Código compartilhado
│   └── schema.ts                   # Schemas Drizzle + tipos Zod
│
├── package.json                     # Dependências e scripts
├── vite.config.ts                  # Configuração Vite
├── tailwind.config.ts              # Configuração Tailwind
├── tsconfig.json                   # Configuração TypeScript
└── drizzle.config.ts               # Configuração Drizzle ORM
```

### Responsabilidades dos Arquivos Principais

#### Frontend
- **App.tsx**: Define as rotas da aplicação usando Wouter
- **pages/home.tsx**: Controla o fluxo principal (landing → perfil → chat)
- **components/profile-form.tsx**: Captura dados do usuário (idade, gênero, objetivo, etc.)
- **components/chat-interface.tsx**: Interface de consulta com a IA
- **components/landing.tsx**: Página inicial com apresentação do sistema

#### Backend
- **server/index.ts**: Inicializa Express, sessões, middleware e servidor
- **server/routes.ts**: Define endpoints da API (/api/profile, /api/consultation, etc.)
- **server/admin-routes.ts**: Endpoints administrativos (/api/admin/*)
- **server/storage.ts**: Interface de acesso ao banco (CRUD operations)
- **server/services/gemini.ts**: Lógica de integração com Google Gemini AI
- **server/services/config-manager.ts**: Gerencia configurações dinâmicas

## 3. Arquitetura e Lógica Principal

### Fluxo de Dados Completo

#### 1. Entrada do Usuário

**Arquivo**: `client/src/components/profile-form.tsx`
**Função**: `handleSubmit` (linha 53)

O usuário preenche o formulário de perfil com:
- Gênero (masculino/feminino)
- Objetivo (ganho de massa, perda de peso, etc.)
- Preferências de protocolo
- Idade
- Experiência em anos

Os dados são enviados via POST para `/api/profile`.

#### 2. Processamento do Perfil

**Arquivo**: `server/routes.ts`
**Função**: Endpoint `app.post("/api/profile")` (linha 36)

O servidor:
1. Valida os dados usando `insertUserSchema` do Zod
2. Verifica se o usuário já existe pelo `sessionId`
3. Salva o perfil no banco PostgreSQL via `storage.createUser()`

#### 3. Consulta com IA

**Arquivo**: `client/src/components/chat-interface.tsx`
**Função**: `sendMessageMutation` (linha 33)

Quando o usuário envia uma pergunta:
1. A mensagem é enviada para `/api/consultation`
2. O frontend atualiza a interface com indicador de "digitando"

#### 4. Chamada da API de IA

**Arquivo**: `server/routes.ts`
**Função**: Endpoint `app.post("/api/consultation")` (linha 77)

O servidor:
1. Busca o perfil do usuário do banco
2. Limpa conversas anteriores (consulta única)
3. Salva a pergunta do usuário
4. Chama `generateSingleConsultation()` com perfil e pergunta

**Arquivo**: `server/services/gemini.ts`
**Função**: `generateSingleConsultation` (linha 16)

Esta função:
1. Busca configurações dinâmicas (prompt, temperatura, modelo)
2. Carrega base de conhecimento (produtos, protocolos, segurança)
3. Monta contexto completo com perfil + conhecimento + pergunta
4. Envia para Google Gemini AI via `ai.models.generateContent()`
5. Retorna resposta processada

#### 5. Exibição da Resposta

**Arquivo**: `client/src/components/chat-interface.tsx`
**Função**: Renderização de mensagens (linha 133)

A resposta da IA é:
1. Salva no banco de dados
2. Marcada como consulta completa
3. Exibida na interface com formatação HTML
4. Disponibilizada para download em JSON

### Endpoints Principais da API

- `POST /api/profile` - Criar perfil de usuário
- `GET /api/profile/:sessionId` - Buscar perfil existente
- `POST /api/consultation` - Enviar consulta única para IA
- `GET /api/consultation/:sessionId/download` - Baixar protocolo
- `POST /api/analysis` - Gerar análise inicial do perfil
- `GET /api/conversations/:sessionId` - Histórico de conversas

### Endpoints Administrativos

- `POST /api/admin/login` - Autenticação admin
- `GET /api/admin/dashboard` - Dados do dashboard
- `GET /api/admin/users` - Listar usuários
- `GET /api/admin/conversations` - Listar conversas
- `GET /api/admin/settings` - Configurações do sistema
- `POST /api/admin/settings` - Atualizar configurações

## 4. Configuração e Variáveis de Ambiente

### Variáveis de Ambiente Necessárias

1. **DATABASE_URL**
   - Finalidade: URL de conexão com PostgreSQL
   - Formato: `postgresql://user:pass@host/database?sslmode=require`
   - Origem: Fornecida automaticamente pelo Replit/Neon

2. **GEMINI_API_KEY** ou **GOOGLE_AI_API_KEY**
   - Finalidade: Autenticação na API do Google Gemini
   - Formato: String de API key do Google AI Studio
   - Uso: Necessária para todas as funcionalidades de IA

3. **SESSION_SECRET** (opcional)
   - Finalidade: Segredo para criptografia de sessões
   - Formato: String aleatória segura
   - Padrão: Auto-gerada se não fornecida

4. **PORT** (opcional)
   - Finalidade: Porta do servidor Express
   - Formato: Número inteiro
   - Padrão: 5000

### Configurações Dinâmicas (Via Admin Panel)

Armazenadas no banco de dados, tabela `system_settings`:

- **ai_system_prompt**: Prompt base do sistema de IA
- **ai_temperature**: Temperatura da IA (0-1, padrão 0.7)
- **ai_model**: Modelo Gemini usado (padrão "gemini-2.5-flash")
- **rate_limit_minutes**: Janela de tempo para rate limit
- **rate_limit_requests**: Número máximo de requisições
- **app_name**: Nome da aplicação
- **app_subtitle**: Subtítulo da aplicação
- **welcome_message**: Mensagem de boas-vindas

### Scripts NPM Disponíveis

```bash
npm run dev        # Inicia servidor de desenvolvimento (Vite + Express)
npm run build      # Compila para produção
npm run start      # Executa servidor de produção
npm run db:push    # Sincroniza schema do banco de dados
```

### Credenciais de Acesso Padrão

**Painel Administrativo**
- URL: `/admin`
- Usuário: `admin`
- Senha: `senha123`

---

**Última atualização**: ${new Date().toLocaleDateString('pt-BR')}
**Versão do código**: Baseada no estado atual do repositório