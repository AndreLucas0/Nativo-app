# Tasks – Plataforma tipo Duolingo (Expo + AWS)

---

## Épico 1: Autenticação

---

### US01 – Cadastro de usuário

#### TS-01-1 · Criar migration da tabela `users`
**Objetivo:** Criar a migration que define a estrutura da tabela de usuários no banco de dados.
**Critérios de Aceite:**
- Migration cria tabela `users` com campos: `id`, `email`, `passwordHash`, `createdAt`, `updatedAt`
- Campo `email` possui constraint `UNIQUE` e `NOT NULL`
- Campo `id` é chave primária auto-gerada (UUID ou serial)
- Migration é reversível (possui `down` function)
- Migration versionada e commitada no repositório

---

#### TS-01-2 · Criar model/entidade `User` no backend
**Objetivo:** Implementar a representação da entidade `User` na camada de domínio/ORM do backend.
**Critérios de Aceite:**
- Model mapeia todos os campos da tabela `users`
- Campo `passwordHash` não é exposto em serialização padrão (excluído do JSON de resposta)
- Model possui validações de tipo nos campos

---

#### TS-01-3 · Implementar função de hash de senha
**Objetivo:** Criar utilitário para gerar e comparar hashes de senha com bcrypt.
**Critérios de Aceite:**
- Função `hashPassword(plain)` retorna hash bcrypt com salt rounds >= 10
- Função `comparePassword(plain, hash)` retorna booleano
- Funções cobertas por testes unitários
- Nenhuma senha é logada ou retornada em texto puro

---

#### TS-01-4 · Criar repositório `UserRepository` com método `create`
**Objetivo:** Implementar a camada de acesso a dados para criação de usuários.
**Critérios de Aceite:**
- Método `create({ email, passwordHash })` persiste usuário e retorna entidade criada
- Lança erro específico em caso de violação de unicidade de email
- Coberto por teste de integração com banco real ou em memória

---

#### TS-01-5 · Criar service `AuthService` com método `register`
**Objetivo:** Implementar a lógica de negócio do cadastro de usuário.
**Critérios de Aceite:**
- Método `register({ email, password })` chama `hashPassword` e `UserRepository.create`
- Lança `ConflictException` se email já existir
- Lança `ValidationException` para email inválido ou senha fraca (< 8 chars)
- Coberto por testes unitários com mocks do repositório

---

#### TS-01-6 · Criar endpoint `POST /auth/register`
**Objetivo:** Expor a rota HTTP de cadastro conectada ao `AuthService`.
**Critérios de Aceite:**
- Aceita `{ email, password }` no body
- Retorna `201 Created` com `{ userId, email }` ao cadastrar com sucesso
- Retorna `409 Conflict` se email já existir
- Retorna `400 Bad Request` com lista de erros de validação para dados inválidos
- Rota documentada no Swagger/OpenAPI

---

#### TS-01-7 · Criar tela de Cadastro no app Expo
**Objetivo:** Desenvolver o componente de tela com os campos de email e senha.
**Critérios de Aceite:**
- Exibe campos `email` (teclado tipo email) e `senha` (campo seguro/oculto)
- Exibe botão "Cadastrar"
- Exibe link de navegação para tela de Login
- Layout responsivo e acessível

---

#### TS-01-8 · Implementar validação client-side no formulário de cadastro
**Objetivo:** Validar os campos de email e senha no frontend antes de chamar a API.
**Critérios de Aceite:**
- Email validado com regex de formato básico
- Senha validada com mínimo de 8 caracteres
- Mensagem de erro exibida abaixo do campo correspondente ao perder foco ou ao tentar submeter
- Formulário não dispara requisição enquanto houver erros de validação

---

#### TS-01-9 · Integrar tela de Cadastro com endpoint `POST /auth/register`
**Objetivo:** Conectar o formulário de cadastro à API e tratar os estados de resposta.
**Critérios de Aceite:**
- Botão "Cadastrar" exibe loading e fica desabilitado durante a requisição
- Ao receber `201`: exibe mensagem de sucesso e navega para Home ou Login
- Ao receber `409`: exibe mensagem de erro "Email já cadastrado" abaixo do campo de email
- Ao receber `400`: exibe mensagens de validação retornadas pela API

---

### US02 – Login

#### TS-02-1 · Criar endpoint `POST /auth/login`
**Objetivo:** Implementar a rota de autenticação que valida credenciais e retorna tokens JWT.
**Critérios de Aceite:**
- Aceita `{ email, password }`
- Valida credenciais via `comparePassword`
- Retorna `200 OK` com `{ accessToken, refreshToken }` ao autenticar com sucesso
- Retorna `401 Unauthorized` para credenciais inválidas (sem especificar qual campo está errado)
- `accessToken` expira em 1h; `refreshToken` expira em 7 dias

---

