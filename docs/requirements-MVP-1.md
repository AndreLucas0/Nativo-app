# Requirements Document - MVP Fase 1: Modelo de Dados Evolutivo

## Introduction

Este documento especifica os requisitos técnicos para implementação do modelo de dados evolutivo da plataforma de aprendizado gamificado. O modelo deve suportar as funcionalidades do MVP Fase 1 (trilha básica, exercícios simples, progresso, XP, streak) enquanto prepara a arquitetura para expansão nas Fases 2 (gamificação completa, revisão inteligente) e Fase 3 (novos cursos, IA, ranking) sem necessidade de refatorações massivas.

A solução utiliza Java Spring Boot com JPA/Hibernate, banco de dados relacional PostgreSQL, e autenticação JWT.

## Glossary

- **User**: Usuário da plataforma que realiza cursos e lições
- **Course**: Curso de tecnologia (Expo ou AWS) composto por módulos
- **Module**: Agrupamento de lições dentro de um curso
- **Lesson**: Unidade de aprendizado contendo explicação e exercícios
- **Exercise**: Questão interativa dentro de uma lição
- **User_Progress**: Registro do progresso geral do usuário em um curso
- **Lesson_Completion**: Registro de conclusão de uma lição específica
- **Exercise_Attempt**: Tentativa de resposta a um exercício
- **Achievement**: Conquista desbloqueável pelo usuário
- **User_Achievement**: Relacionamento entre usuário e conquista obtida
- **Streak**: Sequência de dias consecutivos de atividade
- **XP**: Experience Points (pontos de experiência)
- **JWT**: JSON Web Token para autenticação
- **Soft_Delete**: Exclusão lógica mantendo registro no banco
- **Audit_Fields**: Campos de auditoria (createdAt, updatedAt, deletedAt)

## Requirements

### Requirement 1: Entidade User

**User Story:** Como desenvolvedor, eu quero uma entidade User completa, para que o sistema possa gerenciar autenticação, perfil e gamificação dos usuários.

#### Acceptance Criteria

1. THE User_Entity SHALL contain id (UUID), email (unique, not null), passwordHash (not null), name (not null), profileImageUrl (nullable), totalXp (default 0), currentLevel (default 1), currentStreak (default 0), longestStreak (default 0), lastActivityDate (nullable), createdAt (not null), updatedAt (not null), deletedAt (nullable)
2. THE User_Entity SHALL enforce email uniqueness at database level with unique constraint
3. THE User_Entity SHALL use UUID as primary key for distributed system compatibility
4. THE User_Entity SHALL store password as bcrypt hash with minimum 10 rounds
5. WHEN a User is created, THE System SHALL set createdAt and updatedAt to current timestamp
6. WHEN a User is updated, THE System SHALL update updatedAt to current timestamp
7. THE User_Entity SHALL support soft delete using deletedAt field
8. THE User_Entity SHALL have index on email for authentication queries
9. THE User_Entity SHALL have index on totalXp for ranking queries (Fase 3 preparation)
10. THE User_Entity SHALL validate email format using RFC 5322 standard

### Requirement 2: Entidade Course

**User Story:** Como desenvolvedor, eu quero uma entidade Course extensível, para que o sistema possa gerenciar múltiplos cursos atuais e futuros.

#### Acceptance Criteria

1. THE Course_Entity SHALL contain id (UUID), name (not null), description (not null), slug (unique, not null), imageUrl (nullable), difficulty (enum: BEGINNER, INTERMEDIATE, ADVANCED), isActive (default true), displayOrder (not null), estimatedHours (nullable), createdAt (not null), updatedAt (not null), deletedAt (nullable)
2. THE Course_Entity SHALL enforce slug uniqueness at database level
3. THE Course_Entity SHALL use displayOrder for controlling course presentation order
4. THE Course_Entity SHALL support soft delete for content evolution without breaking user progress
5. WHEN a Course is created, THE System SHALL generate slug from name if not provided
6. THE Course_Entity SHALL have index on slug for URL routing
7. THE Course_Entity SHALL have index on isActive and displayOrder for listing queries

### Requirement 3: Entidade Module

**User Story:** Como desenvolvedor, eu quero uma entidade Module com ordenação, para que o sistema possa organizar lições em agrupamentos lógicos.

#### Acceptance Criteria

1. THE Module_Entity SHALL contain id (UUID), courseId (foreign key, not null), name (not null), description (not null), displayOrder (not null), isActive (default true), createdAt (not null), updatedAt (not null), deletedAt (nullable)
2. THE Module_Entity SHALL have foreign key constraint to Course with ON DELETE RESTRICT
3. THE Module_Entity SHALL enforce unique constraint on (courseId, displayOrder) for ordering integrity
4. THE Module_Entity SHALL use displayOrder for sequential progression
5. THE Module_Entity SHALL support soft delete
6. THE Module_Entity SHALL have index on (courseId, displayOrder) for efficient ordering queries
7. THE Module_Entity SHALL have index on courseId for course-module relationship queries

### Requirement 4: Entidade Lesson

**User Story:** Como desenvolvedor, eu quero uma entidade Lesson rastreável, para que o sistema possa controlar progresso individual de cada lição.

#### Acceptance Criteria

1. THE Lesson_Entity SHALL contain id (UUID), moduleId (foreign key, not null), name (not null), content (text, not null), displayOrder (not null), xpReward (default 10), minimumScore (default 70), estimatedMinutes (nullable), isActive (default true), createdAt (not null), updatedAt (not null), deletedAt (nullable)
2. THE Lesson_Entity SHALL have foreign key constraint to Module with ON DELETE RESTRICT
3. THE Lesson_Entity SHALL enforce unique constraint on (moduleId, displayOrder)
4. THE Lesson_Entity SHALL store xpReward for gamification calculation
5. THE Lesson_Entity SHALL store minimumScore (0-100) for completion criteria
6. THE Lesson_Entity SHALL support soft delete
7. THE Lesson_Entity SHALL have index on (moduleId, displayOrder)
8. THE Lesson_Entity SHALL have index on moduleId for module-lesson relationship queries
9. THE Lesson_Entity SHALL validate minimumScore between 0 and 100

