# 📚 API Reference - Império Pharma

Documentação completa da API REST do sistema Império Pharma.

## 🌐 Base URL

```
Development: http://localhost:5000
Production: https://your-domain.replit.app
```

## 🔐 Autenticação

### Admin Endpoints
Requer autenticação via session cookie após login no admin panel.

```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "senha123"
}
```

### User Endpoints
Identificação via session ID automático no navegador.

## 📋 Endpoints Principais

### 🤖 Chat com IA

#### Enviar Mensagem
```http
POST /api/chat
Content-Type: application/json
Rate Limit: Configurável via admin (padrão: 10/min)

{
  "message": "Como posso melhorar minha performance?"
}
```

**Response 200:**
```json
{
  "response": "Resposta da IA...",
  "conversationId": "uuid-123"
}
```

**Response 429:**
```json
{
  "error": "Muitas solicitações. Tente novamente em 1 minuto(s)."
}
```

#### Obter Initial Analysis
```http
POST /api/initial-analysis
Content-Type: application/json

{
  "userProfile": {
    "gender": "masculino",
    "goals": ["ganho_massa", "definicao"],
    "preferences": ["natural", "cientificamente_comprovado"],
    "age": 25,
    "experience": "intermediario"
  }
}
```

**Response 200:**
```json
{
  "analysis": "Análise personalizada baseada no perfil...",
  "recommendations": [
    "Recomendação 1",
    "Recomendação 2"
  ]
}
```

### 🧮 Calculadoras

#### TMB Calculator
```http
POST /api/calculators/tmb
Content-Type: application/json

{
  "gender": "masculino",
  "age": 25,
  "weight": 70,
  "height": 175,
  "activityLevel": "moderado"
}
```

**Response 200:**
```json
{
  "tmb": 1680.5,
  "dailyCalories": 2352.7,
  "activityFactor": 1.4,
  "formula": "Mifflin-St Jeor"
}
```

#### Macros Calculator
```http
POST /api/calculators/macros
Content-Type: application/json

{
  "calories": 2300,
  "goal": "ganho_massa",
  "weight": 70
}
```

**Response 200:**
```json
{
  "protein": {
    "grams": 161,
    "calories": 644,
    "percentage": 28
  },
  "carbs": {
    "grams": 287.5,
    "calories": 1150,
    "percentage": 50
  },
  "fats": {
    "grams": 56.1,
    "calories": 506,
    "percentage": 22
  }
}
```

#### Calories Calculator
```http
POST /api/calculators/calories
Content-Type: application/json

{
  "currentWeight": 80,
  "targetWeight": 75,
  "timeframe": 12,
  "tmb": 1800,
  "activityLevel": "ativo"
}
```

**Response 200:**
```json
{
  "dailyCalories": 2100,
  "weeklyDeficit": 3500,
  "expectedLoss": "0.5 kg/semana",
  "plan": {
    "maintenance": 2600,
    "deficit": 500,
    "target": 2100
  }
}
```

### 👥 User Management

#### Create User Profile
```http
POST /api/users
Content-Type: application/json

{
  "sessionId": "session-uuid",
  "gender": "masculino",
  "goals": ["ganho_massa"],
  "preferences": ["natural"],
  "age": 25,
  "experience": "intermediario"
}
```

#### Get User Profile
```http
GET /api/users/:sessionId
```

**Response 200:**
```json
{
  "id": 1,
  "sessionId": "session-uuid",
  "gender": "masculino",
  "goals": ["ganho_massa"],
  "preferences": ["natural"],
  "age": 25,
  "experience": "intermediario",
  "createdAt": "2025-01-23T10:00:00Z"
}
```

### 💬 Conversations

#### Get Conversation History
```http
GET /api/conversations/:sessionId
```

**Response 200:**
```json
[
  {
    "id": 1,
    "sessionId": "session-uuid",
    "sender": "user",
    "message": "Olá, preciso de ajuda",
    "timestamp": "2025-01-23T10:00:00Z"
  },
  {
    "id": 2,
    "sessionId": "session-uuid",
    "sender": "ai",
    "message": "Olá! Como posso ajudá-lo?",
    "timestamp": "2025-01-23T10:00:05Z"
  }
]
```

## 🛡️ Admin API

### Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Admin Session Required
```

**Response 200:**
```json
{
  "totalUsers": 150,
  "totalConversations": 1250,
  "totalMessages": 5600,
  "activeUsers": 45,
  "aiRequests": 2300,
  "calculatorUsage": 850
}
```

### User Management
```http
GET /api/admin/users
Authorization: Admin Session Required
```

**Response 200:**
```json
[
  {
    "id": 1,
    "sessionId": "session-uuid",
    "gender": "masculino",
    "goals": ["ganho_massa"],
    "age": 25,
    "totalMessages": 15,
    "lastActive": "2025-01-23T09:30:00Z",
    "createdAt": "2025-01-20T10:00:00Z"
  }
]
```

### Conversation Monitoring
```http
GET /api/admin/conversations
Authorization: Admin Session Required
```

**Response 200:**
```json
[
  {
    "id": 1,
    "sessionId": "session-uuid",
    "sender": "user",
    "message": "Como tomar creatina?",
    "timestamp": "2025-01-23T10:00:00Z"
  }
]
```

### System Configuration

#### Get All Settings
```http
GET /api/admin/settings
Authorization: Admin Session Required
```

**Response 200:**
```json
[
  {
    "id": 1,
    "key": "ai_system_prompt",
    "value": "Você é um especialista em protocolos ergogênicos...",
    "description": "Prompt base para o sistema de IA",
    "category": "ai",
    "updatedAt": "2025-01-23T10:00:00Z"
  },
  {
    "id": 2,
    "key": "ai_temperature",
    "value": "0.7",
    "description": "Criatividade das respostas da IA (0.0-1.0)",
    "category": "ai",
    "updatedAt": "2025-01-23T10:00:00Z"
  }
]
```

#### Update Setting
```http
POST /api/admin/settings
Content-Type: application/json
Authorization: Admin Session Required

{
  "key": "ai_temperature",
  "value": "0.8",
  "description": "Criatividade das respostas da IA (0.0-1.0)",
  "category": "ai"
}
```

**Response 200:**
```json
{
  "id": 2,
  "key": "ai_temperature",
  "value": "0.8",
  "description": "Criatividade das respostas da IA (0.0-1.0)",
  "category": "ai",
  "updatedAt": "2025-01-23T10:05:00Z"
}
```

### Admin Authentication

#### Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "senha123"
}
```

**Response 200:**
```json
{
  "id": 1,
  "username": "admin",
  "lastLogin": "2025-01-23T10:00:00Z"
}
```

#### Logout
```http
POST /api/admin/logout
Authorization: Admin Session Required
```

**Response 200:**
```
OK
```

#### Check Auth Status
```http
GET /api/admin/me
Authorization: Admin Session Required
```

**Response 200:**
```json
{
  "id": 1,
  "username": "admin",
  "lastLogin": "2025-01-23T10:00:00Z"
}
```

## 📊 Error Codes

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found (recurso não encontrado)
- `429` - Too Many Requests (rate limit excedido)
- `500` - Internal Server Error (erro no servidor)

### Error Response Format
```json
{
  "error": "Mensagem de erro em português",
  "code": "ERROR_CODE",
  "details": {
    "field": "Detalhes específicos do erro"
  }
}
```

## 🔧 Rate Limiting

### Default Limits
- Chat endpoints: 10 requests/minute
- Calculator endpoints: 30 requests/minute
- Admin endpoints: 100 requests/minute
- General endpoints: 60 requests/minute

### Configuration
Rate limits são configuráveis via admin panel:
- `rate_limit_minutes`: Janela de tempo em minutos
- `rate_limit_requests`: Número máximo de requests

### Headers
```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 1643723400
```

## 🧪 Testing

### Health Check
```http
GET /api/health
```

**Response 200:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-23T10:00:00Z",
  "uptime": 86400,
  "database": "connected",
  "ai": "available"
}
```

### Example curl Commands

```bash
# Chat with AI
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá!"}'

# Calculate TMB
curl -X POST http://localhost:5000/api/calculators/tmb \
  -H "Content-Type: application/json" \
  -d '{"gender":"masculino","age":25,"weight":70,"height":175,"activityLevel":"moderado"}'

# Admin login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"senha123"}' \
  -c cookies.txt

# Get admin dashboard (with session)
curl -X GET http://localhost:5000/api/admin/dashboard \
  -b cookies.txt
```

## 🔄 Webhook Integration

### Future Implementation
Para integração com sistemas externos, futuros webhooks estarão disponíveis para:
- Novos usuários cadastrados
- Conversas finalizadas  
- Cálculos realizados
- Alertas de sistema

### Webhook Format
```json
{
  "event": "user.created",
  "timestamp": "2025-01-23T10:00:00Z",
  "data": {
    "userId": 123,
    "sessionId": "session-uuid"
  }
}
```

---

## 📞 Support

**Para questões técnicas sobre a API:**
- 📧 Email: dev@imperiopharma.com.br
- 📖 Docs: Consultar este documento
- 🐛 Issues: Reportar via admin panel

**Rate Limits e Configurações:**
- Configurável via admin panel em `/admin`
- Logs disponíveis em tempo real
- Monitoramento integrado