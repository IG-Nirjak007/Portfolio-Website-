# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the backend source code
COPY backend/pom.xml backend/
COPY backend/src backend/src/

# Build the Spring Boot application
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