#### TS-02-2 · Implementar geração e validação de tokens JWT
**Objetivo:** Criar utilitário para assinar e verificar tokens JWT de acesso e refresh.
**Critérios de Aceite:**
- Função `signAccessToken({ userId })` retorna JWT assinado com expiração de 1h
- Função `signRefreshToken({ userId })` retorna JWT assinado com expiração de 7d
- Função `verifyToken(token)` retorna payload ou lança erro em token inválido/expirado
- Chaves/segredos carregados de variáveis de ambiente (não hardcoded)

---

#### TS-02-3 · Criar endpoint `POST /auth/refresh`
**Objetivo:** Renovar o access token a partir de um refresh token válido.
**Critérios de Aceite:**
- Aceita `{ refreshToken }` no body
- Retorna novo `{ accessToken }` se refresh token válido e não expirado
- Retorna `401` para refresh token inválido ou expirado

---

#### TS-02-4 · Implementar armazenamento seguro de token no app Expo
**Objetivo:** Salvar e recuperar tokens de autenticação usando armazenamento seguro do dispositivo.
**Critérios de Aceite:**
- Tokens salvos via `expo-secure-store` após login bem-sucedido
- Função `getAccessToken()` recupera token salvo
- Função `clearTokens()` remove ambos os tokens (usada no logout)
- Nenhum token armazenado em AsyncStorage ou variável global não persistida

---

#### TS-02-5 · Implementar interceptor de requisição com refresh automático
**Objetivo:** Renovar o access token silenciosamente ao receber 401, sem forçar novo login.
**Critérios de Aceite:**
- Interceptor detecta resposta `401` em qualquer requisição autenticada
- Tenta chamar `POST /auth/refresh` com o refresh token salvo
- Em caso de sucesso: repete a requisição original com novo token
- Em caso de falha no refresh: limpa tokens e redireciona para tela de Login
- Requisições concorrentes aguardam o refresh em fila (sem múltiplas chamadas de refresh simultâneas)

---

#### TS-02-6 · Criar tela de Login no app Expo
**Objetivo:** Desenvolver o componente de tela de login com campos e navegação.
**Critérios de Aceite:**
- Exibe campos `email` e `senha`
- Exibe botão "Entrar" e link "Criar conta" (navega para Cadastro)
- Layout responsivo e acessível

---

#### TS-02-7 · Integrar tela de Login com endpoint `POST /auth/login`
**Objetivo:** Conectar o formulário de login à API, salvar tokens e tratar erros.
**Critérios de Aceite:**
- Botão "Entrar" exibe loading e fica desabilitado durante requisição
- Ao receber `200`: salva tokens e redireciona para Home
- Ao receber `401`: exibe mensagem "Email ou senha incorretos"
- Formulário não submete com campos vazios

---

#### TS-02-8 · Implementar verificação de sessão ao abrir o app
**Objetivo:** Redirecionar o usuário para Home automaticamente se houver token válido salvo.
**Critérios de Aceite:**
- Ao iniciar o app, verifica existência de token em `expo-secure-store`
- Se token presente e válido (não expirado): navega diretamente para Home sem exibir Login
- Se token expirado: tenta refresh antes de decidir destino
- Se sem token ou refresh falho: navega para tela de Login

---

## Épico 2: Cursos e Trilhas

---

### US03 – Visualizar cursos

#### TS-03-1 · Criar migration da tabela `courses`
**Objetivo:** Criar a estrutura de dados para armazenar cursos.
**Critérios de Aceite:**
- Tabela `courses` com campos: `id`, `name`, `description`, `thumbnailUrl`, `createdAt`, `updatedAt`
- `name` com `NOT NULL`; `thumbnailUrl` nullable
- Migration reversível e versionada

---

#### TS-03-2 · Criar repositório `CourseRepository` com método `findAll`
**Objetivo:** Implementar acesso a dados para listagem de cursos com paginação.
**Critérios de Aceite:**
- Método `findAll({ limit, offset })` retorna array de cursos e total de registros
- Valores padrão: `limit = 20`, `offset = 0`
- Coberto por teste de integração

---

#### TS-03-3 · Criar endpoint `GET /courses`
**Objetivo:** Expor rota HTTP autenticada para listar cursos disponíveis.
**Critérios de Aceite:**
- Requer token JWT válido (middleware de autenticação aplicado)
- Aceita query params `limit` e `offset`
- Retorna `200 OK` com `{ data: Course[], total: number }`
- Rota documentada no Swagger

---

#### TS-03-4 · Criar tela de listagem de cursos no app Expo
**Objetivo:** Desenvolver a tela que busca e exibe os cursos disponíveis.
**Critérios de Aceite:**
- Chama `GET /courses` ao montar a tela
- Exibe skeleton/loading enquanto carrega
- Exibe lista de cursos com `name` e `description` (e thumbnail se disponível)
- Exibe mensagem de erro com botão "Tentar novamente" em caso de falha
- Tela acessível via tab de navegação principal

---

### US04 – Iniciar curso

