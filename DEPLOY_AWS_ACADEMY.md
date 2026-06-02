# Deploy — AWS Academy Learner Lab

## Arquitetura

```
Internet
   │
   ├── :8080 ──► EC2 t3.micro ──► nativo-api (Spring Boot)
   │                          └──► nativo-postgres (PostgreSQL 16, interno)
   │
Mobile (Expo Go) ──► EC2_IP:8080
Swagger UI       ──► http://EC2_IP:8080/swagger-ui.html
```

**Serviços AWS usados:** EC2 (t3.micro), Security Group  
**Por que não RDS/ECS:** Learner Lab tem créditos e permissões limitados. Docker Compose em uma única EC2 é reproduzível em minutos e não exige configuração de IAM avançada.

---

## Pré-requisitos

- Conta AWS Academy Learner Lab ativa (lab iniciado, status verde)
- Terminal com acesso SSH (`ssh` ou PuTTY no Windows)
- Chave `.pem` baixada do Learner Lab
- Git e Expo Go instalados no celular (para testar o app)

---

## Passo 1 — Criar a instância EC2

### 1.1 No Console AWS

1. Acesse **EC2 → Launch Instance**
2. Configurações:
   - **Name:** `nativo-app`
   - **AMI:** Amazon Linux 2023 (64-bit x86)
   - **Instance type:** `t3.micro` (ou `t2.micro` se não disponível)
   - **Key pair:** selecione o par de chaves do Learner Lab (ex: `vockey`)
   - **Storage:** 20 GiB gp3

### 1.2 Security Group (criar novo: `nativo-sg`)

| Tipo | Protocolo | Porta | Origem | Motivo |
|------|-----------|-------|--------|--------|
| SSH | TCP | 22 | Meu IP | Acesso administrativo |
| HTTP personalizado | TCP | 8080 | 0.0.0.0/0 | Backend API + Expo Go |

> **Não** exponha a porta 5432 (PostgreSQL) publicamente.

### 1.3 Anotar o IP público

Após a instância iniciar, anote o **Public IPv4 address** (ex: `54.123.45.67`).  
Esse IP muda se você parar e reiniciar a instância — use **Elastic IP** se precisar de IP fixo.

---

## Passo 2 — Conectar via SSH

```bash
chmod 400 ~/Downloads/vockey.pem
ssh -i ~/Downloads/vockey.pem ec2-user@SEU_IP_EC2
```

> No Windows com PuTTY, converta o `.pem` para `.ppk` com o PuTTYgen.

---

## Passo 3 — Instalar Docker na EC2

```bash
# Atualizar pacotes
sudo dnf update -y

# Instalar Docker
sudo dnf install -y docker git

# Iniciar e habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Adicionar usuário ao grupo docker (sem precisar de sudo)
sudo usermod -aG docker ec2-user

# Instalar Docker Compose plugin
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Aplicar grupo (necessário antes de usar docker sem sudo)
newgrp docker
```

Verificar instalação:
```bash
docker --version
docker compose version
```

---

## Passo 4 — Clonar o repositório

```bash
cd ~
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git nativo-app
cd nativo-app
```

> Substitua pela URL real do seu repositório Git.

---

## Passo 5 — Configurar variáveis de ambiente

```bash
# Copiar o template
cp .env.prod.example .env.prod

# Editar com os valores reais
nano .env.prod
```

Conteúdo do `.env.prod` (preencha todos os campos):

```env
POSTGRES_DB=nativo_prod
POSTGRES_USER=nativo
POSTGRES_PASSWORD=SenhaForteAqui123!

# Gere com: openssl rand -base64 48
JWT_SECRET=ColoqueSeuSecretJwtAquiComMinimoTrintaDoisCaracteres!!

# Substitua pelo IP público da sua EC2
ALLOWED_ORIGINS=http://54.123.45.67:3000,http://localhost:19006
```

Gerar um JWT_SECRET seguro:
```bash
openssl rand -base64 48
```

---

## Passo 6 — Build e start

```bash
# Dentro de ~/nativo-app
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

O primeiro build baixa as imagens base e compila o JAR Maven (~5-10 minutos).  
Builds subsequentes são muito mais rápidos graças ao cache de dependências.

Acompanhar os logs:
```bash
# Todos os containers
docker compose -f docker-compose.prod.yml logs -f

# Apenas a API
docker compose -f docker-compose.prod.yml logs -f api
```

---

## Passo 7 — Verificar o deploy

```bash
# Status dos containers
docker compose -f docker-compose.prod.yml ps

# Health check da API
curl http://localhost:8080/v3/api-docs | head -5
```

Saída esperada: JSON com informações do OpenAPI.

No browser do seu computador:
```
http://SEU_IP_EC2:8080/swagger-ui.html
```

---

## Passo 8 — Configurar o app mobile (Expo Go)

### 8.1 Criar o arquivo .env no projeto frontend

No seu computador local (dentro da pasta `nativo/`):
```bash
cd nativo
cp .env.example .env
```

Editar `nativo/.env`:
```env
EXPO_PUBLIC_API_URL=http://SEU_IP_EC2:8080
```

### 8.2 Iniciar o Expo

```bash
cd nativo
npx expo start
```

Escanear o QR Code com o Expo Go no celular.  
O app vai conectar automaticamente ao backend na EC2.

> **Atenção:** O celular e o computador precisam estar na mesma rede Wi-Fi **OU** o Expo Go precisa conseguir acessar o IP da EC2 via Internet (porta 8080 aberta no Security Group).

---

## Comandos de operação

### Parar os containers
```bash
docker compose -f docker-compose.prod.yml down
```

### Reiniciar sem rebuild
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Rebuildar após mudanças no código
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build api
```

