
```markdown
# Design Document - MVP Fase 1: Plataforma de Aprendizado Gamificado

## Overview

Este documento descreve o design técnico do backend da plataforma de aprendizado gamificado (MVP Fase 1). A solução é um **monolito modular** em Java Spring Boot com PostgreSQL, estruturado em camadas bem definidas para facilitar evolução futura. O foco é entregar as funcionalidades do MVP1 (autenticação, trilha de aprendizado, exercícios, XP e streak) com uma base sólida que não exija refatoração massiva nas Fases 2 e 3.

---

## Architecture

### Stack Tecnológico

| Camada         | Tecnologia                          |
|----------------|-------------------------------------|
| Backend        | Java 17 + Spring Boot 3.x           |
| Persistência   | Spring Data JPA + Hibernate         |
| Banco de Dados | PostgreSQL 15+                      |
| Autenticação   | Spring Security + JWT               |
| Migrations     | Flyway                              |
| Documentação   | Springdoc OpenAPI (Swagger UI)      |
| Testes         | JUnit 5 + Mockito + Testcontainers  |
| Build          | Maven                               |
| Logs           | SLF4J + Logback                     |
| Cache          | Spring Cache (Caffeine - local)     |
| Connection Pool| HikariCP                            |

### Estrutura de Pacotes

```
com.nativo.app
├── config/                    # Configurações Spring (Security, JPA, Cache, etc.)
│   ├── SecurityConfig.java
│   ├── JpaConfig.java
│   ├── CacheConfig.java
│   └── OpenApiConfig.java
│
├── domain/                    # Entidades JPA e Enums
│   ├── user/
│   │   ├── User.java
│   │   └── UserRepository.java
│   ├── course/
│   │   ├── Course.java
│   │   ├── Module.java
│   │   ├── Lesson.java
│   │   ├── Exercise.java
│   │   └── repositories/
│   ├── progress/
│   │   ├── UserProgress.java
│   │   ├── LessonCompletion.java
│   │   ├── ExerciseAttempt.java
│   │   └── repositories/
│   └── gamification/
│       ├── Achievement.java
│       ├── UserAchievement.java
│       └── repositories/
│
├── application/               # Serviços de aplicação (casos de uso)
│   ├── auth/
│   │   └── AuthService.java
│   ├── course/
│   │   └── CourseService.java
│   ├── lesson/
│   │   └── LessonService.java
│   ├── exercise/
│   │   └── ExerciseService.java
│   ├── progress/
│   │   └── ProgressService.java
│   └── user/
│       └── UserService.java
│
├── api/                       # Controllers REST e DTOs
│   ├── auth/
│   │   ├── AuthController.java
│   │   └── dto/
│   ├── course/
│   │   ├── CourseController.java
│   │   └── dto/
│   ├── lesson/
│   │   ├── LessonController.java
│   │   └── dto/
│   ├── exercise/
│   │   ├── ExerciseController.java
│   │   └── dto/
│   ├── progress/
│   │   ├── ProgressController.java
│   │   └── dto/
│   └── user/
│       ├── UserController.java
│       └── dto/
│
├── infrastructure/            # Implementações técnicas
│   ├── security/
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── UserDetailsServiceImpl.java
│   └── exception/
│       ├── GlobalExceptionHandler.java
│       └── ErrorResponse.java
│
└── AppApplication.java
```

### Fluxo de Requisição

```
HTTP Request
    │
    ▼
JwtAuthenticationFilter        # Valida JWT, injeta Authentication no contexto
    │
    ▼
Controller (api/)              # Recebe request, valida DTOs com Bean Validation
    │
    ▼
Service (application/)         # Lógica de negócio, transações (@Transactional)
    │
    ▼
Repository (domain/)           # Acesso ao banco via Spring Data JPA
    │
    ▼
PostgreSQL
```

---

## Data Model

### Diagrama de Entidades

```
┌──────────────────────┐
│         User         │
├──────────────────────┤
│ id UUID PK           │
│ email VARCHAR UNIQUE │
│ passwordHash VARCHAR │
│ name VARCHAR         │
│ profileImageUrl TEXT │
│ totalXp INT          │
│ currentLevel INT     │
│ currentStreak INT    │
│ longestStreak INT    │
│ lastActivityDate DATE│
│ createdAt TIMESTAMP  │
│ updatedAt TIMESTAMP  │
│ deletedAt TIMESTAMP  │
└──────────┬───────────┘
           │ 1:N
    ┌──────┴──────────────────────────────────────┐
    │                                              │
    ▼                                              ▼