#### TS-04-1 · Criar migration da tabela `user_courses`
**Objetivo:** Criar a estrutura que registra a matrícula de um usuário em um curso.
**Critérios de Aceite:**
- Tabela `user_courses` com: `id`, `userId`, `courseId`, `enrolledAt`
- Constraint de unicidade composta em `(userId, courseId)`
- Foreign keys para `users` e `courses`
- Migration reversível e versionada

---

#### TS-04-2 · Criar endpoint `POST /courses/:id/enroll`
**Objetivo:** Registrar matrícula do usuário no curso e desbloquear a primeira lição.
**Critérios de Aceite:**
- Requer autenticação JWT
- Cria registro em `user_courses` com `userId` extraído do token
- Define status `available` na primeira lição do curso para o usuário
- Retorna `201 Created` com dados da matrícula
- Retorna `409 Conflict` se usuário já matriculado
- Retorna `404 Not Found` se curso não existir

---

#### TS-04-3 · Criar tela de detalhe do curso no app Expo
**Objetivo:** Desenvolver tela com informações do curso e botão de ação para matrícula.
**Critérios de Aceite:**
- Exibe `name`, `description` e `thumbnailUrl` do curso
- Exibe botão "Iniciar curso" se usuário não matriculado
- Exibe botão "Continuar" se usuário já matriculado (verificado via `GET /courses` ou estado local)
- Loading state no botão durante chamada de matrícula
- Ao sucesso da matrícula, navega para tela de Trilha do curso

---

### US05 – Visualizar trilha

#### TS-05-1 · Criar migrations das tabelas `modules` e `lessons`
**Objetivo:** Criar as estruturas de módulos e lições vinculadas ao curso.
**Critérios de Aceite:**
- Tabela `modules`: `id`, `courseId`, `name`, `order`, `createdAt`
- Tabela `lessons`: `id`, `moduleId`, `title`, `content`, `order`, `createdAt`
- Foreign keys e índices de ordenação criados
- Migrations reversíveis e versionadas

---

#### TS-05-2 · Criar migration da tabela `user_lessons`
**Objetivo:** Criar estrutura que rastreia o status de cada lição por usuário.
**Critérios de Aceite:**
- Tabela `user_lessons`: `id`, `userId`, `lessonId`, `status` (enum: locked/available/completed), `startedAt`, `completedAt`
- Constraint única em `(userId, lessonId)`
- Foreign keys para `users` e `lessons`
- Migration reversível e versionada

---

#### TS-05-3 · Criar endpoint `GET /courses/:id/trail`
**Objetivo:** Retornar módulos e lições com status de desbloqueio para o usuário autenticado.
**Critérios de Aceite:**
- Requer autenticação e matrícula no curso (retorna `403` se não matriculado)
- Retorna módulos ordenados por `order`, com lições aninhadas ordenadas por `order`
- Cada lição inclui `status`: `locked` | `available` | `completed`
- Indica campo `isCurrent: true` na primeira lição com status `available`

---

#### TS-05-4 · Criar tela de Trilha no app Expo
**Objetivo:** Exibir visualmente módulos e lições com status de progresso.
**Critérios de Aceite:**
- Consome `GET /courses/:id/trail`
- Módulos exibidos como seções; lições como itens dentro de cada seção
- Lições com status `locked`: ícone de cadeado, opacidade reduzida, não clicáveis
- Lições com status `available`: destaque visual, clicáveis
- Lições com status `completed`: ícone de check
- Lição `isCurrent` com destaque adicional (badge ou borda)

---

### US06 – Desbloqueio progressivo

#### TS-06-1 · Implementar service de desbloqueio da próxima lição
**Objetivo:** Criar lógica que identifica e desbloqueia a próxima lição após conclusão da anterior.
**Critérios de Aceite:**
- Service consulta a lição seguinte (por `order` dentro do mesmo módulo, ou primeira do próximo módulo)
- Atualiza status de `locked` para `available` em `user_lessons`
- Operação atômica (usa transaction)
- Coberto por testes unitários

---

#### TS-06-2 · Aplicar guard de lição bloqueada no endpoint de início de lição
**Objetivo:** Impedir que o usuário inicie uma lição com status `locked`.
**Critérios de Aceite:**
- Middleware/guard verifica status da lição para o usuário antes de prosseguir
- Retorna `403 Forbidden` com mensagem clara se lição estiver bloqueada
- Aplicado nos endpoints `GET /lessons/:id` e `POST /lessons/:id/start`

---

#### TS-06-3 · Recarregar tela de Trilha após retorno de lição concluída
**Objetivo:** Atualizar o status das lições na tela de Trilha sem reiniciar o app.
**Critérios de Aceite:**
- Ao navegar de volta para a tela de Trilha após concluir uma lição, a lista é recarregada via API
- Lição recém-desbloqueada exibe status `available` sem necessidade de reload manual
- Implementado via `useFocusEffect` ou equivalente no Expo/React Navigation

---

## Épico 3: Lições e Exercícios

---

### US07 – Iniciar lição

