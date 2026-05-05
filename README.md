# 🎓 Plataforma de Aprendizado Gamificado (Expo + AWS)

## 📌 Descrição

Este repositório contém o desenvolvimento de uma plataforma de aprendizado gamificado inspirada em aplicações como o Duolingo, com foco no ensino de tecnologias.

O projeto foi desenvolvido como trabalho acadêmico, com o objetivo de aplicar conceitos de engenharia de software, desenvolvimento mobile e computação em nuvem.

A plataforma propõe o ensino por meio de:

- Microlições
- Exercícios interativos
- Progressão estruturada
- Elementos de gamificação

---

## 🎯 Objetivos do Projeto

- Aplicar conceitos de desenvolvimento full stack
- Construir uma aplicação mobile com Expo (React Native)
- Integrar serviços em nuvem utilizando AWS
- Implementar mecânicas de gamificação
- Melhorar a retenção no aprendizado de tecnologia

---

## 🏫 Contexto Acadêmico

- Curso: (ex: Análise e Desenvolvimento de Sistemas)  
- Disciplina: (ex: Engenharia de Software / Desenvolvimento Mobile)  
- Instituição: (nome da faculdade)  
- Professor: (nome do professor)  

---

## 📚 Escopo do Sistema

A plataforma oferece dois cursos principais:

### 📱 Curso: Expo (React Native)

- Fundamentos
- Componentes
- Navegação
- APIs
- Armazenamento
- Build e Deploy

### ☁️ Curso: AWS Nuvem

- Conceitos de Cloud
- IAM
- S3
- EC2
- Lambda
- API Gateway
- DynamoDB

---

## 🧩 Funcionalidades

### 🔐 Autenticação

- Cadastro de usuário
- Login
- Recuperação de senha
- Edição de perfil

### 🛤️ Trilhas de Aprendizado

- Estrutura hierárquica: Curso → Módulo → Lição
- Progressão linear
- Bloqueio por pré-requisitos

### 📖 Lições

Cada lição contém:

- Conteúdo explicativo breve
- Exercícios interativos
- Feedback imediato

### 🏆 Gamificação

- Sistema de XP
- Níveis
- Streak diário
- Conquistas
- Ranking (opcional)

### 📊 Progresso

- Acompanhamento por curso
- Histórico de lições
- Taxa de acerto

### 🧠 Revisão Inteligente

- Identificação de erros recorrentes
- Sugestão de revisões
- Exercícios adaptativos

### 🛠️ Administração

- Gerenciamento de cursos, módulos, lições e exercícios (CRUD)
- Relatórios de uso

---

## 🔄 Fluxo do Usuário

1. Cadastro na plataforma  
2. Escolha de curso  
3. Execução de lições  
4. Realização de exercícios  
5. Recebimento de feedback  
6. Acúmulo de XP  
7. Progressão na trilha  
8. Revisão de conteúdos  

---

## 📏 Regras de Negócio

- Usuário pode cursar múltiplos cursos simultaneamente  
- Progresso é independente por curso  
- Lições exigem acerto mínimo para conclusão  
- Conteúdos são desbloqueados progressivamente  
- Sistema de streak depende de uso diário  
- Revisões são baseadas no desempenho do usuário  

---

## 🧪 MVP (Produto Mínimo Viável)

### Incluído

- Sistema de autenticação  
- Dois cursos (Expo e AWS)  
- Trilha básica  
- Exercícios de múltipla escolha  
- Sistema de XP  
- Streak básico  

### Não incluído (nesta fase)

- Ranking entre usuários  
- IA adaptativa avançada  
- Sistema completo de notificações  

---

## 🏗️ Arquitetura do Sistema

### Frontend

- Mobile: Expo (React Native)  
- Web (Admin): React / Next.js  

### Backend

- Java com Spring Boot  

### Infraestrutura

- AWS:
  - Lambda  
  - API Gateway  
  - DynamoDB  
  - S3  

### Autenticação

- JWT ou Cognito  

---

## 🗄️ Modelo de Dados (Resumo)

- Usuário  
- Curso  
- Módulo  
- Lição  
- Exercício  
- Progresso  

---

## 📈 Métricas Avaliadas

- Retenção de usuários  
- Número de lições concluídas  
- Tempo médio de uso  
- Taxa de acerto  
- Engajamento (streak)  

---

## ⚠️ Riscos Identificados

- Baixa retenção inicial  
- Volume insuficiente de conteúdo  
- Complexidade de implementação  
- Necessidade de manutenção contínua  

---

## 📌 Status do Projeto

🚧 Em desenvolvimento (MVP acadêmico)