┌──────────────────────┐              ┌──────────────────────┐
│    User_Progress     │              │  Lesson_Completion   │
├──────────────────────┤              ├──────────────────────┤
│ id UUID PK           │              │ id UUID PK           │
│ userId UUID FK       │              │ userId UUID FK       │
│ courseId UUID FK     │              │ lessonId UUID FK     │
│ currentModuleId UUID │              │ courseId UUID FK     │
│ currentLessonId UUID │              │ score INT            │
│ totalXpEarned INT    │              │ xpEarned INT         │
│ completedLessons INT │              │ completedAt TIMESTAMP│
│ lastAccessedAt TS    │              │ timeSpentSeconds INT │
│ startedAt TIMESTAMP  │              │ attemptNumber INT    │
│ completedAt TIMESTAMP│              │ createdAt TIMESTAMP  │
│ createdAt TIMESTAMP  │              └──────────────────────┘
│ updatedAt TIMESTAMP  │
└──────────┬───────────┘
           │ N:1
           ▼
┌──────────────────────┐
│        Course        │
├──────────────────────┤
│ id UUID PK           │
│ name VARCHAR         │
│ description TEXT     │
│ slug VARCHAR UNIQUE  │
│ imageUrl TEXT        │
│ difficulty ENUM      │
│ isActive BOOLEAN     │
│ displayOrder INT     │
│ estimatedHours INT   │
│ createdAt TIMESTAMP  │
│ updatedAt TIMESTAMP  │
│ deletedAt TIMESTAMP  │
└──────────┬───────────┘
           │ 1:N
           ▼
┌──────────────────────┐
│        Module        │
├──────────────────────┤
│ id UUID PK           │
│ courseId UUID FK     │
│ name VARCHAR         │
│ description TEXT     │
│ displayOrder INT     │
│ isActive BOOLEAN     │
│ createdAt TIMESTAMP  │
│ updatedAt TIMESTAMP  │
│ deletedAt TIMESTAMP  │
└──────────┬───────────┘
           │ 1:N
           ▼
┌──────────────────────┐
│        Lesson        │
├──────────────────────┤
│ id UUID PK           │
│ moduleId UUID FK     │
│ name VARCHAR         │
│ content TEXT         │
│ displayOrder INT     │
│ xpReward INT         │
│ minimumScore INT     │
│ estimatedMinutes INT │
│ isActive BOOLEAN     │
│ createdAt TIMESTAMP  │
│ updatedAt TIMESTAMP  │
│ deletedAt TIMESTAMP  │
└──────────┬───────────┘
           │ 1:N
           ▼
┌──────────────────────┐         ┌──────────────────────┐
│       Exercise       │         │  Exercise_Attempt    │
├──────────────────────┤         ├──────────────────────┤
│ id UUID PK           │◄────────│ exerciseId UUID FK   │
│ lessonId UUID FK     │  1:N    │ id UUID PK           │
│ type ENUM            │         │ userId UUID FK       │
│ question TEXT        │         │ lessonId UUID FK     │
│ options JSONB        │         │ userAnswer TEXT      │
│ correctAnswer TEXT   │         │ isCorrect BOOLEAN    │
│ explanation TEXT     │         │ attemptedAt TIMESTAMP│
│ displayOrder INT     │         │ timeSpentSeconds INT │
│ points INT           │         │ createdAt TIMESTAMP  │
│ difficultyLevel ENUM │         └──────────────────────┘
│ createdAt TIMESTAMP  │
│ updatedAt TIMESTAMP  │
│ deletedAt TIMESTAMP  │
└──────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│    Achievement       │  1:N    │  User_Achievement    │
├──────────────────────┤◄────────├──────────────────────┤
│ id UUID PK           │         │ id UUID PK           │
│ name VARCHAR         │         │ userId UUID FK       │
│ description TEXT     │         │ achievementId UUID FK│
│ iconUrl TEXT         │         │ unlockedAt TIMESTAMP │
│ category ENUM        │         │ createdAt TIMESTAMP  │
│ criteria JSONB       │         └──────────────────────┘
│ xpReward INT         │
│ isActive BOOLEAN     │
│ displayOrder INT     │
│ createdAt TIMESTAMP  │
│ updatedAt TIMESTAMP  │
└──────────────────────┘
```

### Enums

```java
// Dificuldade do curso
enum Difficulty { BEGINNER, INTERMEDIATE, ADVANCED }

// Tipos de exercício
enum ExerciseType { MULTIPLE_CHOICE, TRUE_FALSE, FILL_CODE, MATCH, ORDER_STEPS }

// Dificuldade do exercício
enum DifficultyLevel { EASY, MEDIUM, HARD }

// Categoria de conquista
enum AchievementCategory { STREAK, LESSONS, XP, COURSE, SPECIAL }
```

### Índices de Performance

```sql
-- User
CREATE UNIQUE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_total_xp ON users(total_xp);  -- Fase 3: ranking