#### TS-07-1 · Criar endpoint `GET /lessons/:id`
**Objetivo:** Retornar dados completos da lição, incluindo exercícios, para o usuário autenticado.
**Critérios de Aceite:**
- Requer autenticação
- Aplica guard de lição bloqueada (retorna `403` se status `locked`)
- Retorna `404` se lição não existir
- Resposta inclui: `id`, `title`, `instructions`, `exercises[]`

---

#### TS-07-2 · Criar endpoint `POST /lessons/:id/start`
**Objetivo:** Registrar o início da lição no histórico do usuário.
**Critérios de Aceite:**
- Cria ou atualiza registro em `user_lessons` com `startedAt = now()`
- Idempotente: chamadas repetidas não criam duplicatas
- Retorna `200 OK`

---

#### TS-07-3 · Criar tela de Lição no app Expo
**Objetivo:** Tela que carrega os dados da lição e orquestra a exibição de exercícios.
**Critérios de Aceite:**
- Chama `POST /lessons/:id/start` ao montar a tela
- Exibe instruções da lição antes do primeiro exercício
- Exibe barra de progresso (ex: "Exercício 1 de 8")
- Renderiza exercícios sequencialmente; ao avançar, exibe próximo exercício
- Loading state enquanto dados carregam

---

### US08 – Responder exercício

#### TS-08-1 · Criar migration da tabela `exercises`
**Objetivo:** Criar a estrutura de dados para exercícios e suas alternativas.
**Critérios de Aceite:**
- Tabela `exercises`: `id`, `lessonId`, `question`, `explanation`, `topic`, `order`
- Tabela `exercise_options`: `id`, `exerciseId`, `text`, `isCorrect`
- Foreign keys e índices criados
- Migrations reversíveis e versionadas

---

#### TS-08-2 · Criar migration da tabela `user_answers`
**Objetivo:** Criar estrutura para registrar as respostas do usuário por exercício.
**Critérios de Aceite:**
- Tabela `user_answers`: `id`, `userId`, `exerciseId`, `selectedOptionId`, `correct`, `answeredAt`
- Foreign keys para `users`, `exercises` e `exercise_options`
- Migration reversível e versionada

---

#### TS-08-3 · Criar endpoint `POST /exercises/:id/answer`
**Objetivo:** Receber a resposta do usuário, validar contra a opção correta e registrar.
**Critérios de Aceite:**
- Aceita `{ selectedOptionId }`
- Valida que `selectedOptionId` pertence ao exercício
- Compara com opção marcada como `isCorrect`
- Persiste em `user_answers` com `correct` calculado
- Retorna `{ correct: boolean, correctOptionId: string, explanation: string }`

---

#### TS-08-4 · Criar componente `ExerciseCard` de múltipla escolha no app Expo
**Objetivo:** Componente que exibe a pergunta e alternativas de um exercício.
**Critérios de Aceite:**
- Exibe `question` e lista de `options`
- Permite selecionar apenas uma opção por vez (estado local)
- Botão "Confirmar" habilitado somente após selecionar uma opção
- Botão desabilitado durante a requisição de resposta

---

### US09 – Feedback imediato

#### TS-09-1 · Implementar estado de feedback no componente `ExerciseCard`
**Objetivo:** Exibir resultado visual da resposta imediatamente após receber retorno da API.
**Critérios de Aceite:**
- Após receber resposta da API, component entra em modo `feedback`
- Opção selecionada corretamente: borda/fundo verde
- Opção selecionada incorretamente: borda/fundo vermelho; opção correta destacada em verde
- Texto `explanation` exibido abaixo das opções quando resposta incorreta
- Opções ficam desabilitadas no modo feedback (sem re-seleção)

---

#### TS-09-2 · Exibir botão "Avançar" após feedback e navegar para próximo exercício
**Objetivo:** Permitir que o usuário avance após visualizar o feedback.
**Critérios de Aceite:**
- Botão "Avançar" aparece somente após o estado de feedback ser exibido
- Ao clicar, limpa o estado de feedback e carrega o próximo exercício
- Se for o último exercício, aciona o fluxo de conclusão de lição

---

### US10 – Concluir lição

#### TS-10-1 · Criar endpoint `POST /lessons/:id/complete`
**Objetivo:** Registrar conclusão da lição, validar percentual mínimo e acionar desbloqueio.
**Critérios de Aceite:**
- Calcula percentual de acerto com base em `user_answers` da sessão atual
- Retorna `400` se percentual abaixo do mínimo configurado (ex: 70%)
- Atualiza `user_lessons` com `completedAt` e `score`
- Chama service de desbloqueio da próxima lição (TS-06-1)
- Chama service de atribuição de XP (referência ao Épico 4)
- Retorna `{ passed, score, xpEarned, nextLessonId }`

---

#### TS-10-2 · Criar tela de conclusão de lição no app Expo
**Objetivo:** Exibir resumo de desempenho ao término de uma lição.
**Critérios de Aceite:**
- Exibe acertos/total de exercícios e percentual
- Exibe XP ganho
- Se aprovado (`passed: true`): botão "Próxima lição" (navega para lição `nextLessonId`)
- Se reprovado (`passed: false`): botão "Tentar novamente" (reinicia lição atual)
- Animação de celebração (confetti ou similar) ao aprovar

