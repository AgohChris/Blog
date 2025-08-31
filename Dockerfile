# Utiliser une image OpenJDK légère
FROM openjdk:17-jdk-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le JAR dans le conteneur
COPY target/*.jar app.jar

# Exposer le port par défaut de Spring Boot
EXPOSE 8080

# Démarrer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]