# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-23

### 🎉 Major Release - Sistema Completo

#### Added
- **Sistema de IA Conversacional Completo**
  - Integração com Google Gemini 2.5-flash
  - Context awareness entre conversas
  - Rate limiting configurável via admin
  - Prompts personalizáveis dinamicamente

- **Painel Administrativo Profissional**
  - Dashboard com métricas em tempo real
  - Gestão completa de usuários
  - Monitoramento de todas as conversas
  - Sistema de configurações dinâmicas
  - Analytics de uso e custos de API

- **Calculadoras Científicas Avançadas**
  - TMB (Taxa Metabólica Basal) com fatores de atividade
  - Distribuição de macronutrientes por objetivos
  - Planejamento calórico com metas temporais
  - Validação completa e interface mobile-first

- **Sistema de Configuração Dinâmica**
  - Configurações organizadas por categoria (IA, Segurança, Geral)
  - Todas as configurações editáveis via admin panel
  - Rate limiting configurável sem restart
  - Prompts da IA editáveis em tempo real

- **Database PostgreSQL Completo**
  - Esquemas para usuários, conversas, admins
  - Sistema de configurações dinâmicas
  - Session store no PostgreSQL
  - Migrações automáticas com Drizzle

#### Enhanced
- **Design System Futurista**
  - Tema escuro com gradientes animados
  - Efeitos glassmorphism profissionais
  - Animações CSS customizadas
  - Logo molecular com física simulada
  - 100% mobile-first responsivo

- **Arquitetura Robusta**
  - TypeScript strict mode em todo o projeto
  - Validação Zod em todas as entradas
  - Error boundaries comprehensivos
  - Logging integrado e debugging

#### Security
- Autenticação de admin com Passport.js
- Rate limiting dinâmico configurável
- Validação de entrada em todas as rotas
- Sessions seguras no PostgreSQL
- CORS configurado apropriadamente

## [1.0.0] - 2025-01-22

### 🚀 Initial Release

#### Added
- **Landing Page Futurista**
  - Hero section com gradiente animado
  - Logo molecular flutuante
  - Efeito typewriter no subtítulo
  - Glassmorphism design elements

- **Sistema de Perfil de Usuário**
  - Formulário multi-etapas com validação
  - Campos: gênero, objetivos, preferências, idade, experiência
  - Identificação por session ID
  - Mensagens de erro em português brasileiro

- **Chat Básico com IA**
  - Integração inicial com Gemini AI
  - Interface de chat com bolhas futuristas
  - Indicadores de digitação
  - Auto-scroll funcional

- **Fundação Técnica**
  - React 18 + TypeScript
  - Vite para desenvolvimento
  - Tailwind CSS + sistema customizado
  - Express.js backend
  - Wouter para roteamento

#### Technical
- Estrutura de projeto moderna
- ESM modules configuration
- Development workflow otimizado
- Mobile-first responsive design

---

## Tipos de Mudanças
- `Added` para novas funcionalidades
- `Changed` para mudanças em funcionalidades existentes
- `Deprecated` para funcionalidades que serão removidas
- `Removed` para funcionalidades removidas
- `Fixed` para correções de bugs
- `Security` para melhorias de segurança
- `Enhanced` para melhorias gerais
- `Technical` para mudanças técnicas internas

## Versionamento
- **Major** (2.0.0): Mudanças que quebram compatibilidade
- **Minor** (2.1.0): Novas funcionalidades compatíveis
- **Patch** (2.1.1): Correções de bugs compatíveis