-- Course
CREATE UNIQUE INDEX idx_course_slug ON courses(slug);
CREATE INDEX idx_course_active_order ON courses(is_active, display_order);

-- Module
CREATE INDEX idx_module_course_order ON modules(course_id, display_order);

-- Lesson
CREATE INDEX idx_lesson_module_order ON lessons(module_id, display_order);

-- Exercise
CREATE INDEX idx_exercise_lesson_order ON exercises(lesson_id, display_order);

-- User_Progress
CREATE UNIQUE INDEX idx_progress_user_course ON user_progress(user_id, course_id);
CREATE INDEX idx_progress_user ON user_progress(user_id);

-- Lesson_Completion
CREATE INDEX idx_completion_user_lesson_date ON lesson_completions(user_id, lesson_id, completed_at);
CREATE INDEX idx_completion_user_course ON lesson_completions(user_id, course_id);

-- Exercise_Attempt
CREATE INDEX idx_attempt_user_exercise_date ON exercise_attempts(user_id, exercise_id, attempted_at);
CREATE INDEX idx_attempt_user_lesson ON exercise_attempts(user_id, lesson_id);
CREATE INDEX idx_attempt_exercise_correct ON exercise_attempts(exercise_id, is_correct);  -- Fase 2

-- Achievement
CREATE INDEX idx_achievement_active_order ON achievements(is_active, display_order);

