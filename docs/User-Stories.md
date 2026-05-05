# 📘 User Stories – Plataforma tipo Duolingo (Expo + AWS)

---

## 🎯 Épico 1: Autenticação

### US01 – Cadastro de usuário
**User Story**  
Como usuário, quero criar uma conta para acessar a plataforma.

**Critérios de Aceitação**
- Dado que estou na tela de cadastro  
  Quando informo email e senha válidos  
  Então minha conta deve ser criada com sucesso  
- Dado que o email já existe  
  Quando tento cadastrar  
  Então devo receber mensagem de erro  

---

### US02 – Login
**User Story**  
Como usuário, quero fazer login para acessar meu progresso.

**Critérios de Aceitação**
- Dado que possuo conta válida  
  Quando informo credenciais corretas  
  Então devo acessar o sistema  
- Dado credenciais inválidas  
  Então devo ver mensagem de erro  

---

## 🎯 Épico 2: Cursos e Trilhas

### US03 – Visualizar cursos
**User Story**  
Como usuário, quero ver os cursos disponíveis para escolher o que estudar.

**Critérios de Aceitação**
- Deve exibir:
  - Expo  
  - AWS Nuvem  

---

### US04 – Iniciar curso
**User Story**  
Como usuário, quero iniciar um curso para começar meus estudos.

**Critérios de Aceitação**
- Ao iniciar:
  - Progresso deve ser criado  
  - Trilha deve ser liberada  

---

### US05 – Visualizar trilha
**User Story**  
Como usuário, quero visualizar a trilha de aprendizado para entender meu progresso.

**Critérios de Aceitação**
- Exibir módulos e lições  
- Mostrar bloqueios  
- Destacar progresso atual  

---

### US06 – Desbloqueio progressivo
**User Story**  
Como usuário, quero desbloquear conteúdos conforme avanço.

**Critérios de Aceitação**
- Lição só libera após anterior concluída  

---

## 🎯 Épico 3: Lições e Exercícios

### US07 – Iniciar lição
**User Story**  
Como usuário, quero iniciar uma lição para aprender um conteúdo.

**Critérios de Aceitação**
- Deve carregar exercícios da lição  
- Deve exibir instruções iniciais  

---

### US08 – Responder exercício
**User Story**  
Como usuário, quero responder exercícios para testar meu conhecimento.

**Critérios de Aceitação**
- Permitir seleção de resposta  
- Permitir avançar após resposta  

---

### US09 – Feedback imediato
**User Story**  
Como usuário, quero receber feedback imediato para aprender com erros.

**Critérios de Aceitação**
- Mostrar correto/incorreto  
- Mostrar explicação ao errar  

---

### US10 – Concluir lição
**User Story**  
Como usuário, quero concluir uma lição para avançar na trilha.

**Critérios de Aceitação**
- Deve validar mínimo de acerto  
- Deve registrar conclusão  
- Deve atualizar progresso  

---

## 🎯 Épico 4: Gamificação

### US11 – Ganhar XP
**User Story**  
Como usuário, quero ganhar experiência ao estudar para acompanhar minha evolução.

**Critérios de Aceitação**
- XP deve ser atribuído ao concluir lição  

---

### US12 – Sistema de níveis
**User Story**  
Como usuário, quero subir de nível conforme ganho XP.

**Critérios de Aceitação**
- Nível aumenta automaticamente  
- Exibir nível atual  

---

### US13 – Streak diário
**User Story**  
Como usuário, quero manter uma sequência diária de estudos.

**Critérios de Aceitação**
- Incrementar streak ao estudar no dia  
- Resetar se não estudar  

---

### US14 – Conquistas
**User Story**  
Como usuário, quero receber conquistas para me motivar.

**Critérios de Aceitação**
- Conceder medalhas por:
  - Dias consecutivos  
  - Conclusão de módulos  

---

## 🎯 Épico 5: Progresso

### US15 – Visualizar progresso
**User Story**  
Como usuário, quero ver meu progresso para acompanhar evolução.

**Critérios de Aceitação**
- Mostrar:
  - Progresso por curso  
  - Progresso por módulo  

---

### US16 – Histórico de lições
**User Story**  
Como usuário, quero ver lições concluídas.

**Critérios de Aceitação**
- Listar lições realizadas  
- Mostrar desempenho  

---

## 🎯 Épico 6: Revisão Inteligente

### US17 – Identificar erros
**User Story**  
Como sistema, quero identificar erros recorrentes para melhorar aprendizado.

**Critérios de Aceitação**
- Registrar erros por exercício  
- Calcular taxa de erro  

---

### US18 – Sugerir revisão
**User Story**  
Como usuário, quero receber sugestões de revisão para reforçar aprendizado.

**Critérios de Aceitação**
- Exibir lista de conteúdos frágeis  

---

### US19 – Exercícios de revisão
**User Story**  
Como usuário, quero refazer exercícios com base nos meus erros.

**Critérios de Aceitação**
- Gerar exercícios personalizados  

---

## 🎯 Épico 7: Administração

### US20 – Criar curso
**User Story**  
Como administrador, quero criar cursos para disponibilizar conteúdo.

**Critérios de Aceitação**
- Criar curso com nome e descrição  

---

### US21 – Criar módulo
**User Story**  
Como administrador, quero criar módulos dentro de um curso.

---

### US22 – Criar lição
**User Story**  
Como administrador, quero criar lições para estruturar conteúdo.

---

### US23 – Criar exercício
**User Story**  
Como administrador, quero criar exercícios para as lições.

---

## 🎯 Épico 8: Notificações

### US24 – Lembrete diário
**User Story**  
Como usuário, quero receber lembretes para não esquecer de estudar.

**Critérios de Aceitação**
- Enviar notificação diária  

---

### US25 – Configurar notificações
**User Story**  
Como usuário, quero controlar notificações.

---