### Requirement 5: Entidade Exercise

**User Story:** Como desenvolvedor, eu quero uma entidade Exercise flexível, para que o sistema possa suportar múltiplos tipos de exercícios atuais e futuros.

#### Acceptance Criteria

1. THE Exercise_Entity SHALL contain id (UUID), lessonId (foreign key, not null), type (enum: MULTIPLE_CHOICE, TRUE_FALSE, FILL_CODE, MATCH, ORDER_STEPS), question (text, not null), options (JSON, nullable), correctAnswer (text, not null), explanation (text, nullable), displayOrder (not null), points (default 10), difficultyLevel (enum: EASY, MEDIUM, HARD, nullable), createdAt (not null), updatedAt (not null), deletedAt (nullable)
2. THE Exercise_Entity SHALL have foreign key constraint to Lesson with ON DELETE RESTRICT
3. THE Exercise_Entity SHALL store options as JSON for flexibility across exercise types
4. THE Exercise_Entity SHALL enforce unique constraint on (lessonId, displayOrder)
5. THE Exercise_Entity SHALL support soft delete
6. THE Exercise_Entity SHALL have index on (lessonId, displayOrder)
7. THE Exercise_Entity SHALL have index on lessonId for lesson-exercise relationship queries
8. WHEN type is MULTIPLE_CHOICE or MATCH, THE Exercise_Entity SHALL require options field
9. THE Exercise_Entity SHALL store difficultyLevel for adaptive learning (Fase 2 preparation)

### Requirement 6: Entidade User_Progress

**User Story:** Como desenvolvedor, eu quero uma entidade User_Progress por curso, para que o sistema possa rastrear progresso independente em múltiplos cursos.

#### Acceptance Criteria

1. THE User_Progress_Entity SHALL contain id (UUID), userId (foreign key, not null), courseId (foreign key, not null), currentModuleId (foreign key, nullable), currentLessonId (foreign key, nullable), totalXpEarned (default 0), completedLessonsCount (default 0), totalLessonsCount (computed), progressPercentage (computed), lastAccessedAt (nullable), startedAt (not null), completedAt (nullable), createdAt (not null), updatedAt (not null)
2. THE User_Progress_Entity SHALL have foreign key constraints to User, Course, Module, Lesson with ON DELETE CASCADE for userId and ON DELETE RESTRICT for courseId
3. THE User_Progress_Entity SHALL enforce unique constraint on (userId, courseId) to prevent duplicate progress records
4. THE User_Progress_Entity SHALL have index on (userId, courseId) for progress queries
5. THE User_Progress_Entity SHALL have index on userId for user dashboard queries
6. WHEN a User starts a Course, THE System SHALL create User_Progress record with startedAt timestamp
7. WHEN all lessons are completed, THE System SHALL set completedAt timestamp
8. THE User_Progress_Entity SHALL compute progressPercentage as (completedLessonsCount / totalLessonsCount * 100)

### Requirement 7: Entidade Lesson_Completion

**User Story:** Como desenvolvedor, eu quero uma entidade Lesson_Completion individual, para que o sistema possa rastrear histórico detalhado de conclusões e suportar revisão inteligente futura.

#### Acceptance Criteria

1. THE Lesson_Completion_Entity SHALL contain id (UUID), userId (foreign key, not null), lessonId (foreign key, not null), courseId (foreign key, not null), score (not null), xpEarned (not null), completedAt (not null), timeSpentSeconds (nullable), attemptNumber (default 1), createdAt (not null)
2. THE Lesson_Completion_Entity SHALL have foreign key constraints to User, Lesson, Course with ON DELETE CASCADE for userId
3. THE Lesson_Completion_Entity SHALL have composite index on (userId, lessonId, completedAt) for history queries
4. THE Lesson_Completion_Entity SHALL have index on (userId, courseId) for course progress queries
5. THE Lesson_Completion_Entity SHALL have index on userId for user activity queries
6. THE Lesson_Completion_Entity SHALL store score (0-100) for performance tracking
7. THE Lesson_Completion_Entity SHALL store timeSpentSeconds for analytics (Fase 2 preparation)
8. THE Lesson_Completion_Entity SHALL allow multiple records per (userId, lessonId) for lesson repetition
9. WHEN a Lesson is completed, THE System SHALL increment attemptNumber if previous completions exist

### Requirement 8: Entidade Exercise_Attempt

**User Story:** Como desenvolvedor, eu quero uma entidade Exercise_Attempt detalhada, para que o sistema possa identificar padrões de erro e suportar revisão inteligente futura.

#### Acceptance Criteria

1. THE Exercise_Attempt_Entity SHALL contain id (UUID), userId (foreign key, not null), exerciseId (foreign key, not null), lessonId (foreign key, not null), userAnswer (text, not null), isCorrect (not null), attemptedAt (not null), timeSpentSeconds (nullable), createdAt (not null)
2. THE Exercise_Attempt_Entity SHALL have foreign key constraints to User, Exercise, Lesson with ON DELETE CASCADE for userId
3. THE Exercise_Attempt_Entity SHALL have composite index on (userId, exerciseId, attemptedAt) for performance analysis
4. THE Exercise_Attempt_Entity SHALL have index on (userId, lessonId) for lesson attempt queries
5. THE Exercise_Attempt_Entity SHALL have index on (exerciseId, isCorrect) for exercise difficulty analysis (Fase 2 preparation)
6. THE Exercise_Attempt_Entity SHALL store userAnswer for error pattern analysis
7. THE Exercise_Attempt_Entity SHALL store timeSpentSeconds for engagement metrics
8. THE Exercise_Attempt_Entity SHALL allow multiple attempts per (userId, exerciseId)
9. THE Exercise_Attempt_Entity SHALL record attemptedAt with millisecond precision

