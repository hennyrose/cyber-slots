# ----------------------------------------------------
# 1) Build Frontend with Vite
# ----------------------------------------------------
FROM node:18 AS build-frontend

WORKDIR /app

# Accept build-time argument for production API URL
ARG PROD_API_URL
ENV PROD_API_URL=$PROD_API_URL

# Copy package.json/yarn.lock or package-lock.json /pnpm-lock.yaml, etc.
COPY cyber-slots-frontend/package*.json ./
RUN npm install

# Copy and build the frontend
COPY cyber-slots-frontend/ ./
RUN npm run build

# ----------------------------------------------------
# 2) Build Backend with Maven
# ----------------------------------------------------
FROM maven:3.9.4-eclipse-temurin-21 AS build-backend

WORKDIR /app

# Copy Maven configuration
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the backend source code
COPY src ./src

# Copy the built frontend into Spring Boot's static folder
COPY --from=build-frontend /app/dist ./src/main/resources/static

# Build the JAR (skip tests if needed)
RUN mvn clean package -DskipTests

# ----------------------------------------------------
# 3) Final Runtime Image (Amazon Corretto)
# ----------------------------------------------------
FROM amazoncorretto:21-alpine

WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build-backend /app/target/*.jar app.jar

# Optional health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]