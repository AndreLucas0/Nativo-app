# Plano de Implementação Técnica — MVP-1

**Stack:** Spring Boot 4.0.6 · Java 21 · PostgreSQL · Flyway · JWT · springdoc-openapi

---

## 1. Notas Críticas: Spring Boot 4.0.6 vs 3.x

| Ponto | Spring Boot 3.x | Spring Boot 4.0.6 |
|---|---|---|
| Java mínimo | 17 | 17 (use 21) |
| Hibernate | 6.x | **7.x** |
| Soft delete annotation | `@Where` | **`@SQLRestriction`** (`@Where` removido) |
| Security authorization | `authorizeRequests()` | **`authorizeHttpRequests()`** |
| CSRF padrão | desabilitado para REST | **habilitado por padrão** — deve desabilitar explicitamente |
| Security adapter | `WebSecurityConfigurerAdapter` | **removido** — usar `SecurityFilterChain` bean |
| Flyway | depende de `flyway-core` | **requer `spring-boot-starter-flyway`** |
| APIs deprecated 3.x | presentes | **todas removidas** |

---

## 2. Estrutura de Pacotes

```
com.nativo.app
├── AppApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── JpaConfig.java
│   └── OpenApiConfig.java
├── domain/
│   ├── common/
│   │   └── BaseEntity.java
│   ├── user/
│   │   ├── User.java
│   │   └── UserRepository.java
│   ├── course/
│   │   ├── Course.java, CourseRepository.java
│   │   ├── Module.java, ModuleRepository.java
│   │   ├── Lesson.java, LessonRepository.java
│   │   ├── Exercise.java, ExerciseRepository.java
│   │   ├── Difficulty.java (enum)
│   │   ├── ExerciseType.java (enum)
│   │   └── DifficultyLevel.java (enum)
│   ├── progress/
│   │   ├── UserProgress.java, UserProgressRepository.java
│   │   ├── LessonCompletion.java, LessonCompletionRepository.java
│   │   └── ExerciseAttempt.java, ExerciseAttemptRepository.java
│   └── gamification/
│       ├── Achievement.java
│       ├── AchievementCategory.java (enum)
│       └── UserAchievement.java
├── application/
│   ├── auth/
│   │   ├── AuthService.java
│   │   ├── AuthRequest.java / AuthResponse.java (DTOs)
│   │   └── JwtService.java
│   ├── user/
│   │   ├── UserService.java
│   │   └── UserResponse.java (DTO)
│   ├── course/
│   │   ├── CourseService.java
│   │   └── CourseResponse.java / CourseDetailResponse.java (DTOs)
│   ├── lesson/
│   │   ├── LessonService.java
│   │   └── LessonResponse.java / LessonCompleteRequest.java (DTOs)
│   ├── exercise/
│   │   ├── ExerciseService.java
│   │   └── ExerciseSubmitRequest.java / ExerciseSubmitResponse.java (DTOs)
│   └── progress/
│       ├── ProgressService.java
│       └── ProgressResponse.java / DashboardResponse.java (DTOs)
├── web/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── CourseController.java
│   ├── LessonController.java
│   ├── ExerciseController.java
│   └── ProgressController.java
└── infrastructure/
    ├── security/
    │   ├── JwtAuthenticationFilter.java
    │   └── UserDetailsServiceImpl.java
    └── exception/
        ├── GlobalExceptionHandler.java
        └── ErrorResponse.java
```

---

## 3. pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
           https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.0.6</version>
  </parent>

  <groupId>com.nativo</groupId>
  <artifactId>app</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>Nativo App Backend</name>

  <properties>
    <java.version>21</java.version>
    <jjwt.version>0.12.6</jjwt.version>
    <springdoc.version>2.8.8</springdoc.version>
  </properties>

  <dependencies>
    <!-- Web -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- JPA -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- Security -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- Bean Validation -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Flyway — OBRIGATÓRIO usar o starter no Boot 4.x -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-flyway</artifactId>
    </dependency>

    <!-- PostgreSQL -->
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>

    <!-- JWT (JJWT) -->
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-api</artifactId>
      <version>${jjwt.version}</version>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-impl</artifactId>
      <version>${jjwt.version}</version>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-jackson</artifactId>
      <version>${jjwt.version}</version>
      <scope>runtime</scope>
    </dependency>

    <!-- OpenAPI / Swagger -->
    <dependency>
      <groupId>org.springdoc</groupId>
      <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
      <version>${springdoc.version}</version>
    </dependency>

    <!-- Lombok -->
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>

    <!-- Testes -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.security</groupId>
      <artifactId>spring-security-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.h2database</groupId>
      <artifactId>h2</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <configuration>
          <excludes>
            <exclude>
              <groupId>org.projectlombok</groupId>
              <artifactId>lombok</artifactId>
            </exclude>
          </excludes>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

