# ── Etapa 1: Build ────────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache de dependências separado do código-fonte
COPY pom.xml .
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn package -DskipTests -q

# ── Etapa 2: Runtime ──────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN addgroup -S nativo && adduser -S nativo -G nativo
RUN mkdir -p /var/log/nativo && chown nativo:nativo /var/log/nativo

COPY --from=builder /build/target/*.jar app.jar
RUN chown nativo:nativo app.jar

USER nativo
EXPOSE 8080

ENTRYPOINT ["java", \
  "-Dspring.profiles.active=prod", \
  "-Xms128m", "-Xmx384m", \
  "-jar", "app.jar"]
