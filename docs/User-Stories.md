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
- Dado que informo dados inválidos  
  Então o sistema deve impedir o cadastro e exibir mensagens de validação  

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
- Dado que estou autenticado  
  Então devo permanecer logado até logout ou expiração de sessão  

---

## 🎯 Épico 2: Cursos e Trilhas

### US03 – Visualizar cursos
**User Story**  
Como usuário, quero ver os cursos disponíveis para escolher o que estudar.

**Critérios de Aceitação**
- Deve exibir lista de cursos disponíveis  
- Cada curso deve conter nome e descrição  
- Exemplo de cursos:
  - Expo  
  - AWS Nuvem  

---

### US04 – Iniciar curso
**User Story**  
Como usuário, quero iniciar um curso para começar meus estudos.

**Critérios de Aceitação**
- Ao iniciar um curso:
  - Progresso deve ser criado  
  - Trilha deve ser liberada  
- O curso iniciado deve aparecer no progresso do usuário  

---

### US05 – Visualizar trilha
**User Story**  
Como usuário, quero visualizar a trilha de aprendizado para entender meu progresso.

**Critérios de Aceitação**
- Exibir módulos e lições  
- Mostrar lições bloqueadas e desbloqueadas  
- Destacar progresso atual  
- Indicar próxima lição disponível  

---

### US06 – Desbloqueio progressivo
**User Story**  
Como usuário, quero desbloquear conteúdos conforme avanço.

**Critérios de Aceitação**
- Uma lição só deve ser liberada após a conclusão da anterior  
- Conteúdos bloqueados devem ser visualmente identificados  
- O desbloqueio deve ocorrer automaticamente após conclusão  

---

## 🎯 Épico 3: Lições e Exercícios

### US07 – Iniciar lição
**User Story**  
Como usuário, quero iniciar uma lição para aprender um conteúdo.

**Critérios de Aceitação**
- Deve carregar exercícios da lição  
- Deve exibir instruções iniciais  
- Deve registrar início da lição  

---

### US08 – Responder exercício
**User Story**  
Como usuário, quero responder exercícios para testar meu conhecimento.

**Critérios de Aceitação**
- Permitir seleção de resposta  
- Permitir envio da resposta  
- Permitir avançar após resposta  
- Impedir avanço sem responder  

---

### US09 – Feedback imediato
**User Story**  
Como usuário, quero receber feedback imediato para aprender com erros.

**Critérios de Aceitação**
- Mostrar se a resposta está correta ou incorreta  
- Mostrar explicação ao errar  
- Destacar resposta correta  

---

### US10 – Concluir lição
**User Story**  
Como usuário, quero concluir uma lição para avançar na trilha.

**Critérios de Aceitação**
- Deve validar percentual mínimo de acerto  
- Deve registrar conclusão  
- Deve atualizar progresso  
- Deve liberar próxima lição  

---

## 🎯 Épico 4: Gamificação

### US11 – Ganhar XP
**User Story**  
Como usuário, quero ganhar experiência ao estudar para acompanhar minha evolução.

**Critérios de Aceitação**
- XP deve ser atribuído ao concluir lição  
- XP deve variar conforme desempenho  
- XP acumulado deve ser armazenado  

---

### US12 – Sistema de níveis
**User Story**  
Como usuário, quero subir de nível conforme ganho XP.

**Critérios de Aceitação**
- Nível deve aumentar automaticamente ao atingir XP necessário  
- Exibir nível atual  
- Exibir progresso até próximo nível  

---

### US13 – Streak diário
**User Story**  
Como usuário, quero manter uma sequência diária de estudos.

**Critérios de Aceitação**
- Incrementar streak ao estudar no dia  
- Resetar streak se não estudar  
- Exibir streak atual  

---

### US14 – Conquistas
**User Story**  
Como usuário, quero receber conquistas para me motivar.

**Critérios de Aceitação**
- Conceder medalhas por:
  - Dias consecutivos  
  - Conclusão de módulos  
- Exibir conquistas obtidas  
- Notificar ao desbloquear conquista  

---

## 🎯 Épico 5: Progresso

### US15 – Visualizar progresso
**User Story**  
Como usuário, quero ver meu progresso para acompanhar evolução.

**Critérios de Aceitação**
- Mostrar:
  - Progresso por curso  
  - Progresso por módulo  
- Exibir percentual de conclusão  
- Atualizar em tempo real  

---

### US16 – Histórico de lições
**User Story**  
Como usuário, quero ver lições concluídas.

**Critérios de Aceitação**
- Listar lições realizadas  
- Mostrar desempenho (acertos/erros)  
- Permitir acesso ao histórico detalhado  

---

## 🎯 Épico 6: Revisão Inteligente

### US17 – Identificar erros
**User Story**  
Como sistema, quero identificar erros recorrentes para melhorar aprendizado.

**Critérios de Aceitação**
- Registrar erros por exercício  
- Calcular taxa de erro por tema  
- Armazenar histórico de erros  

---

### US18 – Sugerir revisão
**User Story**  
Como usuário, quero receber sugestões de revisão para reforçar aprendizado.

**Critérios de Aceitação**
- Exibir lista de conteúdos com maior taxa de erro  
- Priorizar conteúdos mais críticos  
- Atualizar sugestões dinamicamente  

---

### US19 – Exercícios de revisão
**User Story**  
Como usuário, quero refazer exercícios com base nos meus erros.

**Critérios de Aceitação**
- Gerar exercícios personalizados  
- Priorizar questões erradas anteriormente  
- Permitir repetir revisões  

---

## 🎯 Épico 7: Administração

### US20 – Criar curso
**User Story**  
Como administrador, quero criar cursos para disponibilizar conteúdo.

**Critérios de Aceitação**
- Criar curso com nome e descrição  
- Validar campos obrigatórios  
- Persistir curso na base de dados  

---

### US21 – Criar módulo
**User Story**  
Como administrador, quero criar módulos dentro de um curso para organizar o conteúdo.

**Critérios de Aceitação**
- Dado que um curso existe  
  Quando crio um módulo  
  Então ele deve ser vinculado ao curso  
- Deve permitir definir nome e ordem do módulo  
- Deve validar campos obrigatórios  

---

### US22 – Criar lição
**User Story**  
Como administrador, quero criar lições para estruturar o conteúdo de aprendizado.

**Critérios de Aceitação**
- Dado que um módulo existe  
  Quando crio uma lição  
  Então ela deve ser vinculada ao módulo  
- Deve permitir definir título e conteúdo da lição  
- Deve respeitar ordenação dentro do módulo  

---

### US23 – Criar exercício
**User Story**  
Como administrador, quero criar exercícios para as lições.

**Critérios de Aceitação**
- Dado que uma lição existe  
  Quando crio um exercício  
  Então ele deve ser vinculado à lição  
- Deve permitir cadastrar:
  - Pergunta  
  - Alternativas  
  - Resposta correta  
- Deve validar consistência dos dados  

---

## 🎯 Épico 8: Notificações

### US24 – Lembrete diário
**User Story**  
Como usuário, quero receber lembretes para não esquecer de estudar.

**Critérios de Aceitação**
- Enviar notificação diária  
- Permitir configuração de horário  
- Não enviar se desativado  

---

### US25 – Configurar notificações
**User Story**  
Como usuário, quero controlar notificações para personalizar minha experiência.

**Critérios de Aceitação**
- Permitir ativar/desativar notificações  
- Permitir configurar horário de envio  
- Persistir preferências do usuário  
- Aplicar configurações imediatamente  

---