---

## 4. Configuração Base

### `application.properties`
```properties
spring.application.name=nativo-app

# DataSource
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/nativo}
spring.datasource.username=${DB_USER:nativo}
spring.datasource.password=${DB_PASSWORD:nativo}

# HikariCP
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.connection-timeout=30000

# JPA — nunca usar ddl-auto=create/update em prod; Flyway cuida do schema
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.open-in-view=false

# Flyway
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true

# JWT
jwt.secret=${JWT_SECRET:changeme-use-env-var-in-prod-min-256-bits}
jwt.access-token-expiration=900000
jwt.refresh-token-expiration=604800000

# Springdoc
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.disable-swagger-default-url=true
```

### `application-dev.properties`
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nativo_dev
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
logging.level.com.nativo=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

### `application-prod.properties`
```properties
spring.jpa.show-sql=false
logging.level.com.nativo=INFO
logging.file.name=/var/log/nativo/app.log
logging.logback.rollingpolicy.max-history=30
```

---

## 5. Camada de Domínio — Entidades

### 5.1 BaseEntity
```java
// @MappedSuperclass com @CreatedDate, @LastModifiedDate (Spring Data JPA Auditing)
// Requer @EnableJpaAuditing em JpaConfig
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;
}
```

### 5.2 User
Campos: email (UNIQUE), passwordHash, name, profileImageUrl, totalXp, currentLevel,
currentStreak, longestStreak, lastActivityDate (LocalDate), deletedAt.

### 5.3 Course / Module / Lesson / Exercise
- Soft delete com `@SQLDelete` + `@SQLRestriction` (**não `@Where`** — removido no Hibernate 7)
```java
// Padrão para todas as entidades com soft delete:
@SQLDelete(sql = "UPDATE courses SET deleted_at = now() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")  // Hibernate 7 — substitui @Where
@Entity
public class Course extends BaseEntity { ... }
```

### 5.4 Achievement / UserAchievement
Implementadas completamente mas **não expostas via endpoint no MVP-1** (preparação Fase 2).

---

## 6. Migrations Flyway

### Localização: `src/main/resources/db/migration/`

#### `V1__initial_schema.sql`
Cria todas as tabelas na seguinte ordem (respeitar FK constraints):
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

Pontos críticos no SQL:
- UUID como PK: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `options JSONB` no Exercise (mais eficiente que JSON no PostgreSQL)
- `criteria JSONB` no Achievement
- `ON DELETE RESTRICT` para FKs de conteúdo; `ON DELETE CASCADE` para userId

#### `V2__create_indexes.sql`
- `CREATE UNIQUE INDEX ON users(email)`
- `CREATE INDEX ON users(total_xp)`
- `CREATE INDEX ON courses(slug)`
- `CREATE INDEX ON courses(is_active, display_order)`
- `CREATE UNIQUE INDEX ON modules(course_id, display_order)`
- `CREATE UNIQUE INDEX ON lessons(module_id, display_order)`
- `CREATE UNIQUE INDEX ON exercises(lesson_id, display_order)`
- `CREATE UNIQUE INDEX ON user_progress(user_id, course_id)`
- `CREATE INDEX ON user_progress(user_id)`
- `CREATE INDEX ON lesson_completions(user_id, lesson_id, completed_at)`
- `CREATE INDEX ON lesson_completions(user_id, course_id)`
- `CREATE INDEX ON exercise_attempts(user_id, exercise_id, attempted_at)`
- `CREATE INDEX ON exercise_attempts(exercise_id, is_correct)`
- `CREATE UNIQUE INDEX ON user_achievements(user_id, achievement_id)`

#### `V3__seed_courses.sql`
Dados iniciais dos 2 cursos (Expo + AWS) com módulos e lições placeholder
para que o sistema possa ser testado sem dados manualmente inseridos.