### Requirement 9: Entidade Achievement

**User Story:** Como desenvolvedor, eu quero uma entidade Achievement preparada, para que o sistema possa adicionar conquistas na Fase 2 sem alterações estruturais.

#### Acceptance Criteria

1. THE Achievement_Entity SHALL contain id (UUID), name (not null), description (not null), iconUrl (nullable), category (enum: STREAK, LESSONS, XP, COURSE, SPECIAL), criteria (JSON, not null), xpReward (default 0), isActive (default true), displayOrder (not null), createdAt (not null), updatedAt (not null)
2. THE Achievement_Entity SHALL store criteria as JSON for flexible achievement conditions
3. THE Achievement_Entity SHALL use category for achievement grouping
4. THE Achievement_Entity SHALL have index on (isActive, displayOrder) for listing queries
5. THE Achievement_Entity SHALL support multiple achievement types through criteria JSON structure
6. WHERE Achievement is STREAK category, THE criteria JSON SHALL contain field "consecutiveDays"
7. WHERE Achievement is LESSONS category, THE criteria JSON SHALL contain field "lessonsCompleted"
8. WHERE Achievement is XP category, THE criteria JSON SHALL contain field "totalXp"

### Requirement 10: Entidade User_Achievement

**User Story:** Como desenvolvedor, eu quero uma entidade User_Achievement preparada, para que o sistema possa rastrear conquistas desbloqueadas na Fase 2.

#### Acceptance Criteria

1. THE User_Achievement_Entity SHALL contain id (UUID), userId (foreign key, not null), achievementId (foreign key, not null), unlockedAt (not null), createdAt (not null)
2. THE User_Achievement_Entity SHALL have foreign key constraints to User and Achievement with ON DELETE CASCADE for userId
3. THE User_Achievement_Entity SHALL enforce unique constraint on (userId, achievementId) to prevent duplicate unlocks
4. THE User_Achievement_Entity SHALL have index on userId for user achievement queries
5. THE User_Achievement_Entity SHALL have index on (userId, unlockedAt) for achievement timeline queries
6. WHEN an Achievement is unlocked, THE System SHALL record unlockedAt timestamp

### Requirement 11: Gestão de Streak

**User Story:** Como desenvolvedor, eu quero lógica de streak no User, para que o sistema possa calcular e manter sequências de dias consecutivos.

#### Acceptance Criteria

1. WHEN a User completes any Lesson, THE System SHALL update lastActivityDate to current date
2. IF lastActivityDate is yesterday, THEN THE System SHALL increment currentStreak by 1
3. IF lastActivityDate is today, THEN THE System SHALL not modify currentStreak
4. IF lastActivityDate is before yesterday, THEN THE System SHALL reset currentStreak to 1
5. WHEN currentStreak exceeds longestStreak, THE System SHALL update longestStreak to currentStreak
6. THE System SHALL compare dates using user's timezone for streak calculation
7. THE System SHALL consider a day as having activity if at least one lesson is completed

### Requirement 12: Cálculo de XP e Nível

**User Story:** Como desenvolvedor, eu quero cálculo automático de XP e nível, para que o sistema possa recompensar progresso do usuário.

#### Acceptance Criteria

1. WHEN a Lesson is completed, THE System SHALL add Lesson xpReward to User totalXp
2. WHEN a Lesson is completed, THE System SHALL add Lesson xpReward to User_Progress totalXpEarned
3. THE System SHALL calculate currentLevel using formula: level = floor(sqrt(totalXp / 100)) + 1
4. WHEN totalXp changes, THE System SHALL recalculate and update currentLevel
5. THE System SHALL award XP only on first completion of a Lesson per day
6. WHEN a Lesson is repeated on same day, THE System SHALL record completion but not award XP

### Requirement 13: Modelo de Dados Completo do MVP1

**User Story:** Como desenvolvedor, eu quero visualizar o modelo de dados completo do MVP1, para que eu possa entender todas as entidades e seus relacionamentos.

#### Acceptance Criteria

