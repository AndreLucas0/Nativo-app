# 📦 Tasks Ultra-Granulares – Plataforma tipo Duolingo

---

## 🎯 US01 – Cadastro de usuário

### TS-01-01
**Objetivo:** Criar rota HTTP POST /users  
**Critérios de Aceite:**
- Dado uma requisição POST  
  Quando acessar /users  
  Então a rota deve responder  

---

### TS-01-02
**Objetivo:** Criar DTO de entrada (email, senha)  
**Critérios de Aceite:**
- Deve existir estrutura tipada  
- Deve mapear dados da requisição  

---

### TS-01-03
**Objetivo:** Validar formato de email  
**Critérios de Aceite:**
- Dado email inválido  
  Então deve retornar erro  

---

### TS-01-04
**Objetivo:** Validar tamanho mínimo da senha  
**Critérios de Aceite:**
- Dado senha curta  
  Então deve retornar erro  

---

### TS-01-05
**Objetivo:** Criar função de hash de senha  
**Critérios de Aceite:**
- Senha não pode ser salva em texto puro  

---

### TS-01-06
**Objetivo:** Criar repository de usuário  
**Critérios de Aceite:**
- Deve existir método save()  

---

### TS-01-07
**Objetivo:** Verificar existência de email no banco  
**Critérios de Aceite:**
- Dado email duplicado  
  Então deve retornar erro  

---

### TS-01-08
**Objetivo:** Persistir usuário no banco  
**Critérios de Aceite:**
- Usuário deve ser salvo corretamente  

---

### TS-01-09
**Objetivo:** Retornar resposta HTTP adequada  
**Critérios de Aceite:**
- Deve retornar 201 em sucesso  

---

### TS-01-10
**Objetivo:** Criar componente de input de email (UI)  
**Critérios de Aceite:**
- Deve permitir digitação  

---

### TS-01-11
**Objetivo:** Criar componente de input de senha  
**Critérios de Aceite:**
- Deve ocultar caracteres  

---

### TS-01-12
**Objetivo:** Criar botão de submit  
**Critérios de Aceite:**
- Deve disparar ação  

---

### TS-01-13
**Objetivo:** Criar estado local do formulário  
**Critérios de Aceite:**
- Deve armazenar email e senha  

---

### TS-01-14
**Objetivo:** Implementar chamada HTTP no frontend  
**Critérios de Aceite:**
- Deve enviar dados para API  

---

### TS-01-15
**Objetivo:** Tratar erro da API no frontend  
**Critérios de Aceite:**
- Deve exibir mensagem de erro  

---

### TS-01-16
**Objetivo:** Tratar sucesso no frontend  
**Critérios de Aceite:**
- Deve exibir confirmação  

---

## 🎯 US02 – Login

### TS-02-01
**Objetivo:** Criar rota POST /auth/login  
**Critérios de Aceite:**
- Deve aceitar requisição  

---

### TS-02-02
**Objetivo:** Criar DTO de login  
**Critérios de Aceite:**
- Deve conter email e senha  

---

### TS-02-03
**Objetivo:** Buscar usuário por email  
**Critérios de Aceite:**
- Deve retornar usuário existente  

---

### TS-02-04
**Objetivo:** Comparar senha com hash  
**Critérios de Aceite:**
- Deve validar corretamente  

---

### TS-02-05
**Objetivo:** Gerar token JWT  
**Critérios de Aceite:**
- Deve conter ID do usuário  

---

### TS-02-06
**Objetivo:** Definir tempo de expiração do token  
**Critérios de Aceite:**
- Token deve expirar  

---

### TS-02-07
**Objetivo:** Retornar token na resposta  
**Critérios de Aceite:**
- Deve retornar JSON com token  

---

### TS-02-08
**Objetivo:** Criar input de email (UI login)  
**Critérios de Aceite:**
- Deve aceitar entrada  

---

### TS-02-09
**Objetivo:** Criar input de senha (UI login)  
**Critérios de Aceite:**
- Deve ocultar valor  

---

### TS-02-10
**Objetivo:** Criar botão de login  
**Critérios de Aceite:**
- Deve disparar requisição  

---

### TS-02-11
**Objetivo:** Armazenar token no app  
**Critérios de Aceite:**
- Deve persistir sessão  

---

### TS-02-12
**Objetivo:** Implementar logout (remoção de token)  
**Critérios de Aceite:**
- Token deve ser removido  

---

## 🎯 US03 – Visualizar cursos

### TS-03-01
**Objetivo:** Criar tabela/coleção de cursos  
**Critérios de Aceite:**
- Deve conter id, nome, descrição  

---

### TS-03-02
**Objetivo:** Criar método findAll()  
**Critérios de Aceite:**
- Deve retornar lista de cursos  

---

### TS-03-03
**Objetivo:** Criar endpoint GET /courses  
**Critérios de Aceite:**
- Deve retornar lista  

---

### TS-03-04
**Objetivo:** Criar serviço de cursos  
**Critérios de Aceite:**
- Deve encapsular regra de negócio  

---

### TS-03-05
**Objetivo:** Criar componente de lista (UI)  
**Critérios de Aceite:**
- Deve renderizar lista  

---

### TS-03-06
**Objetivo:** Criar item de curso (card)  
**Critérios de Aceite:**
- Deve exibir nome e descrição  

---

### TS-03-07
**Objetivo:** Implementar chamada GET no frontend  
**Critérios de Aceite:**
- Deve consumir API  

---

### TS-03-08
**Objetivo:** Implementar loading state  
**Critérios de Aceite:**
- Deve exibir carregamento  

---

### TS-03-09
**Objetivo:** Implementar estado de erro  
**Critérios de Aceite:**
- Deve exibir falha na requisição  

---