-- User_Achievement
CREATE UNIQUE INDEX idx_user_achievement ON user_achievements(user_id, achievement_id);
CREATE INDEX idx_user_achievement_date ON user_achievements(user_id, unlocked_at);
```

---

## Components

### 1. Autenticação e Segurança

**JwtTokenProvider**
- Gera access token (15 min) e refresh token (7 dias)
- Claims: `userId`, `email`, `iat`, `exp`
- Assina com `HS256` usando secret via variável de ambiente

**JwtAuthenticationFilter**
- Intercepta todas as requisições
- Extrai e valida o Bearer token do header `Authorization`
- Injeta `UsernamePasswordAuthenticationToken` no `SecurityContextHolder`

**SecurityConfig**
- Endpoints públicos: `/api/auth/**`, `/swagger-ui/**`, `/v3/api-docs/**`
- Todos os demais requerem autenticação
- CORS configurado por ambiente via `application.properties`

### 2. Domínio de Usuário

**UserService**
```
register(email, password, name) → UserResponse
login(email, password) → AuthResponse (accessToken + refreshToken)
refreshToken(refreshToken) → AuthResponse
forgotPassword(email) → void
resetPassword(token, newPassword) → void
getProfile(userId) → UserResponse
updateProfile(userId, name, profileImageUrl) → UserResponse
changePassword(userId, currentPassword, newPassword) → void
```

### 3. Domínio de Conteúdo

**CourseService**
```
listActiveCourses(userId) → List<CourseResponse>  // inclui isStarted e progressPercentage
getCourseWithModules(courseId, userId) → CourseDetailResponse  // inclui isCompleted/isLocked por lição
startCourse(courseId, userId) → UserProgressResponse
```

**LessonService**
```
getLesson(lessonId, userId) → LessonResponse  // sem correctAnswer
completeLesson(lessonId, userId, attempts) → LessonCompletionResponse
```

**ExerciseService**
```
submitAnswer(exerciseId, userId, userAnswer, timeSpentSeconds) → ExerciseAttemptResponse
```

### 4. Domínio de Progresso

**ProgressService**
```
getAllProgress(userId) → List<ProgressResponse>
getCourseProgress(userId, courseId) → CourseProgressResponse
getDashboard(userId) → DashboardResponse
```

### 5. Lógica de Gamificação (dentro de LessonService)

**Streak**
```
updateStreak(user, today):
  if lastActivityDate == null OR lastActivityDate < yesterday:
    currentStreak = 1
  else if lastActivityDate == yesterday:
    currentStreak += 1
  // if lastActivityDate == today: no change
  
  if currentStreak > longestStreak:
    longestStreak = currentStreak
  
  lastActivityDate = today
```

**XP e Nível**
```
awardXp(user, userProgress, lesson, today):
  // Verifica se já ganhou XP hoje nessa lição
  alreadyAwardedToday = lessonCompletionRepo
    .existsByUserIdAndLessonIdAndCompletedAtDate(userId, lessonId, today)
  
  if NOT alreadyAwardedToday:
    user.totalXp += lesson.xpReward
    userProgress.totalXpEarned += lesson.xpReward
    user.currentLevel = floor(sqrt(totalXp / 100)) + 1
```

**Conclusão de Lição**
```
completeLesson(lessonId, userId, attempts):
  1. Valida que lição não está bloqueada (prerequisite check)
  2. Para cada attempt: cria ExerciseAttempt, verifica isCorrect
  3. Calcula score = (corretas / total) * 100
  4. Se score < minimumScore: retorna feedback sem concluir
  5. Cria LessonCompletion
  6. Atualiza UserProgress (currentLesson, currentModule, completedLessonsCount)
  7. Chama updateStreak(user, today)
  8. Chama awardXp(user, userProgress, lesson, today)
  9. Retorna LessonCompletionResponse com feedback completo
```

### 6. Tratamento de Erros

**GlobalExceptionHandler** (`@ControllerAdvice`)

| Exceção                          | Status HTTP | Mensagem                        |
|----------------------------------|-------------|---------------------------------|
| `EntityNotFoundException`        | 404         | Recurso não encontrado          |
| `DuplicateResourceException`     | 409         | Recurso já existe               |
| `LessonLockedException`          | 403         | Lição bloqueada por pré-requisito|
| `InvalidCredentialsException`    | 401         | Credenciais inválidas           |
| `AccessDeniedException`          | 403         | Acesso negado                   |
| `MethodArgumentNotValidException`| 400         | Erros de validação              |
| `Exception`                      | 500         | Erro interno (sem detalhes)     |

**Formato padrão de erro:**
```json
{
  "timestamp": "2025-05-19T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/auth/register",
  "details": ["email: must be a valid email address"]
}
```

---

## API Design

### Autenticação

Todos os endpoints protegidos exigem:
```
Authorization: Bearer <accessToken>
```

O `userId` é extraído do JWT — nunca aceito como parâmetro do cliente para evitar IDOR.

### Paginação

Endpoints de listagem suportam:
```
GET /api/courses?page=0&size=20
```

Resposta paginada:
```json
{
  "content": [...],
  "page": 0,
  "size": 20,
  "totalElements": 2,
  "totalPages": 1
}
```

### Versionamento

MVP1 usa `/api/` sem versão explícita. Quando necessário, migrar para `/api/v1/` via header `Accept: application/vnd.nativo.v1+json` ou path prefix.

---

## Database Migrations (Flyway)

```
src/main/resources/db/migration/
├── V1__initial_schema.sql       # Criação de todas as tabelas
├── V2__create_indexes.sql       # Criação de todos os índices
└── V3__seed_courses.sql         # Dados iniciais dos cursos Expo e AWS
```

**V1__initial_schema.sql** cria as tabelas na ordem:
1. `users`
2. `courses`
3. `modules`
4. `lessons`
5. `exercises`
6. `user_progress`
7. `lesson_completions`
8. `exercise_attempts`
9. `achievements`
10. `user_achievements`

---

## Configuration

### application.properties (base)
```properties
spring.application.name=nativo-app
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# HikariCP
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.connection-timeout=30000

# JWT (sobrescrito por variável de ambiente)
app.jwt.secret=${JWT_SECRET}
app.jwt.access-token-expiration=900000
app.jwt.refresh-token-expiration=604800000

# Cache
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=300s
```

### application-dev.properties
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nativo_dev
spring.jpa.show-sql=true
logging.level.com.nativo=DEBUG
```

### application-prod.properties
```properties
spring.datasource.url=${DATABASE_URL}
spring.jpa.show-sql=false
logging.level.com.nativo=INFO
```

---

## Testing Strategy

| Tipo              | Ferramenta              | Cobertura Alvo |
|-------------------|-------------------------|----------------|
| Unit Tests        | JUnit 5 + Mockito       | Services       |
| Integration Tests | @SpringBootTest + MockMvc| Controllers    |
| Repository Tests  | @DataJpaTest + H2       | Repositories   |
| Coverage          | JaCoCo                  | ≥ 80%          |

**Cenários críticos a testar:**
- Registro com email duplicado → 409
- Login com senha errada → 401
- Acesso a recurso de outro usuário → 403
- Completar lição com score abaixo do mínimo → não conclui
- Streak: primeiro dia, dia consecutivo, dia perdido
- XP: não duplicar na mesma lição no mesmo dia
- Lição bloqueada por pré-requisito → 403

---

## Evolutionary Path

### Fase 2 (sem breaking changes)
- Ativar endpoints de `Achievement` e `User_Achievement` (tabelas já existem)
- Adicionar `ReviewService` usando dados de `Exercise_Attempt` (já coletados)
- Adicionar `NotificationService` com nova tabela `notifications`
- Usar `difficultyLevel` de `Exercise` para lógica adaptativa

### Fase 3 (expansão)
- Adicionar endpoint `GET /api/ranking` usando índice em `users.total_xp`
- Novos cursos: apenas inserir dados via migration, sem alteração de schema
- Separar serviços em módulos independentes se necessário (bounded contexts já definidos)
- Adicionar Redis para cache distribuído substituindo Caffeine local
```