---

## Épico 4: Gamificação

---

### US11 – Ganhar XP

#### TS-11-1 · Criar migration dos campos de XP em `user_profiles` e tabela `xp_history`
**Objetivo:** Criar as estruturas de dados para armazenar XP acumulado e histórico.
**Critérios de Aceite:**
- Tabela `user_profiles`: adiciona/garante campos `totalXp` (int, default 0) e `level` (int, default 1)
- Tabela `xp_history`: `id`, `userId`, `lessonId`, `xpEarned`, `earnedAt`
- Migrations reversíveis e versionadas

---

#### TS-11-2 · Criar service de cálculo e atribuição de XP
**Objetivo:** Implementar lógica que calcula o XP ganho com base no desempenho e o persiste.
**Critérios de Aceite:**
- XP base por lição configurável (ex: 10 XP base)
- Bônus proporcional ao score: 100% acerto = +50% XP; 70%-99% = XP base sem bônus
- Soma XP ao `totalXp` do usuário em `user_profiles`
- Registra entrada em `xp_history`
- Operação dentro de transaction (junto à conclusão da lição)
- Coberto por testes unitários

---

#### TS-11-3 · Exibir XP ganho na tela de conclusão de lição
**Objetivo:** Mostrar o XP obtido na sessão ao finalizar uma lição.
**Critérios de Aceite:**
- Valor de `xpEarned` retornado pelo endpoint é exibido na tela de conclusão
- Animação "+N XP" ao exibir o valor

---

#### TS-11-4 · Exibir XP total no perfil do usuário
**Objetivo:** Tornar o XP acumulado visível na tela de perfil.
**Critérios de Aceite:**
- Endpoint `GET /users/me` inclui `totalXp` e `level` no retorno
- Tela de perfil exibe `totalXp` com label "XP total"

---

### US12 – Sistema de níveis

#### TS-12-1 · Criar tabela/configuração de níveis e XP necessário
**Objetivo:** Definir a tabela de progressão de níveis com os thresholds de XP.
**Critérios de Aceite:**
- Tabela `levels` (ou configuração estática) com: `level`, `minXp`
- Exemplo: nível 1 = 0 XP, nível 2 = 100 XP, nível 3 = 250 XP, etc.
- Pelo menos 10 níveis definidos
- Estratégia de progressão documentada

---

#### TS-12-2 · Implementar lógica de atualização de nível no service de XP
**Objetivo:** Recalcular e atualizar o nível do usuário após cada ganho de XP.
**Critérios de Aceite:**
- Após atualizar `totalXp`, consulta tabela de níveis para determinar novo nível
- Atualiza campo `level` em `user_profiles` se nível mudou
- Retorna flag `leveledUp: boolean` para o chamador
- Coberto por testes unitários

---

#### TS-12-3 · Criar endpoint que retorna nível e progresso do usuário
**Objetivo:** Expor dados de nível para o frontend.
**Critérios de Aceite:**
- `GET /users/me` retorna: `level`, `totalXp`, `xpForNextLevel`, `xpProgress` (XP dentro do nível atual)
- Cálculo de `xpForNextLevel` baseado na tabela de níveis

---

#### TS-12-4 · Exibir nível e barra de progresso no app
**Objetivo:** Mostrar nível atual e XP necessário para o próximo nível.
**Critérios de Aceite:**
- Barra de progresso visual com `xpProgress / xpForNextLevel`
- Número do nível exibido
- Animação de "level up" exibida quando `leveledUp: true` após conclusão de lição

---

### US13 – Streak diário

#### TS-13-1 · Adicionar campos de streak em `user_profiles`
**Objetivo:** Criar os campos necessários para rastrear o streak diário.
**Critérios de Aceite:**
- Campos adicionados: `currentStreak` (int, default 0), `lastStudiedAt` (timestamp, nullable)
- Migration reversível e versionada

---

#### TS-13-2 · Criar service de atualização de streak
**Objetivo:** Implementar lógica de incremento, manutenção e reset do streak.
**Critérios de Aceite:**
- Compara `lastStudiedAt` com data atual (UTC) ao concluir lição
- Ontem: incrementa `currentStreak` e atualiza `lastStudiedAt`
- Hoje: mantém `currentStreak` sem alteração (sem duplicar)
- Mais de 1 dia: reseta `currentStreak` para 1 e atualiza `lastStudiedAt`
- Coberto por testes unitários com datas mockadas

---

#### TS-13-3 · Integrar service de streak à conclusão de lição
**Objetivo:** Chamar o service de streak automaticamente ao concluir uma lição.
**Critérios de Aceite:**
- `POST /lessons/:id/complete` chama service de streak após registrar conclusão
- Retorno inclui `currentStreak` atualizado
- Operação dentro da mesma transaction da conclusão

---

