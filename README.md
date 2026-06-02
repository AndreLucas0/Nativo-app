# 🎓 Plataforma de Aprendizado Gamificado (Expo + AWS)

## 👥 Integrantes

- André Lucas Ferreira;
- Caique Tessaroto;
- Cauã Mesquita;
- João Machado;
- João Matias;
- Leonardo Rodrigues;
- Lucas Ianovski;
- Nickolas Machado.

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

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos

- [Java 21](https://adoptium.net/temurin/releases/?version=21) (JDK)
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`

---

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/Nativo-app.git
cd Nativo-app
```

---

### 2. Suba o banco de dados (PostgreSQL via Docker)

> Certifique-se de que o Docker Desktop está aberto e em execução.

```bash
docker-compose up -d
```

Verifique se o container subiu:

```bash
docker ps
```

Deve aparecer `nativo-postgres` com status `Up`.

---

### 3. Inicie a API (Spring Boot)

```bash
cd api
```

**Linux/macOS:**
```bash
./mvnw spring-boot:run
```

**Windows (PowerShell):**
```powershell
.\mvnw.cmd spring-boot:run
```

Aguarde até aparecer no log:
```
Tomcat started on port 8080 (http)
Started ApiApplication in X seconds
```

> A documentação interativa da API estará disponível em:  
> 📄 **http://localhost:8080/swagger-ui.html**

---

### 4. Configure o frontend

```bash
cd ../nativo
```

Crie o arquivo `.env` com a URL da API:

```bash
# Navegador web (padrão)
echo "EXPO_PUBLIC_API_URL=http://localhost:8080" > .env

# Emulador Android
echo "EXPO_PUBLIC_API_URL=http://10.0.2.2:8080" > .env

# Dispositivo físico iOS (substitua pelo seu IP local)
echo "EXPO_PUBLIC_API_URL=http://192.168.x.x:8080" > .env
```

Instale as dependências:

```bash
npm install
```

---

### 5. Inicie o frontend (Expo)

```bash
npx expo start
```

Escolha a plataforma desejada:

| Tecla | Ação |
|-------|------|
| `w` | Abre no navegador web |
| `a` | Abre no emulador Android |
| `i` | Abre no simulador iOS |
| QR Code | Escaneia com o app **Expo Go** no celular |

---

### Resumo dos serviços

| Serviço | Endereço |
|---------|----------|
| API (Spring Boot) | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Frontend Web | http://localhost:8081 |
| Banco de dados | localhost:5433 |

---

### 🔑 Primeiro acesso

1. Acesse o app no navegador ou celular
2. Clique em **Cadastrar** e crie uma conta
3. Faça login com o e-mail e senha cadastrados
4. Explore os cursos disponíveis

---

### 🐞 Problemas comuns

| Erro | Solução |
|------|---------|
| `JAVA_HOME not defined` | Instale o Java 21 e reinicie o terminal |
| `release version 21 not supported` | A versão do Java instalada é menor que 21 — atualize |
| `docker: cannot connect` | Abra o Docker Desktop e aguarde iniciar |
| `404 Not Found` nas chamadas da API | Verifique se a API está rodando e se a URL no `.env` está correta |
| `port 8080 already in use` | Outro processo está usando a porta — encerre-o ou mude a porta no `application.properties` |

---

## 📌 Status do Projeto

🚧 Em desenvolvimento (MVP acadêmico)