1. THE MVP1_Data_Model SHALL include the following core entities: User, Course, Module, Lesson, Exercise, User_Progress, Lesson_Completion, Exercise_Attempt
2. THE MVP1_Data_Model SHALL include preparation entities for future phases: Achievement, User_Achievement
3. THE User_Entity SHALL be the central entity for authentication and gamification with fields: id, email, passwordHash, name, profileImageUrl, totalXp, currentLevel, currentStreak, longestStreak, lastActivityDate, createdAt, updatedAt, deletedAt
4. THE Course_Entity SHALL represent educational content with fields: id, name, description, slug, imageUrl, difficulty, isActive, displayOrder, estimatedHours, createdAt, updatedAt, deletedAt
5. THE Module_Entity SHALL group lessons within courses with fields: id, courseId, name, description, displayOrder, isActive, createdAt, updatedAt, deletedAt
6. THE Lesson_Entity SHALL represent learning units with fields: id, moduleId, name, content, displayOrder, xpReward, minimumScore, estimatedMinutes, isActive, createdAt, updatedAt, deletedAt
7. THE Exercise_Entity SHALL represent interactive questions with fields: id, lessonId, type, question, options, correctAnswer, explanation, displayOrder, points, difficultyLevel, createdAt, updatedAt, deletedAt
8. THE User_Progress_Entity SHALL track course progress per user with fields: id, userId, courseId, currentModuleId, currentLessonId, totalXpEarned, completedLessonsCount, lastAccessedAt, startedAt, completedAt, createdAt, updatedAt
9. THE Lesson_Completion_Entity SHALL record lesson completion history with fields: id, userId, lessonId, courseId, score, xpEarned, completedAt, timeSpentSeconds, attemptNumber, createdAt
10. THE Exercise_Attempt_Entity SHALL track exercise attempts for analytics with fields: id, userId, exerciseId, lessonId, userAnswer, isCorrect, attemptedAt, timeSpentSeconds, createdAt
11. THE Achievement_Entity SHALL define available achievements with fields: id, name, description, iconUrl, category, criteria, xpReward, isActive, displayOrder, createdAt, updatedAt
12. THE User_Achievement_Entity SHALL track unlocked achievements with fields: id, userId, achievementId, unlockedAt, createdAt
13. THE Data_Model SHALL implement the following relationships: User (1) → (N) User_Progress, Course (1) → (N) Module, Module (1) → (N) Lesson, Lesson (1) → (N) Exercise, User (1) → (N) Lesson_Completion, User (1) → (N) Exercise_Attempt, User (1) → (N) User_Achievement, Achievement (1) → (N) User_Achievement
14. THE Data_Model SHALL use UUID as primary key type for all entities
15. THE Data_Model SHALL include audit fields (createdAt, updatedAt) in all entities
16. THE Data_Model SHALL include soft delete field (deletedAt) in content entities (Course, Module, Lesson, Exercise)
17. THE Data_Model SHALL enforce referential integrity with foreign key constraints
18. THE Data_Model SHALL use appropriate indexes for query performance on foreign keys and frequently queried fields
19. THE Data_Model SHALL support multi-tenancy through userId isolation in user-specific entities
20. THE Data_Model SHALL be normalized to 3NF (Third Normal Form) to minimize data redundancy

#### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MVP1 DATA MODEL                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│       User           │
├──────────────────────┤
│ id (PK, UUID)        │
│ email (UNIQUE)       │
│ passwordHash         │
│ name                 │
│ profileImageUrl      │
│ totalXp              │
│ currentLevel         │
│ currentStreak        │
│ longestStreak        │
│ lastActivityDate     │
│ createdAt            │
│ updatedAt            │
│ deletedAt            │
└──────────────────────┘
         │
         │ 1:N
         ├─────────────────────────────────────────────────────────┐
         │                                                           │
         ▼                                                           ▼
┌──────────────────────┐                                  ┌──────────────────────┐
│   User_Progress      │                                  │  Lesson_Completion   │
├──────────────────────┤                                  ├──────────────────────┤
│ id (PK, UUID)        │                                  │ id (PK, UUID)        │
│ userId (FK)          │                                  │ userId (FK)          │
│ courseId (FK)        │                                  │ lessonId (FK)        │
│ currentModuleId (FK) │                                  │ courseId (FK)        │
│ currentLessonId (FK) │                                  │ score                │
│ totalXpEarned        │                                  │ xpEarned             │
│ completedLessonsCount│                                  │ completedAt          │
│ lastAccessedAt       │                                  │ timeSpentSeconds     │
│ startedAt            │                                  │ attemptNumber        │
│ completedAt          │                                  │ createdAt            │
│ createdAt            │                                  └──────────────────────┘
│ updatedAt            │
└──────────────────────┘
         │
         │ N:1
         ▼
┌──────────────────────┐
│       Course         │
├──────────────────────┤
│ id (PK, UUID)        │
│ name                 │
│ description          │
│ slug (UNIQUE)        │
│ imageUrl             │
│ difficulty           │
│ isActive             │
│ displayOrder         │
│ estimatedHours       │
│ createdAt            │
│ updatedAt            │
│ deletedAt            │
└──────────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────────┐
│       Module         │
├──────────────────────┤
│ id (PK, UUID)        │
│ courseId (FK)        │
│ name                 │
│ description          │
│ displayOrder         │
│ isActive             │
│ createdAt            │
│ updatedAt            │
│ deletedAt            │
└──────────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────────┐
│       Lesson         │
├──────────────────────┤
│ id (PK, UUID)        │
│ moduleId (FK)        │
│ name                 │
│ content              │
│ displayOrder         │
│ xpReward             │
│ minimumScore         │
│ estimatedMinutes     │
│ isActive             │
│ createdAt            │
│ updatedAt            │
│ deletedAt            │
└──────────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────────┐
│      Exercise        │
├──────────────────────┤
│ id (PK, UUID)        │
│ lessonId (FK)        │
│ type                 │
│ question             │
│ options (JSON)       │
│ correctAnswer        │
│ explanation          │
│ displayOrder         │
│ points               │
│ difficultyLevel      │
│ createdAt            │
│ updatedAt            │
│ deletedAt            │
└──────────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────────┐
│  Exercise_Attempt    │
├──────────────────────┤
│ id (PK, UUID)        │
│ userId (FK)          │
│ exerciseId (FK)      │
│ lessonId (FK)        │
│ userAnswer           │
│ isCorrect            │
│ attemptedAt          │
│ timeSpentSeconds     │
│ createdAt            │
└──────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│    Achievement       │         │  User_Achievement    │
├──────────────────────┤         ├──────────────────────┤
│ id (PK, UUID)        │ 1:N     │ id (PK, UUID)        │
│ name                 │◄────────│ userId (FK)          │
│ description          │         │ achievementId (FK)   │
│ iconUrl              │         │ unlockedAt           │
│ category             │         │ createdAt            │
│ criteria (JSON)      │         └──────────────────────┘
│ xpReward             │                   │
│ isActive             │                   │ N:1
│ displayOrder         │                   ▼
│ createdAt            │         ┌──────────────────────┐
│ updatedAt            │         │       User           │
└──────────────────────┘         └──────────────────────┘