#### TS-13-4 · Exibir streak atual no app
**Objetivo:** Mostrar o streak de dias consecutivos de forma destacada.
**Critérios de Aceite:**
- Ícone de chama com número de dias exibido na Home e/ou Perfil
- Valor atualizado após conclusão de lição (sem necessidade de reload manual)
- Toast/banner ao manter ou quebrar streak

---

### US14 – Conquistas

#### TS-14-1 · Criar migration das tabelas `achievements` e `user_achievements`
**Objetivo:** Criar as estruturas de dados para conquistas e conquistas desbloqueadas por usuário.
**Critérios de Aceite:**
- Tabela `achievements`: `id`, `name`, `description`, `iconUrl`, `trigger`, `conditionValue`
- Tabela `user_achievements`: `id`, `userId`, `achievementId`, `unlockedAt`
- Constraint única em `(userId, achievementId)`
- Migrations reversíveis e versionadas

---

#### TS-14-2 · Criar seed de conquistas iniciais
**Objetivo:** Popular a tabela `achievements` com as conquistas disponíveis na plataforma.
**Critérios de Aceite:**
- Seed cria ao menos as conquistas: "Primeiro dia" (streak 1), "Semana perfeita" (streak 7), "Módulo concluído" (1 módulo), "Maratonista" (streak 30)
- Seed idempotente (não duplica ao rodar novamente)
- Commitado no repositório

---

#### TS-14-3 · Criar service de avaliação e concessão de conquistas
**Objetivo:** Avaliar conquistas elegíveis e conceder ao usuário após eventos relevantes.
**Critérios de Aceite:**
- Service recebe evento (`streak_updated`, `module_completed`) e `userId`
- Consulta conquistas com `trigger` correspondente e verifica `conditionValue`
- Insere em `user_achievements` apenas conquistas ainda não concedidas
- Retorna lista de conquistas recém-desbloqueadas
- Coberto por testes unitários

---

#### TS-14-4 · Criar endpoint `GET /users/me/achievements`
**Objetivo:** Retornar todas as conquistas com status de desbloqueio do usuário.
**Critérios de Aceite:**
- Requer autenticação
- Retorna todas as conquistas da tabela `achievements`
- Conquistas desbloqueadas incluem `unlockedAt`; demais têm `unlockedAt: null`

---

#### TS-14-5 · Criar tela de conquistas no app Expo
**Objetivo:** Exibir todas as conquistas disponíveis e o status de desbloqueio.
**Critérios de Aceite:**
- Lista todas as conquistas com `name`, `description` e `iconUrl`
- Desbloqueadas: ícone colorido e data de obtenção
- Bloqueadas: ícone em escala de cinza
- Toast exibido ao desbloquear nova conquista durante o uso do app

---

## Épico 5: Progresso

---

### US15 – Visualizar progresso

#### TS-15-1 · Criar endpoint `GET /users/me/progress`
**Objetivo:** Retornar progresso do usuário por curso e módulo.
**Critérios de Aceite:**
- Requer autenticação
- Retorna array de cursos matriculados
- Cada curso inclui: `name`, `completionPercent`, `modules[]`
- Cada módulo inclui: `name`, `completedLessons`, `totalLessons`, `completionPercent`
- Percentuais calculados em tempo real

---

#### TS-15-2 · Criar tela de progresso no app Expo
**Objetivo:** Exibir progresso geral por curso e módulo com barras visuais.
**Critérios de Aceite:**
- Lista cursos matriculados com barra de progresso e percentual
- Accordion/expansão por curso exibe módulos com suas barras
- Dados recarregados ao navegar para a tela (`useFocusEffect`)
- Loading state enquanto carrega

---

### US16 – Histórico de lições

#### TS-16-1 · Criar endpoint `GET /users/me/lesson-history`
**Objetivo:** Retornar histórico paginado de lições concluídas com desempenho.
**Critérios de Aceite:**
- Requer autenticação
- Retorna lições concluídas ordenadas por `completedAt` (desc)
- Cada item: `lessonTitle`, `moduleTitle`, `completedAt`, `score`, `correctAnswers`, `totalAnswers`
- Suporta paginação via `limit` e `offset`

---

#### TS-16-2 · Criar tela de histórico de lições no app Expo
**Objetivo:** Exibir lista de lições realizadas com indicadores de desempenho.
**Critérios de Aceite:**
- Lista lições com título, módulo, data e acertos/total
- Toque em item navega para tela de detalhe (ou expande inline)
- Tela de detalhe exibe cada exercício com resposta dada e se foi correta
- Paginação ou scroll infinito para histórico longo

---

## Épico 6: Revisão Inteligente

---

### US17 – Identificar erros recorrentes

#### TS-17-1 · Adicionar campo `topic` ao modelo de exercícios
**Objetivo:** Garantir que exercícios sejam categorizados por tema para agregação de erros.
**Critérios de Aceite:**
- Campo `topic` (string, NOT NULL) adicionado à tabela `exercises`
- Migration reversível e versionada
- Formulário de criação de exercício no admin atualizado para exigir campo `topic`

