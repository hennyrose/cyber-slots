# ------------------------------------------
# 1) Frontend Build Stage
# ------------------------------------------
FROM node:18 AS build-frontend
WORKDIR /app

# Copy frontend package files
COPY package*.json ./
RUN npm install

# Copy frontend source
COPY . ./
RUN npm run build

# ------------------------------------------
# 2) Backend Build Stage
# ------------------------------------------
FROM maven:3.9.4-eclipse-temurin-21 AS build-backend
WORKDIR /app

# Copy backend files
COPY . .
# Copy frontend build to static resources
COPY --from=build-frontend /app/dist ./src/main/resources/static

# Build the application
RUN mvn clean package -DskipTests

# ------------------------------------------
# 3) Final Stage
# ------------------------------------------
FROM amazoncorretto:21-alpine
WORKDIR /app

# Copy the built JAR
COPY --from=build-backend /app/target/*.jar app.jar

# Set environment variables
ENV PORT=8080
EXPOSE ${PORT}

# Run the application
CMD ["java", "-jar", "app.jar"]