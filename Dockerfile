# Utilise une image de base avec OpenJDK 17 pour la phase de build
FROM openjdk:17-jdk-slim AS build

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers Maven wrapper et pom.xml
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
COPY pom.xml .

# Donne les permissions d'exécution au wrapper
RUN chmod +x ./mvnw

# Télécharge les dépendances (cette étape sera mise en cache si pom.xml ne change pas)
RUN ./mvnw dependency:go-offline -B

# Copie le code source
COPY src ./src

# Compile l'application et créé le JAR
RUN ./mvnw clean package -DskipTests

# Phase de runtime avec une image JRE plus légère
FROM openjdk:17-jre-slim

# Installe curl pour les health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Crée un utilisateur non-root pour la sécurité
RUN addgroup --system spring && adduser --system spring --ingroup spring

# Définit le répertoire de travail
WORKDIR /app

# Copie le JAR depuis la phase de build
COPY --from=build /app/target/jwt-auth-blog-*.jar app.jar

# Change le propriétaire du fichier
RUN chown spring:spring app.jar

# Utilise l'utilisateur non-root
USER spring:spring

# Expose le port (Render utilise la variable d'environnement PORT)
EXPOSE 8080

# Variables d'environnement par défaut
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# Commande pour démarrer l'application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