---

#### TS-17-2 · Criar query de agregação de taxa de erro por tema
**Objetivo:** Implementar a consulta que calcula taxa de erro por `topic` para um usuário.
**Critérios de Aceite:**
- Query agrupa `user_answers` por `exercises.topic`
- Calcula: `totalAttempts`, `totalErrors`, `errorRate` (totalErrors / totalAttempts)
- Ordenável por `errorRate` descendente
- Coberta por teste de integração

---

### US18 – Sugerir revisão

#### TS-18-1 · Criar endpoint `GET /users/me/review-suggestions`
**Objetivo:** Retornar lista de temas prioritários para revisão com base na taxa de erro.
**Critérios de Aceite:**
- Requer autenticação
- Usa query de TS-17-2 para calcular sugestões
- Retorna até 5 temas com: `topic`, `errorRate`, `totalAttempts`
- Exclui temas com menos de 3 tentativas (dados insuficientes)

---

#### TS-18-2 · Criar seção "Revisão sugerida" na Home ou tela de Progresso
**Objetivo:** Exibir proativamente os temas sugeridos para revisão.
**Critérios de Aceite:**
- Seção exibida quando há ao menos um tema com dados suficientes
- Lista top 3–5 temas com `errorRate` formatado (ex: "42% de erros")
- Botão de ação por tema ou botão geral direciona para tela de revisão
- Seção oculta quando retorno da API estiver vazio

---

### US19 – Exercícios de revisão

#### TS-19-1 · Criar endpoint `GET /users/me/review-exercises`
**Objetivo:** Retornar lista de exercícios personalizados priorizando maior taxa de erro.
**Critérios de Aceite:**
- Requer autenticação
- Aceita query param `limit` (padrão: 10)
- Retorna exercícios do usuário ordenados por `errorRate` descendente
- Inclui apenas exercícios com ao menos 1 erro anterior
- Exercícios com dados completos: `question`, `options`, `explanation`

---

#### TS-19-2 · Criar tela de sessão de revisão no app Expo
**Objetivo:** Implementar fluxo de revisão reutilizando componentes de lição.
**Critérios de Aceite:**
- Consome `GET /users/me/review-exercises`
- Usa o mesmo componente `ExerciseCard` e fluxo de feedback da lição normal
- Barra de progresso indica exercícios de revisão restantes
- Ao finalizar, exibe tela de resumo (acertos/total da sessão de revisão)
- Botão "Revisar novamente" recarrega novos exercícios de revisão

---

## Épico 7: Administração

---

### US20 – Criar curso (admin)

#### TS-20-1 · Criar endpoint `POST /admin/courses`
**Objetivo:** Rota administrativa para criação de novos cursos.
**Critérios de Aceite:**
- Aceita `{ name, description, thumbnailUrl }`
- Requer autenticação com role `admin` (middleware de autorização)
- Valida campos obrigatórios: `name` e `description`
- Persiste e retorna `201 Created` com dados do curso
- Retorna `400` com erros de validação para campos inválidos

---

#### TS-20-2 · Criar formulário de criação de curso no painel admin
**Objetivo:** Interface web/mobile administrativa para criar cursos.
**Critérios de Aceite:**
- Campos: nome (obrigatório), descrição (obrigatório), URL de thumbnail (opcional)
- Validação inline dos campos obrigatórios
- Botão "Criar" com loading state durante requisição
- Toast de sucesso e redirect para listagem após criação
- Toast de erro com mensagem da API em caso de falha

---

### US21 – Criar módulo (admin)

#### TS-21-1 · Criar endpoint `POST /admin/courses/:courseId/modules`
**Objetivo:** Rota administrativa para criação de módulos vinculados a um curso.
**Critérios de Aceite:**
- Aceita `{ name, order }`
- Requer role `admin`
- Valida existência do curso (retorna `404` se não encontrado)
- Valida campos obrigatórios `name` e `order`
- Retorna `201 Created` com dados do módulo

---

#### TS-21-2 · Criar formulário de criação de módulo no painel admin
**Objetivo:** Interface para adicionar módulos a um curso existente.
**Critérios de Aceite:**
- Acessível na tela de detalhe do curso no admin
- Campos: nome (obrigatório) e ordem numérica (obrigatório)
- Validação inline; loading state no botão
- Módulo aparece na listagem do curso imediatamente após criação (sem reload de página)

---

### US22 – Criar lição (admin)

#### TS-22-1 · Criar endpoint `POST /admin/modules/:moduleId/lessons`
**Objetivo:** Rota administrativa para criação de lições vinculadas a um módulo.
**Critérios de Aceite:**
- Aceita `{ title, content, order }`
- Requer role `admin`
- Valida existência do módulo (retorna `404` se não encontrado)
- Valida campos obrigatórios
- Respeita ordenação: `order` deve ser único dentro do módulo (retorna `409` em conflito)
- Retorna `201 Created` com dados da lição

---