---

## 7. Segurança — Spring Boot 4.0.6

### 7.1 SecurityConfig
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http,
                                    JwtAuthenticationFilter jwtFilter) throws Exception {
        return http
            // ATENÇÃO: CSRF habilitado por padrão no Boot 4 — desabilitar para API REST
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}
```

### 7.2 JwtService
```java
// Usa io.jsonwebtoken:jjwt-api 0.12.x
// Métodos: generateAccessToken(userId), generateRefreshToken(userId),
//          extractUserId(token), isTokenValid(token)
// Access token: 15 min | Refresh token: 7 dias
// Secret lido de jwt.secret property (mínimo 256 bits para HS256)
```

### 7.3 JwtAuthenticationFilter
```java
// Extends OncePerRequestFilter
// 1. Lê header Authorization: Bearer <token>
// 2. Valida token via JwtService
// 3. Carrega UserDetails via UserDetailsServiceImpl
// 4. Seta SecurityContextHolder
```

---

## 8. Camada de Aplicação — Services

### 8.1 AuthService
- `register(RegisterRequest)` → valida unicidade de email, hash BCrypt, cria User, retorna tokens
- `login(LoginRequest)` → autentica, retorna tokens
- `refresh(RefreshRequest)` → valida refresh token, emite novo access token
- `forgotPassword(email)` → gera token, envia email (MVP: só gera token, email é stub)
- `resetPassword(token, newPassword)` → valida token, atualiza senha

### 8.2 CourseService
- `listActiveCourses(userId)` → retorna cursos ativos com flag `isStarted` + `progressPercentage`
- `getCourseDetails(courseId, userId)` → retorna curso completo com módulos/lições + status `isCompleted`/`isLocked` por lição
- `startCourse(courseId, userId)` → cria `UserProgress` (409 se já existe)

### 8.3 LessonService
- `getLessonContent(lessonId, userId)` → retorna lição + exercícios **sem** `correctAnswer`
- `completeLesson(lessonId, userId, request)` → pipeline:
  1. Valida que todos os exercícios foram tentados
  2. Calcula `score = (corretos / total) * 100`
  3. Verifica `score >= lesson.minimumScore`
  4. Persiste `LessonCompletion`
  5. Chama `ProgressService.updateProgress()`
  6. Chama `GamificationService.processXpAndStreak()`
  7. Retorna feedback por exercício + XP ganho + streak + nível

### 8.4 ExerciseService
- `submitAnswer(exerciseId, userId, request)` → persiste `ExerciseAttempt`, retorna `isCorrect` + `explanation`

### 8.5 ProgressService
- `getAllProgress(userId)` → lista todos os `UserProgress` do usuário
- `getCourseProgress(userId, courseId)` → detalha progresso com histórico de lições
- `getDashboard(userId)` → agrega: user stats + cursos ativos + conclusões recentes

### 8.6 GamificationService
- `processXpAndStreak(userId, lessonId, xpReward)`:
  1. **XP**: soma `xpReward` a `user.totalXp` e `userProgress.totalXpEarned`
     - Apenas na **primeira conclusão do dia** (verifica `LessonCompletion` de hoje)
  2. **Nível**: recalcula com `floor(sqrt(totalXp / 100)) + 1`
  3. **Streak**:
     - `lastActivityDate == hoje` → não altera streak
     - `lastActivityDate == ontem` → incrementa `currentStreak`
     - Demais → reseta `currentStreak = 1`
     - Atualiza `longestStreak` se necessário
     - Atualiza `lastActivityDate = hoje`

---

## 9. Camada Web — Controllers

### Mapeamento de endpoints conforme `requirements-MVP-1.md` Req. 14:

| Controller | Endpoints |
|---|---|
| `AuthController` | POST /api/auth/register, /login, /refresh, /forgot-password, /reset-password |
| `UserController` | GET /api/users/me, PUT /api/users/me, PUT /api/users/me/password |
| `CourseController` | GET /api/courses, GET /api/courses/{id}, POST /api/courses/{id}/start |
| `LessonController` | GET /api/lessons/{id}, POST /api/lessons/{id}/complete |
| `ExerciseController` | POST /api/exercises/{id}/submit |
| `ProgressController` | GET /api/progress, GET /api/progress/{courseId}, GET /api/progress/dashboard |

### Padrão de resposta de erro (GlobalExceptionHandler com @RestControllerAdvice):
```json
{
  "timestamp": "2026-05-25T14:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Email já cadastrado",
  "path": "/api/auth/register"
}
```

---

## 10. Tratamento de Erros

### Exceções de domínio a criar:
- `ResourceNotFoundException` → 404
- `ConflictException` → 409
- `UnauthorizedException` → 401
- `ForbiddenException` → 403
- `ValidationException` → 400

### GlobalExceptionHandler:
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    // Handler para cada exceção de domínio
    // Handler para MethodArgumentNotValidException (Bean Validation)
    // Handler para Exception genérico → 500 (sem stack trace na resposta)
}
```

