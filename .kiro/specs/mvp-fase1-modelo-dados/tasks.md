``` markdown
# Tasks - MVP Fase 1: Plataforma de Aprendizado Gamificado

## Task List

- [ ] 1. Setup do Projeto
  - [x] 1.1 Inicializar projeto Spring Boot
    - Criar projeto base com Spring Initializr com Java 17+, Spring Boot 3.x
    - Incluir dependências: spring-boot-starter-web, spring-boot-starter-data-jpa, spring-boot-starter-security, spring-boot-starter-validation, postgresql, flyway-core, lombok, springdoc-openapi-starter-webmvc-ui, jjwt
    - Verificar que o projeto compila sem erros com ./mvnw clean compile
    - Confirmar que .gitignore está configurado para Java/Maven
    - _Requirements: REQ-31_

  - [x] 1.2 Configurar perfis de ambiente (dev / prod)
    - Criar application.properties com spring.profiles.active configurável
    - Criar application-dev.properties com banco local, SQL logging habilitado e CORS aberto
    - Criar application-prod.properties lendo DB_URL, DB_USER, DB_PASS, JWT_SECRET de variáveis de ambiente
    - Garantir JWT secret diferente por ambiente e SQL logging desabilitado em prod
    - _Requirements: REQ-31_

  - [ ] 1.3 Configurar Flyway e migration inicial
    - Configurar Flyway em application.properties
    - Criar V1__initial_schema.sql em src/main/resources/db/migration
    - Migration deve criar tabelas: users, courses, modules, lessons, exercises, user_progress, lesson_completions, exercise_attempts, achievements, user_achievements
    - Verificar que a aplicação sobe sem erros de migration e Flyway valida checksum
    - _Requirements: REQ-25_

  - [ ] 1.4 Criar migration de índices
    - Criar V2__create_indexes.sql com todos os índices de performance
    - Incluir índices em users.email e users.total_xp
    - Incluir índices compostos em modules(course_id, display_order), lessons(module_id, display_order), exercises(lesson_id, display_order)
    - Incluir índices compostos em user_progress(user_id, course_id)
    - Incluir índices compostos em lesson_completions(user_id, lesson_id, completed_at) e lesson_completions(user_id, course_id)
    - Incluir índices compostos em exercise_attempts(user_id, exercise_id, attempted_at) e exercise_attempts(exercise_id, is_correct)
    - Incluir índices em achievements(is_active, display_order) e user_achievements(user_id, unlocked_at)
    - _Requirements: REQ-25, REQ-28_

  - [ ] 1.5 Configurar HikariCP e auditoria JPA
    - Configurar HikariCP com minimum-idle=10, maximum-pool-size=20, connection-timeout=30000
    - Habilitar @EnableJpaAuditing na classe principal ou em @Configuration
    - Configurar query timeout para 5 segundos
    - Habilitar slow query log (> 1s) em dev
    - _Requirements: REQ-28, REQ-23_

  - [ ] 1.6 Configurar logging estruturado
    - Criar logback-spring.xml em src/main/resources
    - Configurar nível DEBUG com saída no console para dev
    - Configurar nível INFO com saída em arquivo, rotação diária e retenção de 30 dias para prod
    - Incluir Correlation ID (X-Request-ID) via MDC em todos os logs
    - Logar todas as requisições com método, path, status e duração
    - _Requirements: REQ-32_

- [ ] 2. Entidades e Repositórios
  - [ ] 2.1 Criar classe base BaseEntity com audit fields
    - Criar classe abstrata com campos createdAt (@CreatedDate) e updatedAt (@LastModifiedDate) como LocalDateTime UTC
    - Anotar com @MappedSuperclass e @EntityListeners(AuditingEntityListener.class)
    - Garantir timestamps com precisão de milissegundos
    - _Requirements: REQ-23_

  - [ ] 2.2 Criar entidade User
    - Implementar campos: id (UUID PK), email (unique, not null), passwordHash (not null), name (not null), profileImageUrl (nullable), totalXp (default 0), currentLevel (default 1), currentStreak (default 0), longestStreak (default 0), lastActivityDate (nullable), deletedAt (nullable)
    - Estender BaseEntity e adicionar @UniqueConstraint em email
    - Anotar com @Email e @NotBlank onde aplicável
    - Implementar soft delete com @SQLDelete e @Where
    - _Requirements: REQ-1_

  - [ ] 2.3 Criar entidade Course
    - Implementar campos: id, name, description, slug (unique), imageUrl, difficulty (enum: BEGINNER, INTERMEDIATE, ADVANCED), isActive (default true), displayOrder, estimatedHours, deletedAt
    - Estender BaseEntity com constraint única em slug
    - Implementar soft delete com @SQLDelete e @Where
    - _Requirements: REQ-2_

  - [ ] 2.4 Criar entidade Module
    - Implementar campos: id, courseId (FK → Course), name, description, displayOrder, isActive (default true), deletedAt
    - Adicionar constraint única em (courseId, displayOrder) e FK com ON DELETE RESTRICT
    - Implementar soft delete; estender BaseEntity
    - _Requirements: REQ-3_

  - [ ] 2.5 Criar entidade Lesson
    - Implementar campos: id, moduleId (FK → Module), name, content (TEXT), displayOrder, xpReward (default 10), minimumScore (default 70), estimatedMinutes, isActive (default true), deletedAt
    - Adicionar constraint única em (moduleId, displayOrder) e validação @Min(0) @Max(100) em minimumScore
    - Implementar soft delete; estender BaseEntity
    - _Requirements: REQ-4_

  - [ ] 2.6 Criar entidade Exercise
    - Implementar campos: id, lessonId (FK → Lesson), type (enum: MULTIPLE_CHOICE, TRUE_FALSE, FILL_CODE, MATCH, ORDER_STEPS), question (TEXT), options (JSONB/nullable), correctAnswer (TEXT), explanation (TEXT/nullable), displayOrder, points (default 10), difficultyLevel (enum: EASY, MEDIUM, HARD/nullable), deletedAt
    - Mapear options como @Column(columnDefinition = "jsonb")
    - Adicionar constraint única em (lessonId, displayOrder); implementar soft delete
    - _Requirements: REQ-5_

  - [ ] 2.7 Criar entidade UserProgress
    - Implementar campos: id, userId (FK → User), courseId (FK → Course), currentModuleId (FK → Module/nullable), currentLessonId (FK → Lesson/nullable), totalXpEarned (default 0), completedLessonsCount (default 0), lastAccessedAt, startedAt, completedAt, createdAt, updatedAt
    - Adicionar constraint única em (userId, courseId); FK userId com ON DELETE CASCADE, courseId com ON DELETE RESTRICT
    - _Requirements: REQ-6_

  - [ ] 2.8 Criar entidade LessonCompletion
    - Implementar campos: id, userId (FK → User), lessonId (FK → Lesson), courseId (FK → Course), score (not null), xpEarned (not null), completedAt (not null), timeSpentSeconds (nullable), attemptNumber (default 1), createdAt
    - FK userId com ON DELETE CASCADE; permitir múltiplos registros por (userId, lessonId)
    - _Requirements: REQ-7_

  - [ ] 2.9 Criar entidade ExerciseAttempt
    - Implementar campos: id, userId (FK → User), exerciseId (FK → Exercise), lessonId (FK → Lesson), userAnswer (TEXT), isCorrect (boolean), attemptedAt (precisão de milissegundos), timeSpentSeconds (nullable), createdAt
    - FK userId com ON DELETE CASCADE; permitir múltiplos registros por (userId, exerciseId)
    - _Requirements: REQ-8_

  - [ ] 2.10 Criar entidades Achievement e UserAchievement
    - Implementar Achievement com campos: id, name, description, iconUrl, category (enum: STREAK, LESSONS, XP, COURSE, SPECIAL), criteria (JSONB), xpReward (default 0), isActive (default true), displayOrder, createdAt, updatedAt
    - Implementar UserAchievement com campos: id, userId (FK/CASCADE), achievementId (FK), unlockedAt, createdAt e constraint única em (userId, achievementId)
    - Entidades criadas e mapeadas, sem endpoints REST no MVP-1
    - _Requirements: REQ-9, REQ-10_

  - [ ] 2.11 Criar repositórios JPA
    - Criar UserRepository com: findByEmail, findByIdAndDeletedAtIsNull
    - Criar CourseRepository com: findAllByIsActiveTrueOrderByDisplayOrder, findBySlug
    - Criar ModuleRepository com: findByCourseIdOrderByDisplayOrder
    - Criar LessonRepository com: findByModuleIdOrderByDisplayOrder
    - Criar ExerciseRepository com: findByLessonIdOrderByDisplayOrder
    - Criar UserProgressRepository com: findByUserIdAndCourseId, findAllByUserId
    - Criar LessonCompletionRepository com: findAllByUserIdAndCourseId, countByUserIdAndLessonId
    - Criar ExerciseAttemptRepository com: findByUserIdAndExerciseId
    - _Requirements: REQ-28_

- [ ] 3. Segurança e Autenticação
  - [ ] 3.1 Configurar Spring Security base
    - Configurar SecurityFilterChain com rotas públicas: /api/auth/**, /swagger-ui/**, /v3/api-docs/**
    - Todas as demais rotas requerem autenticação
    - Desabilitar CSRF (API stateless) e configurar sessão como STATELESS
    - Configurar CORS por perfil: dev aberto, prod com origem restrita
    - _Requirements: REQ-21_

  - [ ] 3.2 Implementar geração e validação de JWT
    - Criar JwtService com métodos: generateAccessToken(userId, email), generateRefreshToken(userId), validateToken(token), extractUserId(token), extractEmail(token)
    - Access token com expiração de 15 minutos; refresh token com expiração de 7 dias
    - Claims: userId, email, iat, exp; segredo lido de variável de ambiente
    - _Requirements: REQ-15, REQ-21_

  - [ ] 3.3 Implementar filtro JWT (JwtAuthenticationFilter)
    - Extrair token do header Authorization: Bearer {token}
    - Validar token via JwtService e injetar UsernamePasswordAuthenticationToken no SecurityContext
    - Retornar 401 para token inválido ou expirado; ignorar filtragem para rotas públicas
    - _Requirements: REQ-21_

  - [ ] 3.4 Implementar UserDetailsService
    - Criar UserDetailsServiceImpl implementando UserDetailsService
    - Carregar usuário por email via UserRepository
    - Lançar UsernameNotFoundException para usuário não encontrado ou com deletedAt preenchido
    - _Requirements: REQ-21_

  - [ ] 3.5 Implementar AuthService
    - Implementar register(email, password, name): validar unicidade de email, hash bcrypt strength 10, criar User, retornar tokens
    - Implementar login(email, password): verificar credenciais com BCryptPasswordEncoder, retornar tokens
    - Implementar refreshToken(refreshToken): validar refresh token, retornar novos tokens
    - Lançar exceções específicas para email duplicado e credenciais inválidas
    - _Requirements: REQ-15_

  - [ ] 3.6 Criar AuthController
    - Expor POST /api/auth/register → 201 ou 409 ou 400
    - Expor POST /api/auth/login → 200 ou 401
    - Expor POST /api/auth/refresh → 200 ou 401
    - Expor POST /api/auth/forgot-password → 200 (sempre, para não vazar emails)
    - Expor POST /api/auth/reset-password → 200 ou 400
    - Resposta padronizada com userId, email, name, accessToken, refreshToken
    - _Requirements: REQ-15_

- [ ] 4. Perfil do Usuário
  - [ ] 4.1 Implementar UserService
    - Implementar getProfile(userId): retornar dados públicos sem passwordHash
    - Implementar updateProfile(userId, name, profileImageUrl): atualizar campos permitidos
    - Implementar changePassword(userId, currentPassword, newPassword): validar senha atual, hash da nova
    - Validar senha: mínimo 8 caracteres, ao menos 1 maiúscula, 1 minúscula, 1 dígito
    - _Requirements: REQ-1, REQ-20_

  - [ ] 4.2 Criar UserController
    - Expor GET /api/users/me → 200 com dados do usuário autenticado
    - Expor PUT /api/users/me → 200 com perfil atualizado
    - Expor PUT /api/users/me/password → 200 ou 400
    - userId sempre extraído do JWT, nunca do body; retornar 401 para token ausente/inválido
    - _Requirements: REQ-14_

- [ ] 5. Cursos e Conteúdo
  - [ ] 5.1 Implementar CourseService
    - Implementar listActiveCourses(userId): retornar cursos ativos ordenados por displayOrder com isStarted e progressPercentage
    - Implementar getCourseDetails(courseId, userId): retornar curso com módulos e lições incluindo isCompleted e isLocked por lição
    - Lição travada (isLocked) se a anterior não foi concluída
    - Lançar ResourceNotFoundException para curso inexistente ou inativo
    - _Requirements: REQ-16_

  - [ ] 5.2 Implementar CourseProgressService
    - Implementar startCourse(userId, courseId): criar UserProgress com startedAt = now()
    - Lançar ConflictException se progresso já existe para o par (userId, courseId)
    - Lançar ResourceNotFoundException se curso não existe ou está inativo
    - Retornar userProgressId, courseId, startedAt
    - _Requirements: REQ-16, REQ-6_

  - [ ] 5.3 Criar CourseController
    - Expor GET /api/courses → 200 com lista de cursos
    - Expor GET /api/courses/{courseId} → 200 com detalhes ou 404
    - Expor POST /api/courses/{courseId}/start → 201 ou 409 ou 404
    - Todos os endpoints requerem JWT
    - _Requirements: REQ-14_

- [ ] 6. Lições e Exercícios
  - [ ] 6.1 Implementar LessonService (leitura)
    - Implementar getLesson(lessonId, userId): retornar lição com exercícios ordenados por displayOrder
    - Não incluir correctAnswer na resposta de exercícios
    - Lançar ResourceNotFoundException para lição inexistente
    - Lançar AccessDeniedException se lição está travada para o usuário
    - _Requirements: REQ-17_

  - [ ] 6.2 Implementar ScoreService
    - Implementar calculateScore(attempts, exercises): retornar (respostas corretas / total exercícios) * 100
    - Validar que todos os exercícios da lição foram tentados
    - Retornar lista de feedback por exercício (exerciseId, isCorrect, explanation)
    - Método puro sem efeitos colaterais para facilitar testes isolados
    - _Requirements: REQ-17_

  - [ ] 6.3 Implementar XpAndLevelService
    - Implementar awardXp(userId, xpAmount, courseId): adicionar XP ao usuário e ao UserProgress
    - Aplicar fórmula de nível: level = floor(sqrt(totalXp / 100)) + 1
    - Recalcular e persistir currentLevel após cada mudança de XP
    - Conceder XP apenas na primeira conclusão da lição no dia; registrar LessonCompletion sem XP em repetições
    - _Requirements: REQ-12_

  - [ ] 6.4 Implementar StreakService
    - Implementar updateStreak(userId): atualizar currentStreak, longestStreak e lastActivityDate
    - Se lastActivityDate == ontem: incrementar currentStreak
    - Se lastActivityDate == hoje: não modificar streak
    - Se lastActivityDate < ontem ou null: resetar currentStreak para 1
    - Atualizar longestStreak se currentStreak > longestStreak; usar UTC para comparação
    - _Requirements: REQ-11_

  - [ ] 6.5 Implementar LessonCompletionService
    - Implementar completeLesson(userId, lessonId, attempts): validar exercícios, calcular score via ScoreService, criar LessonCompletion (incrementar attemptNumber se já existir)
    - Atualizar UserProgress (completedLessonsCount, currentLessonId, lastAccessedAt)
    - Chamar XpAndLevelService.awardXp e StreakService.updateStreak
    - Setar completedAt no UserProgress quando completedLessonsCount == totalLessonsCount
    - Retornar: score, xpEarned, passed (score >= minimumScore), currentStreak, totalXp, currentLevel, feedback
    - _Requirements: REQ-17, REQ-7_

  - [ ] 6.6 Criar LessonController
    - Expor GET /api/lessons/{lessonId} → 200 ou 403 ou 404
    - Expor POST /api/lessons/{lessonId}/complete com body { exerciseAttempts: [{ exerciseId, userAnswer, timeSpentSeconds }] } → 200 ou 400 ou 403 ou 404
    - Todos os endpoints requerem JWT
    - _Requirements: REQ-14_

  - [ ] 6.7 Implementar ExerciseService e ExerciseController
    - Implementar submitAnswer(userId, exerciseId, userAnswer, timeSpentSeconds): validar resposta, criar ExerciseAttempt, retornar isCorrect e explanation
    - Expor POST /api/exercises/{exerciseId}/submit → 200 ou 400 ou 404
    - Resposta: { exerciseAttemptId, isCorrect, explanation }; 400 para resposta vazia/inválida
    - _Requirements: REQ-18_

- [ ] 7. Progresso e Dashboard
  - [ ] 7.1 Implementar ProgressService
    - Implementar getAllProgress(userId): retornar todos os UserProgress com progressPercentage
    - Implementar getCourseProgress(userId, courseId): retornar progresso detalhado com lista de LessonCompletion
    - Implementar getDashboard(userId): agregar dados do usuário, cursos ativos, conclusões recentes e estatísticas
    - Calcular progressPercentage = (completedLessonsCount / totalLessonsCount) * 100 com totalLessonsCount contando lições ativas
    - _Requirements: REQ-19_

  - [ ] 7.2 Criar ProgressController
    - Expor GET /api/progress → 200 com lista de progressos
    - Expor GET /api/progress/dashboard → 200 com dados do dashboard (mapear antes de /{courseId})
    - Expor GET /api/progress/{courseId} → 200 ou 404
    - Todos os endpoints requerem JWT
    - _Requirements: REQ-14_

- [ ] 8. Validação, Erros e Segurança
  - [ ] 8.1 Implementar GlobalExceptionHandler
    - Criar @ControllerAdvice com handlers para: MethodArgumentNotValidException (400), UsernameNotFoundException (401), AccessDeniedException (403), ResourceNotFoundException (404), ConflictException (409), Exception genérica (500)
    - Formato de resposta padrão: { timestamp, status, error, message, path }
    - Logar 500 com stack trace completo; retornar mensagem genérica sem expor detalhes internos
    - _Requirements: REQ-22_

  - [ ] 8.2 Implementar validações com Bean Validation
    - Anotar DTOs de request: @Email + @NotBlank em email, @NotBlank + @Size(min=8) + regex em senha
    - Anotar @Min(0) + @Max(100) em score onde aplicável; @Positive em displayOrder
    - Garantir que todos os campos not null dos requisitos estejam anotados com @NotNull ou @NotBlank
    - Verificar que erros retornam 400 com campo e mensagem
    - _Requirements: REQ-20_

  - [ ] 8.3 Implementar isolamento de dados por usuário
    - Garantir que userId seja sempre extraído do JWT, nunca do request body ou path param de terceiros
    - Verificar nos services que o recurso pertence ao userId do token antes de retornar ou modificar
    - Retornar 403 quando usuário tenta acessar dados de outro usuário
    - _Requirements: REQ-21_

  - [ ] 8.4 Implementar rate limiting
    - Limitar a 100 requisições por minuto por usuário autenticado
    - Retornar 429 Too Many Requests ao exceder limite
    - Incluir header X-RateLimit-Remaining nas respostas
    - Implementar via filtro ou biblioteca (ex: Bucket4j)
    - _Requirements: REQ-21_

- [ ] 9. Documentação de API
  - [ ] 9.1 Configurar Springdoc OpenAPI
    - Garantir Swagger UI acessível em /swagger-ui.html e OpenAPI JSON em /v3/api-docs
    - Anotar todos os controllers com @Tag e todos os endpoints com @Operation e @ApiResponse
    - Documentar schemas de request/response com @Schema e incluir exemplos
    - Configurar autenticação JWT no Swagger (Bearer token)
    - _Requirements: REQ-30_

- [ ] 10. Testes Automatizados
  - [ ] 10.1 Criar testes de repositório (@DataJpaTest)
    - Usar banco H2 in-memory para testes
    - Testar: findByEmail, findByUserIdAndCourseId, findAllByUserId
    - Testar constraints únicas (ex: (userId, courseId) em UserProgress)
    - Testar soft delete: entidade deletada não retornada em queries padrão
    - _Requirements: REQ-29_

  - [ ] 10.2 Criar testes unitários dos services
    - Criar StreakServiceTest cobrindo todos os cenários: ontem, hoje, antes de ontem, null
    - Criar XpAndLevelServiceTest cobrindo: fórmula de nível, regra de XP por dia, primeira vs repetição
    - Criar ScoreServiceTest cobrindo: cálculo correto de percentual, todos exercícios tentados
    - Criar LessonCompletionServiceTest cobrindo o fluxo completo de conclusão orquestrada
    - Atingir cobertura mínima de 80% nas classes de service
    - _Requirements: REQ-29_

  - [ ] 10.3 Criar testes de integração dos endpoints (@SpringBootTest)
    - Testar autenticação: register, login, refresh, token inválido → 401
    - Testar autorização: acesso sem token → 401, acesso a dados de outro usuário → 403
    - Testar cursos: listar, detalhar, iniciar, conflito ao reiniciar
    - Testar lição: buscar, completar com score correto, completar sem todos exercícios → 400
    - Testar progresso: dashboard, progresso por curso
    - Testar validação: campos obrigatórios ausentes → 400 com mensagem
    - _Requirements: REQ-29_

- [ ] 11. Seed de Dados
  - [ ] 11.1 Criar migration de seed de dados
    - Criar V3__seed_data.sql em src/main/resources/db/migration
    - Incluir ao menos 1 curso ativo (Expo ou AWS) com ao menos 2 módulos
    - Incluir lições e exercícios variados (MULTIPLE_CHOICE, TRUE_FALSE) em cada módulo
    - Incluir achievements de exemplo para as categorias STREAK, LESSONS e XP
    - _Requirements: REQ-25_
``` 