LEGEND:
─────  One-to-Many Relationship
PK     Primary Key
FK     Foreign Key
UNIQUE Unique Constraint
```

### Requirement 14: Endpoints REST do MVP1

**User Story:** Como desenvolvedor frontend, eu quero conhecer todos os endpoints REST disponíveis no MVP1, para que eu possa integrar o aplicativo mobile corretamente.

#### Acceptance Criteria

1. THE MVP1_REST_API SHALL provide authentication endpoints under /api/auth prefix
2. THE MVP1_REST_API SHALL provide course management endpoints under /api/courses prefix
3. THE MVP1_REST_API SHALL provide lesson endpoints under /api/lessons prefix
4. THE MVP1_REST_API SHALL provide exercise endpoints under /api/exercises prefix
5. THE MVP1_REST_API SHALL provide progress tracking endpoints under /api/progress prefix
6. THE MVP1_REST_API SHALL provide user profile endpoints under /api/users prefix
7. THE MVP1_REST_API SHALL require JWT authentication for all endpoints except authentication endpoints
8. THE MVP1_REST_API SHALL return JSON responses for all endpoints
9. THE MVP1_REST_API SHALL follow RESTful conventions for HTTP methods (GET for retrieval, POST for creation, PUT for update, DELETE for deletion)
10. THE MVP1_REST_API SHALL use appropriate HTTP status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Server Error)

#### Complete Endpoint List

**Authentication Endpoints (Public)**

```
POST   /api/auth/register
       Request:  { email, password, name }
       Response: { userId, email, name, accessToken, refreshToken }
       Status:   201 Created | 400 Bad Request | 409 Conflict

POST   /api/auth/login
       Request:  { email, password }
       Response: { userId, email, name, accessToken, refreshToken }
       Status:   200 OK | 401 Unauthorized | 400 Bad Request

POST   /api/auth/refresh
       Request:  { refreshToken }
       Response: { accessToken, refreshToken }
       Status:   200 OK | 401 Unauthorized

POST   /api/auth/forgot-password
       Request:  { email }
       Response: { message }
       Status:   200 OK | 404 Not Found

POST   /api/auth/reset-password
       Request:  { token, newPassword }
       Response: { message }
       Status:   200 OK | 400 Bad Request | 404 Not Found
```

**User Profile Endpoints (Protected)**

```
GET    /api/users/me
       Headers:  Authorization: Bearer {accessToken}
       Response: { id, email, name, profileImageUrl, totalXp, currentLevel, 
                   currentStreak, longestStreak, lastActivityDate }
       Status:   200 OK | 401 Unauthorized

PUT    /api/users/me
       Headers:  Authorization: Bearer {accessToken}
       Request:  { name?, profileImageUrl? }
       Response: { id, email, name, profileImageUrl, totalXp, currentLevel, 
                   currentStreak, longestStreak }
       Status:   200 OK | 400 Bad Request | 401 Unauthorized

PUT    /api/users/me/password
       Headers:  Authorization: Bearer {accessToken}
       Request:  { currentPassword, newPassword }
       Response: { message }
       Status:   200 OK | 400 Bad Request | 401 Unauthorized
```

**Course Endpoints (Protected)**

```
GET    /api/courses
       Headers:  Authorization: Bearer {accessToken}
       Response: [{ id, name, description, slug, imageUrl, difficulty, 
                    displayOrder, estimatedHours, isStarted, progressPercentage }]
       Status:   200 OK | 401 Unauthorized

GET    /api/courses/{courseId}
       Headers:  Authorization: Bearer {accessToken}
       Response: { id, name, description, slug, imageUrl, difficulty, 
                   estimatedHours, modules: [{ id, name, description, 
                   displayOrder, lessons: [{ id, name, displayOrder, 
                   isCompleted, isLocked }] }] }
       Status:   200 OK | 404 Not Found | 401 Unauthorized

POST   /api/courses/{courseId}/start
       Headers:  Authorization: Bearer {accessToken}
       Response: { userProgressId, courseId, startedAt }
       Status:   201 Created | 409 Conflict | 404 Not Found | 401 Unauthorized
```

**Lesson Endpoints (Protected)**

```
GET    /api/lessons/{lessonId}
       Headers:  Authorization: Bearer {accessToken}
       Response: { id, name, content, xpReward, minimumScore, estimatedMinutes,
                   exercises: [{ id, type, question, options, displayOrder, 
                   points }] }
       Status:   200 OK | 403 Forbidden | 404 Not Found | 401 Unauthorized
       Note:     correctAnswer and explanation are NOT included in response

POST   /api/lessons/{lessonId}/complete
       Headers:  Authorization: Bearer {accessToken}
       Request:  { exerciseAttempts: [{ exerciseId, userAnswer, timeSpentSeconds }] }
       Response: { lessonCompletionId, score, xpEarned, passed, currentStreak,
                   totalXp, currentLevel, feedback: [{ exerciseId, isCorrect, 
                   explanation }] }
       Status:   200 OK | 400 Bad Request | 403 Forbidden | 404 Not Found | 
                 401 Unauthorized
```

**Exercise Endpoints (Protected)**

```
POST   /api/exercises/{exerciseId}/submit
       Headers:  Authorization: Bearer {accessToken}
       Request:  { userAnswer, timeSpentSeconds? }
       Response: { exerciseAttemptId, isCorrect, explanation }
       Status:   200 OK | 400 Bad Request | 404 Not Found | 401 Unauthorized
```

**Progress Endpoints (Protected)**

```
GET    /api/progress
       Headers:  Authorization: Bearer {accessToken}
       Response: [{ courseId, courseName, courseSlug, totalXpEarned, 
                    completedLessonsCount, progressPercentage, lastAccessedAt, 
                    startedAt, completedAt }]
       Status:   200 OK | 401 Unauthorized