---

## 11. JPA Config

```java
@Configuration
@EnableJpaAuditing  // Habilita @CreatedDate e @LastModifiedDate
public class JpaConfig { }
```

---

## 12. Plano de Sprints

### Sprint 1 — Foundation + Autenticação (estimativa: 5-7 dias)
**Objetivo:** API de auth funcionando end-to-end

- [ ] Criar projeto Spring Boot 4.0.6 (pom.xml conforme seção 3)
- [ ] Configurar `application.properties` + profiles dev/prod
- [ ] Criar `BaseEntity` com auditing
- [ ] Criar entidade `User` com todos os campos do Req. 1
- [ ] Criar `V1__initial_schema.sql` (apenas tabela `users`)
- [ ] Implementar `JwtService` (geração + validação de access/refresh token)
- [ ] Implementar `UserDetailsServiceImpl`
- [ ] Configurar `SecurityConfig` com CSRF desabilitado e rotas públicas
- [ ] Implementar `JwtAuthenticationFilter`
- [ ] Implementar `AuthService` (register + login + refresh)
- [ ] Criar `AuthController` com os 5 endpoints de auth
- [ ] Criar `GlobalExceptionHandler` com respostas padronizadas
- [ ] Testes unitários: `AuthService`, `JwtService`
- [ ] Teste de integração: `POST /api/auth/register` e `/login`

**Entregável:** `POST /api/auth/register`, `/login`, `/refresh` funcionando com PostgreSQL local

---

### Sprint 2 — Conteúdo: Cursos, Módulos, Lições, Exercícios (estimativa: 4-6 dias)
**Objetivo:** Frontend pode listar e navegar cursos

- [ ] Criar entidades `Course`, `Module`, `Lesson`, `Exercise` com `@SQLRestriction` para soft delete
- [ ] Criar enums: `Difficulty`, `ExerciseType`, `DifficultyLevel`
- [ ] Atualizar `V1__initial_schema.sql` com todas as tabelas de conteúdo
- [ ] Criar `V2__create_indexes.sql`
- [ ] Criar `V3__seed_courses.sql` com dados dos cursos Expo e AWS
- [ ] Implementar `CourseService` (listActiveCourses, getCourseDetails, startCourse)
- [ ] Criar `UserProgress` entity + `UserProgressRepository`
- [ ] Criar `CourseController` com 3 endpoints
- [ ] Criar `UserController` (GET /api/users/me + PUT)
- [ ] Testes de integração: endpoints de cursos
- [ ] Configurar springdoc-openapi (Swagger UI acessível)

**Entregável:** Listagem e detalhe de cursos, iniciar curso, perfil do usuário

---

### Sprint 3 — Lições, Exercícios e Gamificação (estimativa: 5-7 dias)
**Objetivo:** Fluxo completo de aprendizado — fazer uma lição e ganhar XP

- [ ] Criar entidades `LessonCompletion`, `ExerciseAttempt`
- [ ] Criar entidades `Achievement`, `UserAchievement` (implementadas, sem endpoint)
- [ ] Atualizar migration com tabelas de progresso e gamificação
- [ ] Implementar `LessonService.getLessonContent()` (sem `correctAnswer` na resposta)
- [ ] Implementar `LessonService.completeLesson()` com pipeline completo
- [ ] Implementar `GamificationService` (XP + nível + streak)
- [ ] Implementar `ExerciseService.submitAnswer()`
- [ ] Implementar `ProgressService` (todos os 3 endpoints)
- [ ] Criar `LessonController`, `ExerciseController`, `ProgressController`
- [ ] Lógica de bloqueio de lição (verificar `completedLessons` para liberar próxima)
- [ ] Testes unitários: `GamificationService` (especialmente lógica de streak com datas)
- [ ] Testes de integração: `POST /api/lessons/{id}/complete`

