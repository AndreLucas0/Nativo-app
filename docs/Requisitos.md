# Requisitos – Plataforma tipo Duolingo (Expo + AWS)

## 1. Requisitos Funcionais

| ID   | Título                    | Tipo | Categoria      | Descrição                                      | Prioridade |
|------|--------------------------|------|---------------|-----------------------------------------------|-----------|
| RF01 | Cadastro de usuário      | RF   | Autenticação  | Permitir cadastro com email e senha           | Alta      |
| RF02 | Login                    | RF   | Autenticação  | Permitir login do usuário                     | Alta      |
| RF03 | Recuperação de senha     | RF   | Autenticação  | Permitir redefinir senha                      | Média     |
| RF04 | Edição de perfil         | RF   | Usuário       | Permitir editar nome e foto                   | Média     |
| RF05 | Listar cursos            | RF   | Curso         | Exibir cursos Expo e AWS                      | Alta      |
| RF06 | Iniciar curso            | RF   | Curso         | Usuário pode iniciar um curso                 | Alta      |
| RF07 | Progresso por curso      | RF   | Curso         | Manter progresso separado por curso           | Alta      |
| RF08 | Exibir trilha            | RF   | Curso         | Mostrar trilha visual de módulos              | Alta      |
| RF09 | Bloqueio por pré-requisito | RF | Curso         | Bloquear conteúdos não liberados              | Alta      |
| RF10 | Estrutura curso          | RF   | Conteúdo      | Curso → Módulo → Lição                        | Alta      |
| RF11 | Executar lição           | RF   | Lição         | Permitir iniciar uma lição                    | Alta      |
| RF12 | Feedback imediato        | RF   | Lição         | Mostrar se resposta está correta              | Alta      |
| RF13 | Tipos de exercício       | RF   | Lição         | Suportar múltipla escolha, V/F, etc           | Alta      |
| RF14 | Repetir lição            | RF   | Lição         | Permitir refazer lições                       | Média     |
| RF15 | XP por lição             | RF   | Gamificação   | Conceder experiência ao concluir lição        | Alta      |
| RF16 | Nível do usuário         | RF   | Gamificação   | Exibir nível baseado em XP                    | Média     |
| RF17 | Streak diário            | RF   | Gamificação   | Controlar dias consecutivos de estudo         | Alta      |
| RF18 | Conquistas               | RF   | Gamificação   | Conceder medalhas por progresso               | Média     |
| RF19 | Ranking                  | RF   | Gamificação   | Ranking entre usuários (opcional)             | Baixa     |
| RF20 | Painel de progresso      | RF   | Analytics     | Mostrar evolução do usuário                   | Alta      |
| RF21 | Taxa de acerto           | RF   | Analytics     | Mostrar desempenho por lição                  | Média     |
| RF22 | Revisão inteligente      | RF   | Revisão       | Sugerir revisão com base em erros             | Alta      |
| RF23 | Exercícios de revisão    | RF   | Revisão       | Gerar exercícios personalizados               | Média     |
| RF24 | CRUD de cursos           | RF   | Admin         | Criar, editar e excluir cursos                | Alta      |
| RF25 | CRUD de módulos          | RF   | Admin         | Gerenciar módulos                             | Alta      |
| RF26 | CRUD de lições           | RF   | Admin         | Gerenciar lições                              | Alta      |
| RF27 | CRUD de exercícios       | RF   | Admin         | Gerenciar exercícios                          | Alta      |
| RF28 | Relatórios               | RF   | Admin         | Visualizar métricas de uso                    | Média     |
| RF29 | Notificações             | RF   | Engajamento   | Enviar lembretes de estudo                    | Média     |
| RF30 | Configurar notificações  | RF   | Engajamento   | Usuário define preferências                   | Baixa     |

---

## 2. Requisitos Não Funcionais

| ID    | Título          | Tipo | Categoria     | Descrição                               | Prioridade |
|-------|----------------|------|--------------|----------------------------------------|-----------|
| RNF01 | Performance     | RNF  | Sistema      | Resposta rápida nas operações          | Alta      |
| RNF02 | Responsividade  | RNF  | UI           | Funcionar em mobile e web              | Alta      |
| RNF03 | Segurança       | RNF  | Segurança    | Proteger dados do usuário              | Alta      |
| RNF04 | Escalabilidade  | RNF  | Infra        | Suportar crescimento de usuários       | Alta      |
| RNF05 | Disponibilidade | RNF  | Infra        | Sistema disponível continuamente       | Alta      |
| RNF06 | Modularidade    | RNF  | Arquitetura  | Permitir novos cursos facilmente       | Alta      |
| RNF07 | Acessibilidade  | RNF  | UI           | Interface acessível                    | Média     |
| RNF08 | Manutenibilidade| RNF  | Sistema      | Fácil evolução do sistema              | Alta      |

---

## 3. Regras de Negócio

| ID   | Título                  | Tipo | Categoria    | Descrição                                      | Prioridade |
|------|------------------------|------|-------------|-----------------------------------------------|-----------|
| RN01 | Cursos simultâneos     | RN   | Curso       | Usuário pode fazer Expo e AWS                 | Alta      |
| RN02 | Progresso independente | RN   | Curso       | Cada curso possui progresso próprio           | Alta      |
| RN03 | Conclusão de lição     | RN   | Lição       | Exige acerto mínimo                           | Alta      |
| RN04 | Desbloqueio progressivo| RN   | Curso       | Conteúdo liberado em sequência                | Alta      |
| RN05 | Regra de streak        | RN   | Gamificação | Deve estudar diariamente                      | Alta      |
| RN06 | Cálculo de XP          | RN   | Gamificação | Baseado em acertos e conclusão               | Média     |
| RN07 | Revisão baseada em erro| RN   | Revisão     | Sistema prioriza dificuldades                 | Alta      |
| RN08 | Ranking opcional       | RN   | Gamificação | Usuário pode optar por participar             | Baixa     |
| RN09 | Evolução de conteúdo   | RN   | Admin       | Alterações não devem apagar progresso         | Alta      |