GET    /api/progress/{courseId}
       Headers:  Authorization: Bearer {accessToken}
       Response: { courseId, courseName, currentModuleId, currentLessonId, 
                   totalXpEarned, completedLessonsCount, progressPercentage, 
                   completedLessons: [{ lessonId, lessonName, score, xpEarned, 
                   completedAt, attemptNumber }], lastAccessedAt, startedAt, 
                   completedAt }
       Status:   200 OK | 404 Not Found | 401 Unauthorized

GET    /api/progress/dashboard
       Headers:  Authorization: Bearer {accessToken}
       Response: { user: { totalXp, currentLevel, currentStreak, longestStreak },
                   activeCourses: [{ courseId, courseName, progressPercentage, 
                   lastAccessedAt }], recentCompletions: [{ lessonId, lessonName,
                   courseName, completedAt, xpEarned }], stats: { 
                   totalLessonsCompleted, totalCoursesStarted, 
                   totalCoursesCompleted } }
       Status:   200 OK | 401 Unauthorized
```

**Admin Endpoints (Protected - Admin Role Only) - Future Phase**

```
Note: Admin endpoints for CRUD operations on Course, Module, Lesson, Exercise
      will be implemented in a future phase. MVP1 assumes content is seeded
      via database migrations.
```

#### Endpoint Summary Table

| Method | Endpoint                        | Auth Required | Purpose                          |
|--------|---------------------------------|---------------|----------------------------------|
| POST   | /api/auth/register              | No            | Create new user account          |
| POST   | /api/auth/login                 | No            | Authenticate user                |
| POST   | /api/auth/refresh               | No            | Refresh access token             |
| POST   | /api/auth/forgot-password       | No            | Request password reset           |
| POST   | /api/auth/reset-password        | No            | Reset password with token        |
| GET    | /api/users/me                   | Yes           | Get current user profile         |
| PUT    | /api/users/me                   | Yes           | Update user profile              |
| PUT    | /api/users/me/password          | Yes           | Change user password             |
| GET    | /api/courses                    | Yes           | List all active courses          |
| GET    | /api/courses/{courseId}         | Yes           | Get course details with modules  |
| POST   | /api/courses/{courseId}/start   | Yes           | Start a course                   |
| GET    | /api/lessons/{lessonId}         | Yes           | Get lesson content and exercises |
| POST   | /api/lessons/{lessonId}/complete| Yes           | Submit lesson completion         |
| POST   | /api/exercises/{exerciseId}/submit | Yes        | Submit exercise answer           |
| GET    | /api/progress                   | Yes           | Get all course progress          |
| GET    | /api/progress/{courseId}        | Yes           | Get specific course progress     |
| GET    | /api/progress/dashboard         | Yes           | Get user dashboard data          |

### Requirement 15: API de Autenticação

**User Story:** Como desenvolvedor, eu quero APIs de autenticação seguras, para que usuários possam registrar e acessar o sistema.

#### Acceptance Criteria

1. THE Authentication_API SHALL provide POST /api/auth/register endpoint
2. THE Authentication_API SHALL provide POST /api/auth/login endpoint
3. THE Authentication_API SHALL provide POST /api/auth/refresh endpoint
4. THE Authentication_API SHALL provide POST /api/auth/forgot-password endpoint
5. THE Authentication_API SHALL provide POST /api/auth/reset-password endpoint
6. WHEN registering, THE System SHALL validate email uniqueness before creating User
7. WHEN registering, THE System SHALL hash password using BCrypt with strength 10
8. WHEN logging in, THE System SHALL verify password using BCrypt compare
9. WHEN login succeeds, THE System SHALL return JWT access token (15min expiry) and refresh token (7 days expiry)
10. THE Authentication_API SHALL return 401 Unauthorized for invalid credentials
11. THE Authentication_API SHALL return 400 Bad Request for validation errors
12. THE JWT_Token SHALL contain claims: userId, email, issuedAt, expiresAt

### Requirement 16: API de Cursos

**User Story:** Como desenvolvedor, eu quero APIs de cursos, para que usuários possam listar e iniciar cursos.

#### Acceptance Criteria

1. THE Course_API SHALL provide GET /api/courses endpoint returning all active courses
2. THE Course_API SHALL provide GET /api/courses/{courseId} endpoint returning course details with modules
3. THE Course_API SHALL provide POST /api/courses/{courseId}/start endpoint to start a course
4. THE Course_API SHALL require JWT authentication for all endpoints
5. WHEN listing courses, THE System SHALL return courses ordered by displayOrder
6. WHEN starting a course, THE System SHALL create User_Progress record if not exists
7. WHEN starting a course, THE System SHALL return 409 Conflict if User_Progress already exists
8. THE Course_API SHALL return 404 Not Found for inactive or non-existent courses

### Requirement 17: API de Lições

**User Story:** Como desenvolvedor, eu quero APIs de lições, para que usuários possam acessar conteúdo e exercícios.

#### Acceptance Criteria

1. THE Lesson_API SHALL provide GET /api/lessons/{lessonId} endpoint returning lesson content and exercises
2. THE Lesson_API SHALL provide POST /api/lessons/{lessonId}/complete endpoint to submit lesson completion
3. THE Lesson_API SHALL require JWT authentication for all endpoints
4. WHEN retrieving a lesson, THE System SHALL return exercises ordered by displayOrder
5. WHEN retrieving a lesson, THE System SHALL not include correctAnswer field in Exercise response
6. WHEN completing a lesson, THE System SHALL validate that all exercises were attempted
7. WHEN completing a lesson, THE System SHALL calculate score as (correct answers / total exercises * 100)
8. WHEN completing a lesson, THE System SHALL require score >= minimumScore for successful completion
9. WHEN lesson completion succeeds, THE System SHALL create Lesson_Completion record
10. WHEN lesson completion succeeds, THE System SHALL update User_Progress
11. WHEN lesson completion succeeds, THE System SHALL update User streak and XP
12. THE Lesson_API SHALL return 403 Forbidden if lesson is locked by prerequisite

### Requirement 18: API de Exercícios

**User Story:** Como desenvolvedor, eu quero API de submissão de exercícios, para que o sistema possa validar respostas e fornecer feedback.

#### Acceptance Criteria

1. THE Exercise_API SHALL provide POST /api/exercises/{exerciseId}/submit endpoint
2. THE Exercise_API SHALL require JWT authentication
3. WHEN submitting an answer, THE System SHALL validate userAnswer against correctAnswer
4. WHEN submitting an answer, THE System SHALL create Exercise_Attempt record
5. WHEN answer is correct, THE System SHALL return isCorrect: true and explanation
6. WHEN answer is incorrect, THE System SHALL return isCorrect: false and explanation
7. THE Exercise_API SHALL return 400 Bad Request for empty or invalid answers
8. THE Exercise_API SHALL record timeSpentSeconds if provided in request

### Requirement 19: API de Progresso

**User Story:** Como desenvolvedor, eu quero API de progresso, para que usuários possam visualizar seu desempenho.

#### Acceptance Criteria

1. THE Progress_API SHALL provide GET /api/progress endpoint returning all user course progress
2. THE Progress_API SHALL provide GET /api/progress/{courseId} endpoint returning specific course progress
3. THE Progress_API SHALL provide GET /api/progress/dashboard endpoint returning user dashboard data
4. THE Progress_API SHALL require JWT authentication for all endpoints
5. WHEN retrieving dashboard, THE System SHALL return totalXp, currentLevel, currentStreak, longestStreak
6. WHEN retrieving dashboard, THE System SHALL return list of active courses with progress percentage
7. WHEN retrieving course progress, THE System SHALL return completed lessons list
8. WHEN retrieving course progress, THE System SHALL return current module and lesson

### Requirement 20: Validação de Dados

**User Story:** Como desenvolvedor, eu quero validação consistente de dados, para que o sistema mantenha integridade das informações.

#### Acceptance Criteria

1. THE System SHALL validate all required fields are not null before persistence
2. THE System SHALL validate email format using regex pattern for RFC 5322
3. THE System SHALL validate password minimum length of 8 characters
4. THE System SHALL validate password contains at least one uppercase, one lowercase, one digit
5. THE System SHALL validate score values are between 0 and 100
6. THE System SHALL validate displayOrder values are positive integers
7. THE System SHALL validate foreign key references exist before creating relationships
8. THE System SHALL return 400 Bad Request with detailed validation errors
9. THE System SHALL use Bean Validation (JSR 380) annotations on entities

### Requirement 21: Segurança e Autorização

**User Story:** Como desenvolvedor, eu quero controles de segurança, para que usuários acessem apenas seus próprios dados.

#### Acceptance Criteria

1. THE System SHALL require valid JWT token for all protected endpoints
2. THE System SHALL validate JWT signature using secret key
3. THE System SHALL reject expired JWT tokens with 401 Unauthorized
4. THE System SHALL extract userId from JWT claims for authorization
5. WHEN accessing user-specific resources, THE System SHALL verify userId matches JWT claim
6. THE System SHALL return 403 Forbidden when user attempts to access other user's data
7. THE System SHALL implement rate limiting of 100 requests per minute per user
8. THE System SHALL log all authentication failures for security monitoring
9. THE System SHALL use HTTPS only for all API communication
10. THE System SHALL sanitize all user inputs to prevent SQL injection

### Requirement 22: Tratamento de Erros

**User Story:** Como desenvolvedor, eu quero tratamento consistente de erros, para que o sistema forneça feedback claro aos clientes.

#### Acceptance Criteria

1. THE System SHALL return standardized error response format with fields: timestamp, status, error, message, path
2. THE System SHALL return 400 Bad Request for validation errors
3. THE System SHALL return 401 Unauthorized for authentication failures
4. THE System SHALL return 403 Forbidden for authorization failures
5. THE System SHALL return 404 Not Found for non-existent resources
6. THE System SHALL return 409 Conflict for duplicate resource creation
7. THE System SHALL return 500 Internal Server Error for unexpected exceptions
8. THE System SHALL log all 500 errors with full stack trace
9. THE System SHALL not expose sensitive information in error messages
10. THE System SHALL use @ControllerAdvice for global exception handling

### Requirement 23: Auditoria e Timestamps

**User Story:** Como desenvolvedor, eu quero campos de auditoria em todas as entidades, para que o sistema possa rastrear criação e modificação de dados.

#### Acceptance Criteria

1. THE System SHALL automatically set createdAt timestamp when entity is created
2. THE System SHALL automatically update updatedAt timestamp when entity is modified
3. THE System SHALL use UTC timezone for all timestamps
4. THE System SHALL use @CreatedDate and @LastModifiedDate annotations from Spring Data JPA
5. THE System SHALL enable JPA Auditing with @EnableJpaAuditing
6. THE System SHALL store timestamps with millisecond precision
7. WHERE entity supports soft delete, THE System SHALL set deletedAt instead of physical deletion

### Requirement 24: Soft Delete

**User Story:** Como desenvolvedor, eu quero soft delete em entidades de conteúdo, para que o sistema preserve histórico e progresso do usuário.

#### Acceptance Criteria

1. THE System SHALL implement soft delete for Course, Module, Lesson, Exercise entities
2. WHEN soft deleting an entity, THE System SHALL set deletedAt to current timestamp
3. WHEN querying entities, THE System SHALL exclude soft-deleted records by default
4. THE System SHALL provide admin endpoints to query soft-deleted records
5. THE System SHALL prevent hard delete of entities with user progress references
6. THE System SHALL use @SQLDelete and @Where annotations for soft delete implementation

### Requirement 25: Migrations de Banco de Dados

**User Story:** Como desenvolvedor, eu quero migrations versionadas, para que o sistema possa evoluir o schema de forma controlada.

#### Acceptance Criteria

1. THE System SHALL use Flyway for database migration management
2. THE System SHALL store migration files in src/main/resources/db/migration
3. THE System SHALL name migration files following pattern V{version}__{description}.sql
4. THE System SHALL execute migrations automatically on application startup
5. THE System SHALL validate migration checksums to prevent tampering
6. THE System SHALL fail application startup if migration fails
7. THE System SHALL create initial schema migration V1__initial_schema.sql with all entities
8. THE System SHALL create indexes migration V2__create_indexes.sql with all performance indexes

### Requirement 26: Preparação para Fase 2

**User Story:** Como desenvolvedor, eu quero estrutura preparada para Fase 2, para que o sistema possa adicionar revisão inteligente sem refatoração.

#### Acceptance Criteria

1. THE Exercise_Attempt_Entity SHALL store sufficient data for error pattern analysis
2. THE Exercise_Entity SHALL include difficultyLevel for adaptive learning
3. THE Lesson_Completion_Entity SHALL include timeSpentSeconds for engagement analysis
4. THE Achievement_Entity and User_Achievement_Entity SHALL be fully implemented but not exposed in MVP APIs
5. THE System SHALL have indexes prepared for analytics queries
6. THE System SHALL use JSON fields for flexible criteria storage in Achievement

### Requirement 27: Preparação para Fase 3

**User Story:** Como desenvolvedor, eu quero estrutura preparada para Fase 3, para que o sistema possa adicionar ranking e novos cursos facilmente.

#### Acceptance Criteria

1. THE User_Entity SHALL have index on totalXp for ranking queries
2. THE Course_Entity SHALL use slug for URL routing of new courses
3. THE Course_Entity SHALL use displayOrder for flexible course ordering
4. THE System SHALL use UUID primary keys for distributed system compatibility
5. THE Exercise_Entity SHALL use JSON options field for new exercise types
6. THE System SHALL design schema to support horizontal scaling

### Requirement 28: Performance e Otimização

**User Story:** Como desenvolvedor, eu quero queries otimizadas, para que o sistema responda rapidamente mesmo com muitos usuários.

#### Acceptance Criteria

1. THE System SHALL use database indexes on all foreign keys
2. THE System SHALL use composite indexes for multi-column queries
3. THE System SHALL use connection pooling with HikariCP (minimum 10, maximum 20 connections)
4. THE System SHALL enable second-level cache for Course, Module, Lesson entities
5. THE System SHALL use @EntityGraph for eager loading of relationships when needed
6. THE System SHALL implement pagination for list endpoints with default page size 20
7. THE System SHALL use database query timeout of 5 seconds
8. THE System SHALL log slow queries (> 1 second) for optimization

### Requirement 29: Testes e Qualidade

**User Story:** Como desenvolvedor, eu quero testes automatizados, para que o sistema mantenha qualidade e previna regressões.

#### Acceptance Criteria

1. THE System SHALL have unit tests for all service layer methods
2. THE System SHALL have integration tests for all API endpoints
3. THE System SHALL have repository tests using @DataJpaTest
4. THE System SHALL use H2 in-memory database for tests
5. THE System SHALL achieve minimum 80% code coverage
6. THE System SHALL use test fixtures for consistent test data
7. THE System SHALL test authentication and authorization scenarios
8. THE System SHALL test validation error scenarios
9. THE System SHALL test concurrent access scenarios for streak calculation

### Requirement 30: Documentação de API

**User Story:** Como desenvolvedor frontend, eu quero documentação clara da API, para que eu possa integrar o mobile app facilmente.

#### Acceptance Criteria

1. THE System SHALL use Springdoc OpenAPI for API documentation
2. THE System SHALL expose Swagger UI at /swagger-ui.html
3. THE System SHALL expose OpenAPI JSON at /v3/api-docs
4. THE System SHALL document all endpoints with descriptions
5. THE System SHALL document all request/response schemas
6. THE System SHALL document all error responses
7. THE System SHALL document authentication requirements
8. THE System SHALL include example requests and responses

### Requirement 31: Configuração e Ambientes

**User Story:** Como desenvolvedor, eu quero configuração por ambiente, para que o sistema possa rodar em dev, staging e produção.

#### Acceptance Criteria

1. THE System SHALL use Spring Profiles for environment configuration
2. THE System SHALL provide application-dev.properties for development
3. THE System SHALL provide application-prod.properties for production
4. THE System SHALL externalize sensitive configuration using environment variables
5. THE System SHALL use different database connections per environment
6. THE System SHALL enable SQL logging in development only
7. THE System SHALL configure CORS appropriately per environment
8. THE System SHALL use different JWT secrets per environment

### Requirement 32: Logging e Monitoramento

**User Story:** Como desenvolvedor, eu quero logging estruturado, para que o sistema facilite debugging e monitoramento.

#### Acceptance Criteria

1. THE System SHALL use SLF4J with Logback for logging
2. THE System SHALL log all API requests with method, path, status, duration
3. THE System SHALL log all authentication attempts
4. THE System SHALL log all database errors
5. THE System SHALL use different log levels: DEBUG for development, INFO for production
6. THE System SHALL include correlation ID in all logs for request tracing
7. THE System SHALL log to console in development and to file in production
8. THE System SHALL rotate log files daily with 30-day retention
