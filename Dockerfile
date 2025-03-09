# ------------------------------------------
# 1) Сборка фронтенда (Vite + React)
# ------------------------------------------
FROM node:18 AS build-frontend
WORKDIR /app

# Укажите здесь точную папку, где лежит package.json фронтенда:
COPY cyber-slots-frontend/package*.json ./
RUN npm install

COPY cyber-slots-frontend/ ./
RUN npm run build

# ------------------------------------------
# 2) Сборка бэкенда (Maven + Java)
# ------------------------------------------
FROM maven:3.9.4-eclipse-temurin-21 AS build-backend
WORKDIR /app

# Копируем pom.xml и прочие файлы для сборки приложения
COPY pom.xml .
# Опционально, если у вас есть какие-то дополнительные .xml, settings.xml и т.п.

# Скачаем зависимости (кэшируем их в Docker):
RUN mvn dependency:go-offline

# Теперь копируем весь исходный код бэкенда:
COPY src ./src

# Копируем собранный фронтенд в папку static:
COPY --from=build-frontend /app/dist ./src/main/resources/static

# Собираем jar с пропуском тестов:
RUN mvn clean package -DskipTests

# ------------------------------------------
# 3) Финальный образ (Amazon Correto)
# ------------------------------------------
FROM amazoncorretto:21-alpine
WORKDIR /app
COPY --from=build-backend /app/target/*.jar app.jar

# Add health check
# In your final stage, after COPY command:
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
