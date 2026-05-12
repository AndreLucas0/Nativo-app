# PRD – Plataforma de Aprendizado Gamificado (Expo + AWS)

## 1. Visão do Produto

A plataforma tem como objetivo oferecer uma experiência de aprendizado gamificada, inspirada no Duolingo, focada no ensino de tecnologia por meio de trilhas curtas, progressivas e interativas.

O sistema permitirá que usuários aprendam dois cursos principais:

- Expo (React Native)
- AWS Nuvem

A experiência será baseada em:

- Microlições
- Exercícios interativos
- Progressão por níveis
- Recompensas e gamificação
- Revisão inteligente

---

## 2. Problema

O aprendizado de tecnologia apresenta desafios recorrentes:

- Alta evasão em cursos online
- Dificuldade em manter constância
- Excesso de conteúdo teórico
- Pouca prática guiada
- Falta de feedback imediato

---

## 3. Objetivo do Produto

Criar uma plataforma que:

- Aumente a retenção de alunos
- Incentive prática contínua
- Ofereça aprendizado progressivo
- Utilize gamificação para engajamento
- Permita aprendizado autônomo com baixo acompanhamento

---

## 4. Público-Alvo

- Estudantes de ADS / Engenharia
- Iniciantes em desenvolvimento mobile
- Iniciantes em cloud computing

---

## 5. Escopo do Produto

### Cursos Iniciais

### Curso 1: Expo

- Fundamentos
- Componentes
- Navegação
- APIs
- Armazenamento
- Build e deploy

### Curso 2: AWS Nuvem

- Conceitos de cloud
- IAM
- S3
- EC2
- Lambda
- API Gateway
- DynamoDB

---

## 6. Funcionalidades (Features)

### 6.1 Autenticação

- Cadastro e login
- Recuperação de senha
- Edição de perfil

### 6.2 Trilhas de Aprendizado

- Cursos → módulos → lições
- Progressão linear
- Bloqueio por pré-requisito

### 6.3 Lição

Cada lição contém:

- Explicação curta
- Exercícios interativos
- Feedback imediato

#### Tipos de Exercícios

- Múltipla escolha
- Verdadeiro/Falso
- Associação
- Completar código
- Ordenar passos

### 6.4 Gamificação

- XP (experiência)
- Níveis
- Ofensiva diária (streak)
- Conquistas
- Ranking opcional

### 6.5 Progresso

- Progresso por curso
- Progresso por módulo
- Histórico de lições
- Taxa de acerto

### 6.6 Revisão Inteligente

- Identificar erros recorrentes
- Sugerir revisão
- Gerar exercícios adaptativos

### 6.7 Administração

- CRUD de cursos
- CRUD de módulos
- CRUD de lições
- CRUD de exercícios
- Relatórios de uso

---

## 7. Jornada do Usuário (User Flow)

1. Usuário cria conta
2. Escolhe curso (Expo ou AWS)
3. Inicia primeira lição
4. Realiza exercícios
5. Recebe feedback
6. Ganha XP
7. Avança na trilha
8. Mantém streak diário
9. Recebe sugestões de revisão

---

## 8. Regras de Negócio

- Usuário pode fazer os dois cursos simultaneamente
- Progresso é independente por curso
- Lição só é concluída com mínimo de acerto
- Conteúdo é desbloqueado progressivamente
- Streak exige atividade diária
- Revisão é baseada em erros do usuário

---

## 9. Métricas de Sucesso (KPIs)

- Taxa de retenção (D1, D7, D30)
- Número médio de lições por usuário
- Taxa de conclusão de módulos
- Tempo médio de uso diário
- Taxa de acerto por exercício
- Manutenção de streak

---

## 10. MVP (Versão Inicial)

### Inclui

- Cadastro/login
- 2 cursos (Expo + AWS)
- Trilha simples
- Exercícios básicos (múltipla escolha)
- XP e progresso
- Streak simples
- Painel básico

### Não Inclui Inicialmente

- Ranking
- IA adaptativa avançada
- Notificações push avançadas

---

## 11. Arquitetura (Alto Nível)

### Frontend

- Expo (mobile)
- React / Next.js (admin)

### Backend

- Java (Spring Boot)

### Infraestrutura

#### Amazon Web Services (Opcional)

- Lambda
- API Gateway
- DynamoDB
- S3

### Autenticação

- JWT

---

## 12. Modelo de Dados (Simplificado)

### Usuário

- id
- nome
- email
- xp
- nível
- streak

### Curso

- id
- nome
- descrição

### Módulo

- id
- cursoId
- ordem

### Lição

- id
- moduloId
- ordem

### Exercício

- id
- liçãoId
- tipo
- pergunta
- respostas
- respostaCorreta

### Progresso

- userId
- cursoId
- módulo atual
- lição atual
- xp acumulado

---

## 13. Roadmap (Simplificado)

### Fase 1 – MVP

- Trilha básica
- Exercícios simples
- Progresso

### Fase 2

- Gamificação completa
- Revisão inteligente
- Dashboard avançado

### Fase 3

- Novos cursos
- IA adaptativa
- Multiplayer / Ranking

---

## 14. Riscos

- Baixa retenção inicial
- Conteúdo insuficiente
- Dificuldade de balancear gamificação
- Excesso de complexidade no backend
- Necessidade constante de atualização de conteúdo