**Entregável:** Fluxo completo: login → listar curso → iniciar lição → submeter exercícios → concluir lição → XP + streak atualizados

---

### Sprint 4 — Polish, Segurança e Observabilidade (estimativa: 3-5 dias)
**Objetivo:** API pronta para integração com o mobile

- [ ] Implementar `PUT /api/users/me/password`
- [ ] Implementar forgot-password / reset-password (stub de email)
- [ ] Adicionar rate limiting (100 req/min/usuário via `spring-boot-starter-web` + filtro customizado)
- [ ] Logging estruturado com correlation ID (MDC)
- [ ] Revisar e documentar todos os endpoints no OpenAPI (descrições, exemplos, schemas)
- [ ] Testes de segurança: acesso sem token (401), acesso a dados de outro usuário (403)
- [ ] Testes de validação: campos obrigatórios, email inválido, senha fraca
- [ ] Configurar HikariCP (min-idle=10, max-pool-size=20)
- [ ] Verificar cobertura de testes (meta: ≥80%)
- [ ] Criar `docker-compose.yml` para PostgreSQL local

**Entregável:** API completa, documentada, testada, pronta para o time mobile integrar

---

## 13. Armadilhas Específicas Spring Boot 4.0.6

### @SQLRestriction vs @Where
```java
// ERRADO — @Where foi removido no Hibernate 7
@Where(clause = "deleted_at IS NULL")

// CORRETO para Spring Boot 4.0.6 / Hibernate 7
@SQLRestriction("deleted_at IS NULL")
```

### SecurityFilterChain e CSRF
```java
// CRÍTICO: em Boot 4.x CSRF está habilitado por padrão
// Uma API REST stateless DEVE desabilitar
.csrf(csrf -> csrf.disable())

// CRÍTICO: usar authorizeHttpRequests, NÃO authorizeRequests
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()
    .anyRequest().authenticated()
)
```

### Flyway — usar starter, não flyway-core diretamente
```xml
<!-- CORRETO no Boot 4.x -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-flyway</artifactId>
</dependency>
```

### Teste com H2
H2 não suporta `gen_random_uuid()` (função do PostgreSQL). Em testes:
```java
// application-test.properties
spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL
spring.flyway.locations=classpath:db/migration,classpath:db/test-migration
// criar db/test-migration/R__override_uuid.sql se necessário
// OU: usar @GeneratedValue(strategy = UUID) no JPA em vez de SQL default
```
Alternativa mais robusta: usar **Testcontainers** com PostgreSQL real em testes de integração.

### JSONB no H2
`JSONB` não existe no H2. Usar `@Column(columnDefinition = "jsonb")` no JPA, mas para testes configurar:
```properties
# Para H2 em modo test
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect
```
E substituir `jsonb` por `varchar` nas migrations de test. Ou usar Testcontainers.

---

## 14. docker-compose.yml (desenvolvimento local)

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: nativo_dev
      POSTGRES_USER: nativo
      POSTGRES_PASSWORD: nativo
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## 15. Checklist Pré-Deploy

- [ ] Variáveis de ambiente definidas: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`
- [ ] `JWT_SECRET` com mínimo 32 caracteres aleatórios (256 bits para HS256)
- [ ] Profile `prod` ativo: `SPRING_PROFILES_ACTIVE=prod`
- [ ] Flyway migrations validadas (`spring.flyway.validate-on-migrate=true`)
- [ ] `spring.jpa.hibernate.ddl-auto=validate` (nunca `create` em prod)
- [ ] Swagger desabilitado em prod ou protegido por autenticação
- [ ] Logs configurados para arquivo com rotação diária
- [ ] Connection pool testado sob carga

---

## Referências

- [Spring Boot 4.0.6 Release Notes](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now/)
- [Spring Boot 4.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide)
- [Hibernate 7 — @SQLRestriction](https://docs.jboss.org/hibernate/orm/7.0/userguide/html_single/Hibernate_User_Guide.html)
- [springdoc-openapi v2](https://springdoc.org/)
- [JJWT 0.12.x API](https://github.com/jwtk/jjwt)