### Ver logs em tempo real
```bash
docker compose -f docker-compose.prod.yml logs -f api
```

### Acessar o banco de dados
```bash
docker exec -it nativo-postgres-prod psql -U nativo -d nativo_prod
```

### Ver migrations aplicadas
```bash
docker exec -it nativo-postgres-prod psql -U nativo -d nativo_prod \
  -c "SELECT version, description, installed_on FROM flyway_schema_history ORDER BY installed_rank;"
```

---

## Redeploy do zero (quando o lab resetar)

O Learner Lab para todas as instâncias ao fim da sessão. Para recriar:

1. **Iniciar o lab** no AWS Academy
2. **Verificar se a EC2 está rodando** (pode precisar de Start Instance)
3. **Obter o novo IP público** (muda a cada restart se não tiver Elastic IP)
4. **SSH na instância** e navegar até `~/nativo-app`
5. **Atualizar `.env.prod`** com o novo IP em `ALLOWED_ORIGINS`
6. **Subir os containers:**
   ```bash
   cd ~/nativo-app
   docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
   ```

> Os dados do PostgreSQL persistem no Docker volume enquanto a instância existir.  
> Se a instância for **terminada** (deletada), os dados são perdidos — isso é esperado em ambiente acadêmico.

---

## URLs finais

| Recurso | URL |
|---------|-----|
| API REST | `http://SEU_IP_EC2:8080/api` |
| Swagger UI | `http://SEU_IP_EC2:8080/swagger-ui.html` |
| OpenAPI JSON | `http://SEU_IP_EC2:8080/v3/api-docs` |
| App mobile | Expo Go → QR Code do `npx expo start` |

---

## Checklist de validação pós-deploy

- [ ] `docker compose ps` → ambos containers com status `Up (healthy)`
- [ ] `curl http://SEU_IP:8080/v3/api-docs` → responde JSON
- [ ] Swagger UI abre no browser
- [ ] `POST /api/auth/register` cria um usuário (via Swagger)
- [ ] `POST /api/auth/login` retorna `accessToken`
- [ ] Migrations aplicadas: tabela `users` existe no banco
- [ ] App Expo Go conecta e exibe a tela de login
- [ ] Login funciona pelo app
- [ ] Dashboard carrega módulos e atividades

---

## Troubleshooting

### Container da API não sobe

```bash
docker compose -f docker-compose.prod.yml logs api
```

**Erro: `could not connect to server`**  
O banco ainda não está pronto. Aguarde o healthcheck do PostgreSQL passar (~30s).

**Erro: `JWT_SECRET must be at least 32 characters`**  
O secret no `.env.prod` é muito curto. Use `openssl rand -base64 48`.

**Erro: `relation "users" does not exist` com `ddl-auto=validate`**  
As migrations não rodaram. Verifique se o banco iniciou corretamente e se o usuário tem permissão.

### API responde mas app não conecta

- Verifique se a porta 8080 está liberada no Security Group
- Verifique se `EXPO_PUBLIC_API_URL` em `nativo/.env` tem o IP correto
- Teste: `curl http://SEU_IP_EC2:8080/v3/api-docs` do seu computador

### IP da EC2 mudou

1. Atualize `ALLOWED_ORIGINS` no `.env.prod`
2. Atualize `EXPO_PUBLIC_API_URL` no `nativo/.env`
3. Reinicie a API: `docker compose -f docker-compose.prod.yml --env-file .env.prod up -d api`
4. Reinicie o Expo: `npx expo start` (novo QR Code)

### Verificar uso de memória

```bash
docker stats --no-stream
```

Em t2.micro (1GB), esperado:
- `nativo-postgres-prod`: ~100-200MB
- `nativo-api-prod`: ~200-350MB

---

## Limitações do Learner Lab

| Limitação | Impacto | Alternativa |
|-----------|---------|-------------|
| IP muda ao reiniciar o lab | App precisa de novo `.env` | Elastic IP (mas custa créditos quando EC2 está parada) |
| Lab expira após ~4h de sessão | Instância para automaticamente | Reiniciar manualmente; dados persistem se não terminar |
| Sem domínio customizado | URL com IP numérico | Aceitável para validação acadêmica |
| Sem HTTPS nativo | Dados em HTTP | Aceitável em lab; em prod real usaria ACM + ALB |
| Créditos limitados | Monitorar uso | Parar a instância quando não usar |

---

## Estrutura de arquivos criados/modificados

```
Nativo-app/
├── api/
│   ├── Dockerfile                          ← NOVO: build multi-stage Java 21
│   └── src/main/resources/
│       ├── application.properties          ← MODIFICADO: allowed.origins
│       ├── application-prod.properties     ← MODIFICADO: porta 8080, pool size
│       └── META-INF/
│           └── additional-spring-configuration-metadata.json  ← NOVO
├── nativo/
│   ├── .env.example                        ← NOVO: template EXPO_PUBLIC_API_URL
│   └── services/api.ts                     ← MODIFICADO: EXPO_PUBLIC_API_URL
├── docker-compose.prod.yml                 ← NOVO: stack de produção
├── .env.prod.example                       ← NOVO: template de secrets
├── .gitignore                              ← MODIFICADO: .env.prod
└── DEPLOY_AWS_ACADEMY.md                   ← NOVO: este guia
```