#### TS-22-2 · Criar formulário de criação de lição no painel admin
**Objetivo:** Interface para adicionar lições a um módulo.
**Critérios de Aceite:**
- Acessível na tela de detalhe do módulo no admin
- Campos: título, conteúdo (editor markdown ou rich text), ordem
- Pré-visualização do conteúdo renderizado
- Lição aparece na listagem do módulo após criação

---

### US23 – Criar exercício (admin)

#### TS-23-1 · Criar endpoint `POST /admin/lessons/:lessonId/exercises`
**Objetivo:** Rota administrativa para criação de exercícios vinculados a uma lição.
**Critérios de Aceite:**
- Aceita `{ question, explanation, topic, options: [{ text, isCorrect }] }`
- Requer role `admin`
- Valida existência da lição (retorna `404` se não encontrada)
- Valida: mínimo 2 opções, exatamente 1 opção com `isCorrect: true`
- Retorna `201 Created` com exercício e opções criados
- Retorna `400` para violações de validação

---

#### TS-23-2 · Criar formulário de criação de exercício no painel admin
**Objetivo:** Interface para adicionar exercícios a uma lição com lista dinâmica de alternativas.
**Critérios de Aceite:**
- Campos: pergunta, explicação, tema (`topic`)
- Seção de alternativas com botão "Adicionar alternativa" (adiciona campos dinamicamente)
- Cada alternativa tem campo de texto e radio button para marcar como correta
- Botão de remoção em cada alternativa (mínimo de 2 mantido por validação)
- Validação: obriga ao menos 2 opções e exatamente 1 correta antes de submeter
- Exercício aparece na listagem da lição após criação

---

## Épico 8: Notificações

---

### US24 – Lembrete diário

#### TS-24-1 · Criar endpoint `POST /users/me/device-token`
**Objetivo:** Registrar o token de push notification do dispositivo do usuário.
**Critérios de Aceite:**
- Aceita `{ token, platform }` (`platform`: `ios` | `android`)
- Requer autenticação
- Salva ou atualiza registro em `user_devices` (`userId`, `token`, `platform`, `updatedAt`)
- Idempotente: atualiza token se dispositivo já registrado

---

#### TS-24-2 · Implementar solicitação de permissão e registro de token no app Expo
**Objetivo:** Solicitar permissão de notificação e enviar token ao backend.
**Critérios de Aceite:**
- Solicita permissão via `expo-notifications` na primeira abertura do app após login
- Se permissão concedida: obtém token via `getExpoPushTokenAsync` e chama `POST /users/me/device-token`
- Se permissão negada: não bloqueia o app; permite uso normal
- Token re-enviado ao backend se renovado pelo SO (listener de `tokenChange`)

---

#### TS-24-3 · Implementar job agendado de envio de push notification diária
**Objetivo:** Enviar lembrete diário de estudo para usuários com notificações ativas.
**Critérios de Aceite:**
- Job agendado (AWS EventBridge ou cron) executa diariamente
- Consulta usuários com `notificationsEnabled: true` e token de dispositivo registrado
- Envia notificação no horário `preferredTime` de cada usuário (ou horário padrão configurável)
- Usa AWS SNS ou FCM para envio
- Falhas individuais são logadas sem interromper envio para demais usuários

---

### US25 – Configurar notificações

#### TS-25-1 · Criar migration dos campos de notificação em `user_settings`
**Objetivo:** Criar estrutura para armazenar preferências de notificação do usuário.
**Critérios de Aceite:**
- Tabela `user_settings` criada (ou campos adicionados): `userId`, `notificationsEnabled` (bool, default true), `preferredTime` (string "HH:MM", default "08:00")
- Migration reversível e versionada

---

#### TS-25-2 · Criar endpoint `PUT /users/me/notification-settings`
**Objetivo:** Permitir atualização das preferências de notificação do usuário.
**Critérios de Aceite:**
- Aceita `{ notificationsEnabled: boolean, preferredTime: "HH:MM" }`
- Requer autenticação
- Valida formato de `preferredTime` (regex `^([01]\\d|2[0-3]):[0-5]\\d$`)
- Persiste em `user_settings` e retorna `200 OK` com configurações salvas

---

#### TS-25-3 · Criar endpoint `GET /users/me/notification-settings`
**Objetivo:** Retornar as preferências de notificação atuais do usuário.
**Critérios de Aceite:**
- Requer autenticação
- Retorna `{ notificationsEnabled, preferredTime }`
- Se usuário não tiver registro: retorna valores padrão (`true`, `"08:00"`)

---

#### TS-25-4 · Criar tela de configurações de notificação no app Expo
**Objetivo:** Interface para o usuário gerenciar suas preferências de notificação.
**Critérios de Aceite:**
- Carrega preferências atuais via `GET /users/me/notification-settings` ao abrir a tela
- Toggle "Ativar notificações" reflete e altera `notificationsEnabled`
- Seletor de horário visível apenas quando toggle está ativado
- Alterações salvas automaticamente ou via botão explícito com feedback de sucesso
- Loading state durante carregamento e salvamento

---
