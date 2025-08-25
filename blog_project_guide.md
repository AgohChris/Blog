# Guide Complet : Projet Blog avec Spring Boot + JWT + React

## 🎯 Vue d'Ensemble du Projet

Nous allons créer un blog complet avec :
- **Backend** : Spring Boot REST API + JWT Authentication
- **Frontend** : React/Vite.js (Hostinger Horizons)
- **Base de données** : PostgreSQL
- **Sécurité** : Spring Security + JWT

### 📋 Fonctionnalités

1. **👥 Authentification**
   - Inscription/Connexion avec JWT
   - Rôles : USER et ADMIN

2. **📝 Articles**
   - Créer, lire, modifier, supprimer
   - Un utilisateur peut seulement gérer ses propres articles
   - Un admin peut tout gérer

3. **💬 Commentaires**
   - Ajouter des commentaires sur les articles
   - Modifier/supprimer seulement ses propres commentaires

---

## 📂 Structure du Projet

```
src/main/java/com/example/blogapp/
├── BlogAppApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── OpenApiConfig.java
├── controller/
│   ├── AuthController.java
│   ├── ArticleController.java
│   ├── CommentController.java
│   └── UserController.java
├── dto/
│   ├── auth/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   └── JwtResponse.java
│   ├── article/
│   │   ├── ArticleRequest.java
│   │   ├── ArticleResponse.java
│   │   └── ArticleUpdateRequest.java
│   └── comment/
│       ├── CommentRequest.java
│       └── CommentResponse.java
├── entity/
│   ├── User.java
│   ├── Role.java
│   ├── Article.java
│   └── Comment.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   └── CustomExceptions.java
├── filter/
│   └── JwtAuthenticationFilter.java
├── repository/
│   ├── UserRepository.java
│   ├── RoleRepository.java
│   ├── ArticleRepository.java
│   └── CommentRepository.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── JwtService.java
│   ├── CustomUserDetailsService.java
│   ├── ArticleService.java
│   └── CommentService.java
└── util/
    └── SecurityUtils.java
```

---

## 🚀 Étape 1 : Configuration du Projet

### pom.xml (Dépendances)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
   <modelVersion>4.0.0</modelVersion>

   <parent>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-parent</artifactId>
      <version>3.2.0</version>
      <relativePath/>
   </parent>

   <groupId>com.example</groupId>
   <artifactId>blog-app</artifactId>
   <version>0.0.1-SNAPSHOT</version>
   <name>blog-app</name>
   <description>Blog application with Spring Boot and JWT</description>

   <properties>
      <java.version>17</java.version>
   </properties>

   <dependencies>
      <!-- Spring Boot Starters -->
      <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-web</artifactId>
      </dependency>

      <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-security</artifactId>
      </dependency>

      <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-data-jpa</artifactId>
      </dependency>

      <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-validation</artifactId>
      </dependency>

      <!-- PostgreSQL -->
      <dependency>
         <groupId>org.postgresql</groupId>
         <artifactId>postgresql</artifactId>
         <scope>runtime</scope>
      </dependency>

      <!-- JWT -->
      <dependency>
         <groupId>io.jsonwebtoken</groupId>
         <artifactId>jjwt-api</artifactId>
         <version>0.12.3</version>
      </dependency>

      <dependency>
         <groupId>io.jsonwebtoken</groupId>
         <artifactId>jjwt-impl</artifactId>
         <version>0.12.3</version>
         <scope>runtime</scope>
      </dependency>

      <dependency>
         <groupId>io.jsonwebtoken</groupId>
         <artifactId>jjwt-jackson</artifactId>
         <version>0.12.3</version>
         <scope>runtime</scope>
      </dependency>

      <!-- Documentation API -->
      <dependency>
         <groupId>org.springdoc</groupId>
         <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
         <version>2.2.0</version>
      </dependency>

      <!-- Tests -->
      <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-test</artifactId>
         <scope>test</scope>
      </dependency>

      <dependency>
         <groupId>org.springframework.security</groupId>
         <artifactId>spring-security-test</artifactId>
         <scope>test</scope>
      </dependency>

      <!-- H2 pour les tests -->
      <dependency>
         <groupId>com.h2database</groupId>
         <artifactId>h2</artifactId>
         <scope>test</scope>
      </dependency>
   </dependencies>

   <build>
      <plugins>
         <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
         </plugin>
      </plugins>
   </build>
</project>
```

## 🐳 Configuration PostgreSQL avec Docker

### Étape 1 : Lancer PostgreSQL avec Docker

#### Option A : Commande Docker simple (recommandée pour débuter)

```bash
# Lancer PostgreSQL en arrière-plan
docker run --name postgres-blog \
  -e POSTGRES_DB=blog_db \
  -e POSTGRES_USER=bloguser \
  -e POSTGRES_PASSWORD=blogpassword \
  -p 5432:5432 \
  -d postgres:15

# Vérifier que le conteneur fonctionne
docker ps
```

#### Option B : Docker Compose (recommandée pour la production)

Créez un fichier `docker-compose.yml` à la racine de votre projet :

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: postgres-blog
    environment:
      POSTGRES_DB: blog_db
      POSTGRES_USER: bloguser
      POSTGRES_PASSWORD: blogpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

volumes:
  postgres_data:
```

Puis lancez avec :

```bash
# Démarrer PostgreSQL
docker-compose up -d

# Voir les logs
docker-compose logs -f postgres

# Arrêter
docker-compose down
```

### Étape 2 : Configuration application.properties

```properties
# Configuration du serveur
server.port=8080
server.servlet.context-path=/api

# Configuration PostgreSQL avec Docker
spring.datasource.url=jdbc:postgresql://localhost:5432/blog_db
spring.datasource.username=bloguser
spring.datasource.password=blogpassword
spring.datasource.driver-class-name=org.postgresql.Driver

# Configuration JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.database=postgresql

# Pool de connexions (optimisation)
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5

# Configuration JWT
app.jwt.secret=mySecretKey123456789012345678901234567890
app.jwt.expiration=86400000
app.jwt.refresh-expiration=2592000000

# Configuration CORS
app.cors.allowed-origins=http://localhost:3000,http://localhost:4200
app.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
app.cors.allowed-headers=*
app.cors.allow-credentials=true

# Logging
logging.level.com.example.blogapp=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.web=DEBUG
```

### Étape 3 : Script d'initialisation (Optionnel)

Créez un fichier `init.sql` à la racine du projet :

```sql
-- Ce script s'exécute automatiquement au premier démarrage
-- Création de la base si elle n'existe pas (déjà fait par POSTGRES_DB)

-- Vous pouvez ajouter des données de test ici
-- INSERT INTO roles (name, description) VALUES ('USER', 'Utilisateur standard');
-- INSERT INTO roles (name, description) VALUES ('ADMIN', 'Administrateur');

-- Affichage de confirmation
SELECT 'Base de données blog_db initialisée avec succès!' as message;
```

### 🛠️ Commandes Docker Utiles

#### Gestion du conteneur PostgreSQL

```bash
# Démarrer le conteneur
docker start postgres-blog

# Arrêter le conteneur
docker stop postgres-blog

# Redémarrer le conteneur
docker restart postgres-blog

# Supprimer le conteneur (ATTENTION : perte des données)
docker rm postgres-blog

# Voir les logs en temps réel
docker logs -f postgres-blog
```

#### Se connecter à PostgreSQL

```bash
# Option 1 : Depuis le conteneur
docker exec -it postgres-blog psql -U bloguser -d blog_db

# Option 2 : Depuis votre machine (si psql installé)
psql -h localhost -p 5432 -U bloguser -d blog_db
```

#### Commandes SQL utiles une fois connecté

```sql
-- Lister les bases de données
\l

-- Se connecter à blog_db
\c blog_db

-- Lister les tables
\dt

-- Voir la structure d'une table
\d users

-- Quitter
\q
```

### 🔧 Troubleshooting Common Issues

#### Problème 1 : Port 5432 déjà utilisé

```bash
# Voir qui utilise le port 5432
sudo lsof -i :5432

# Ou utiliser un autre port
docker run --name postgres-blog \
  -e POSTGRES_DB=blog_db \
  -e POSTGRES_USER=bloguser \
  -e POSTGRES_PASSWORD=blogpassword \
  -p 5433:5432 \
  -d postgres:15

# Adapter l'URL dans application.properties
# spring.datasource.url=jdbc:postgresql://localhost:5433/blog_db
```

#### Problème 2 : Connexion refusée

```bash
# Vérifier que le conteneur est démarré
docker ps

# Vérifier les logs
docker logs postgres-blog

# Redémarrer si nécessaire
docker restart postgres-blog
```

#### Problème 3 : Perte de données au redémarrage

Utilisez des volumes Docker :

```bash
# Créer un volume persistant
docker volume create postgres-blog-data

# Lancer avec le volume
docker run --name postgres-blog \
  -e POSTGRES_DB=blog_db \
  -e POSTGRES_USER=bloguser \
  -e POSTGRES_PASSWORD=blogpassword \
  -p 5432:5432 \
  -v postgres-blog-data:/var/lib/postgresql/data \
  -d postgres:15
```

### 📝 Configuration pour différents environnements

#### application-dev.properties (Développement)

```properties
# Développement avec Docker local
spring.datasource.url=jdbc:postgresql://localhost:5432/blog_db
spring.datasource.username=bloguser
spring.datasource.password=blogpassword

# Plus de logs pour le debug
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
logging.level.org.springframework.security=DEBUG
```

#### application-prod.properties (Production)

```properties
# Production (variables d'environnement)
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}

# Moins de logs en production
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false
logging.level.org.springframework.security=WARN
```

---

## 🗃️ Étape 2 : Création des Entités

### Entity User (Base d'authentification)

```java
package com.example.blogapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
public class User implements UserDetails {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @NotBlank
   @Size(max = 50)
   private String username;

   @NotBlank
   @Size(max = 100)
   @Email
   private String email;

   @NotBlank
   @Size(max = 255)
   private String password;

   @Size(max = 100)
   private String firstName;

   @Size(max = 100)
   private String lastName;

   private boolean enabled = true;
   private boolean accountNonExpired = true;
   private boolean accountNonLocked = true;
   private boolean credentialsNonExpired = true;

   @Column(name = "created_at")
   private LocalDateTime createdAt;

   @Column(name = "updated_at")
   private LocalDateTime updatedAt;

   @ManyToMany(fetch = FetchType.EAGER)
   @JoinTable(
           name = "user_roles",
           joinColumns = @JoinColumn(name = "user_id"),
           inverseJoinColumns = @JoinColumn(name = "role_id")
   )
   private Set<Role> roles = new HashSet<>();

   // Relations avec les articles et commentaires
   @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
   private List<Article> articles = new ArrayList<>();

   @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
   private List<Comment> comments = new ArrayList<>();

   // Constructeurs
   public User() {}

   public User(String username, String email, String password) {
      this.username = username;
      this.email = email;
      this.password = password;
      this.createdAt = LocalDateTime.now();
      this.updatedAt = LocalDateTime.now();
   }

   // Méthodes UserDetails
   @Override
   public Collection<? extends GrantedAuthority> getAuthorities() {
      return roles.stream()
              .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
              .collect(Collectors.toList());
   }

   @Override
   public String getPassword() { return password; }

   @Override
   public String getUsername() { return username; }

   @Override
   public boolean isAccountNonExpired() { return accountNonExpired; }

   @Override
   public boolean isAccountNonLocked() { return accountNonLocked; }

   @Override
   public boolean isCredentialsNonExpired() { return credentialsNonExpired; }

   @Override
   public boolean isEnabled() { return enabled; }

   @PrePersist
   public void prePersist() {
      this.createdAt = LocalDateTime.now();
      this.updatedAt = LocalDateTime.now();
   }

   @PreUpdate
   public void preUpdate() {
      this.updatedAt = LocalDateTime.now();
   }

   // Getters et Setters (générer avec votre IDE)
   public Long getId() { return id; }
   public void setId(Long id) { this.id = id; }

   public void setUsername(String username) { this.username = username; }

   public String getEmail() { return email; }
   public void setEmail(String email) { this.email = email; }

   public void setPassword(String password) { this.password = password; }

   public String getFirstName() { return firstName; }
   public void setFirstName(String firstName) { this.firstName = firstName; }

   public String getLastName() { return lastName; }
   public void setLastName(String lastName) { this.lastName = lastName; }

   public LocalDateTime getCreatedAt() { return createdAt; }
   public LocalDateTime getUpdatedAt() { return updatedAt; }

   public Set<Role> getRoles() { return roles; }
   public void setRoles(Set<Role> roles) { this.roles = roles; }

   public List<Article> getArticles() { return articles; }
   public void setArticles(List<Article> articles) { this.articles = articles; }

   public List<Comment> getComments() { return comments; }
   public void setComments(List<Comment> comments) { this.comments = comments; }
}
```

### Entity Role

```java
package com.example.blogapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "roles")
public class Role {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @NotBlank
   @Size(max = 50)
   @Column(unique = true)
   private String name;

   @Size(max = 255)
   private String description;

   // Constructeurs
   public Role() {}

   public Role(String name) {
      this.name = name;
   }

   public Role(String name, String description) {
      this.name = name;
      this.description = description;
   }

   // Getters et Setters
   public Long getId() { return id; }
   public void setId(Long id) { this.id = id; }

   public String getName() { return name; }
   public void setName(String name) { this.name = name; }

   public String getDescription() { return description; }
   public void setDescription(String description) { this.description = description; }
}
```

### Entity Article (Cœur du blog)

```java
package com.example.blogapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "articles")
public class Article {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @NotBlank
   @Size(max = 255)
   private String title;

   @NotBlank
   @Size(max = 500)
   private String summary; // Résumé/description courte

   @NotBlank
   @Lob // Large Object pour le contenu complet
   private String content;

   @Size(max = 255)
   private String imageUrl; // URL de l'image de couverture

   private boolean published = false; // Brouillon ou publié

   @Column(name = "created_at")
   private LocalDateTime createdAt;

   @Column(name = "updated_at")
   private LocalDateTime updatedAt;

   @Column(name = "published_at")
   private LocalDateTime publishedAt;

   // Relation avec l'auteur
   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "author_id", nullable = false)
   private User author;

   // Relation avec les commentaires
   @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
   private List<Comment> comments = new ArrayList<>();

   // Tags/catégories (optionnel)
   @ElementCollection
   @CollectionTable(name = "article_tags", joinColumns = @JoinColumn(name = "article_id"))
   @Column(name = "tag")
   private List<String> tags = new ArrayList<>();

   // Constructeurs
   public Article() {}

   public Article(String title, String summary, String content, User author) {
      this.title = title;
      this.summary = summary;
      this.content = content;
      this.author = author;
      this.createdAt = LocalDateTime.now();
      this.updatedAt = LocalDateTime.now();
   }

   @PrePersist
   public void prePersist() {
      this.createdAt = LocalDateTime.now();
      this.updatedAt = LocalDateTime.now();
   }

   @PreUpdate
   public void preUpdate() {
      this.updatedAt = LocalDateTime.now();
      if (this.published && this.publishedAt == null) {
         this.publishedAt = LocalDateTime.now();
      }
   }

   // Méthode utilitaire pour publier
   public void publish() {
      this.published = true;
      this.publishedAt = LocalDateTime.now();
   }

   // Getters et Setters
   public Long getId() { return id; }
   public void setId(Long id) { this.id = id; }

   public String getTitle() { return title; }
   public void setTitle(String title) { this.title = title; }

   public String getSummary() { return summary; }
   public void setSummary(String summary) { this.summary = summary; }

   public String getContent() { return content; }
   public void setContent(String content) { this.content = content; }

   public String getImageUrl() { return imageUrl; }
   public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

   public boolean isPublished() { return published; }
   public void setPublished(boolean published) { this.published = published; }

   public LocalDateTime getCreatedAt() { return createdAt; }
   public LocalDateTime getUpdatedAt() { return updatedAt; }
   public LocalDateTime getPublishedAt() { return publishedAt; }

   public User getAuthor() { return author; }
   public void setAuthor(User author) { this.author = author; }

   public List<Comment> getComments() { return comments; }
   public void setComments(List<Comment> comments) { this.comments = comments; }

   public List<String> getTags() { return tags; }
   public void setTags(List<String> tags) { this.tags = tags; }
}
```

### Entity Comment (Système de commentaires)

```java
package com.example.blogapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @NotBlank
   @Size(max = 1000)
   private String content;

   @Column(name = "created_at")
   private LocalDateTime createdAt;

   @Column(name = "updated_at")
   private LocalDateTime updatedAt;

   // Relation avec l'auteur du commentaire
   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "author_id", nullable = false)
   private User author;

   // Relation avec l'article commenté
   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "article_id", nullable = false)
   private Article article;

   // Commentaire parent (pour les réponses - optionnel)
   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "parent_id")
   private Comment parent;

   // Constructeurs
   public Comment() {}

   public Comment(String content, User author, Article article) {
      this.content = content;
      this.author = author;
      this.article = article;
      this.createdAt = LocalDateTime.now();
      this.updatedAt = LocalDateTime.now();
   }

   @PrePersist
   public void prePersist() {
      this.createdAt = LocalDateTime.now();
      this.updatedAt = LocalDateTime.now();
   }

   @PreUpdate
   public void preUpdate() {
      this.updatedAt = LocalDateTime.now();
   }

   // Getters et Setters
   public Long getId() { return id; }
   public void setId(Long id) { this.id = id; }

   public String getContent() { return content; }
   public void setContent(String content) { this.content = content; }

   public LocalDateTime getCreatedAt() { return createdAt; }
   public LocalDateTime getUpdatedAt() { return updatedAt; }

   public User getAuthor() { return author; }
   public void setAuthor(User author) { this.author = author; }

   public Article getArticle() { return article; }
   public void setArticle(Article article) { this.article = article; }

   public Comment getParent() { return parent; }
   public void setParent(Comment parent) { this.parent = parent; }
}
```

---

## 📊 Étape 3 : Repositories (Accès aux données)

### UserRepository

```java
package com.example.blogapp.repository;

import com.example.blogapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

   Optional<User> findByUsername(String username);

   Optional<User> findByEmail(String email);

   Boolean existsByUsername(String username);

   Boolean existsByEmail(String email);

   @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.username = :username")
   Optional<User> findByUsernameWithRoles(@Param("username") String username);

   @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.email = :email")
   Optional<User> findByEmailWithRoles(@Param("email") String email);
}
```

### RoleRepository

```java
package com.example.blogapp.repository;

import com.example.blogapp.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

   Optional<Role> findByName(String name);

   Boolean existsByName(String name);
}
```

### ArticleRepository

```java
package com.example.blogapp.repository;

import com.example.blogapp.entity.Article;
import com.example.blogapp.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

   // Trouver tous les articles publiés
   Page<Article> findByPublishedTrueOrderByPublishedAtDesc(Pageable pageable);

   // Trouver les articles d'un auteur
   Page<Article> findByAuthorOrderByCreatedAtDesc(User author, Pageable pageable);

   // Trouver les articles publiés d'un auteur
   Page<Article> findByAuthorAndPublishedTrueOrderByPublishedAtDesc(User author, Pageable pageable);

   // Rechercher dans les titres et contenus
   @Query("SELECT a FROM Article a WHERE a.published = true AND " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.summary) LIKE LOWER(CONCAT('%', :keyword, '%')))")
   Page<Article> findByKeywordInTitleOrSummary(@Param("keyword") String keyword, Pageable pageable);

   // Compter les articles publiés d'un auteur
   long countByAuthorAndPublishedTrue(User author);

   // Trouver les articles les plus récents
   List<Article> findTop5ByPublishedTrueOrderByPublishedAtDesc();

   // Vérifier si un article appartient à un utilisateur
   boolean existsByIdAndAuthor(Long id, User author);
}
```

### CommentRepository

```java
package com.example.blogapp.repository;

import com.example.blogapp.entity.Article;
import com.example.blogapp.entity.Comment;
import com.example.blogapp.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

   // Trouver les commentaires d'un article
   Page<Comment> findByArticleOrderByCreatedAtAsc(Article article, Pageable pageable);

   // Trouver les commentaires d'un utilisateur
   Page<Comment> findByAuthorOrderByCreatedAtDesc(User author, Pageable pageable);

   // Compter les commentaires d'un article
   long countByArticle(Article article);

   // Trouver les commentaires racines (sans parent) d'un article
   List<Comment> findByArticleAndParentIsNullOrderByCreatedAtAsc(Article article);

   // Trouver les réponses à un commentaire
   List<Comment> findByParentOrderByCreatedAtAsc(Comment parent);

   // Vérifier si un commentaire appartient à un utilisateur
   boolean existsByIdAndAuthor(Long id, User author);

   // Commentaires récents
   @Query("SELECT c FROM Comment c ORDER BY c.createdAt DESC")
   List<Comment> findRecentComments(Pageable pageable);
}
```

---

## 🛠️ Étape 4 : DTOs (Data Transfer Objects)

### DTOs pour Articles

#### ArticleRequest

```java
package com.example.blogapp.dto.article;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public class ArticleRequest {

   @NotBlank(message = "Le titre est requis")
   @Size(max = 255, message = "Le titre ne peut pas dépasser 255 caractères")
   private String title;

   @NotBlank(message = "Le résumé est requis")
   @Size(max = 500, message = "Le résumé ne peut pas dépasser 500 caractères")
   private String summary;

   @NotBlank(message = "Le contenu est requis")
   private String content;

   @Size(max = 255, message = "L'URL de l'image ne peut pas dépasser 255 caractères")
   private String imageUrl;

   private boolean published = false;

   private List<String> tags;

   // Constructeurs
   public ArticleRequest() {}

   // Getters et Setters
   public String getTitle() { return title; }
   public void setTitle(String title) { this.title = title; }

   public String getSummary() { return summary; }
   public void setSummary(String summary) { this.summary = summary; }

   public String getContent() { return content; }
   public void setContent(String content) { this.content = content; }

   public String getImageUrl() { return imageUrl; }
   public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

   public boolean isPublished() { return published; }
   public void setPublished(boolean published) { this.published = published; }

   public List<String> getTags() { return tags; }
   public void setTags(List<String> tags) { this.tags = tags; }
}
```

#### ArticleResponse

```java
package com.example.blogapp.dto.article;

import java.time.LocalDateTime;
import java.util.List;

public class ArticleResponse {

   private Long id;
   private String title;
   private String summary;
   private String content;
   private String imageUrl;
   private boolean published;
   private LocalDateTime createdAt;
   private LocalDateTime updatedAt;
   private LocalDateTime publishedAt;
   private List<String> tags;

   // Informations sur l'auteur
   private Long authorId;
   private String authorUsername;
   private String authorFirstName;
   private String authorLastName;

   // Statistiques
   private long commentsCount;

   // Constructeurs
   public ArticleResponse() {}

   // Getters et Setters
   public Long getId() { return id; }
   public void setId(Long id) { this.id = id; }

   public String getTitle() { return title; }
   public void setTitle(String title) { this.title = title; }

   public String getSummary() { return summary; }
   public void setSummary(String summary) { this.summary = summary; }

   public String getContent() { return content; }
   public void setContent(String content) { this.content = content; }

   public String getImageUrl() { return imageUrl; }
   public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

   public boolean isPublished() { return published; }
   public void setPublished(boolean published) { this.published = published; }

   public LocalDateTime getCreatedAt() { return createdAt; }
   public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

   public LocalDateTime getUpdatedAt() { return updatedAt; }
   public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

   public LocalDateTime getPublishedAt() { return publishedAt; }
   public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

   public List<String> getTags() { return tags; }
   public void setTags(List<String> tags) { this.tags = tags; }

   public Long getAuthorId() { return authorId; }
   public void setAuthorId(Long authorId) { this.authorId = authorId; }

   public String getAuthorUsername() { return authorUsername; }
   public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }

   public String getAuthorFirstName() { return authorFirstName; }
   public void setAuthorFirstName(String authorFirstName) { this.authorFirstName = authorFirstName; }

   public String getAuthorLastName() { return authorLastName; }
   public void setAuthorLastName(String authorLastName) { this.authorLastName = authorLastName; }

   public long getCommentsCount() { return commentsCount; }
   public void setCommentsCount(long commentsCount) { this.commentsCount = commentsCount; }
}
```

### DTOs pour Commentaires

#### CommentRequest

```java
package com.example.blogapp.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CommentRequest {

   @NotBlank(message = "Le contenu du commentaire est requis")
   @Size(max = 1000, message = "Le commentaire ne peut pas dépasser 1000 caractères")
   private String content;

   @NotNull(message = "L'ID de l'article est requis")
   private Long articleId;

   private Long parentId; // Pour les réponses aux commentaires

   // Constructeurs
   public CommentRequest() {}

   // Getters et Setters
   public String getContent() { return content; }
   public void setContent(String content) { this.content = content; }

   public Long getArticleId() { return articleId; }
   public void setArticleId(Long articleId) { this.articleId = articleId; }

   public Long getParentId() { return parentId; }
   public void setParentId(Long parentId) { this.parentId = parentId; }
}
```

#### CommentResponse

```java
package com.example.blogapp.dto.comment;

import java.time.LocalDateTime;

public class CommentResponse {

   private Long id;
   private String content;
   private LocalDateTime createdAt;
   private LocalDateTime updatedAt;

   // Informations sur l'auteur
   private Long authorId;
   private String authorUsername;
   private String authorFirstName;
   private String authorLastName;

   // Informations sur l'article
   private Long articleId;
   private String articleTitle;

   // Commentaire parent (si c'est une réponse)
   private Long parentId;
   private String parentAuthorUsername;

   // Constructeurs
   public CommentResponse() {}

   // Getters et Setters
   public Long getId() { return id; }
   public void setId(Long id) { this.id = id; }

   public String getContent() { return content; }
   public void setContent(String content) { this.content = content; }

   public LocalDateTime getCreatedAt() { return createdAt; }
   public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

   public LocalDateTime getUpdatedAt() { return updatedAt; }
   public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

   public Long getAuthorId() { return authorId; }
   public void setAuthorId(Long authorId) { this.authorId = authorId; }

   public String getAuthorUsername() { return authorUsername; }
   public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }

   public String getAuthorFirstName() { return authorFirstName; }
   public void setAuthorFirstName(String authorFirstName) { this.authorFirstName = authorFirstName; }

   public String getAuthorLastName() { return authorLastName; }
   public void setAuthorLastName(String authorLastName) { this.authorLastName = authorLastName; }

   public Long getArticleId() { return articleId; }
   public void setArticleId(Long articleId) { this.articleId = articleId; }

   public String getArticleTitle() { return articleTitle; }
   public void setArticleTitle(String articleTitle) { this.articleTitle = articleTitle; }

   public Long getParentId() { return parentId; }
   public void setParentId(Long parentId) { this.parentId = parentId; }

   public String getParentAuthorUsername() { return parentAuthorUsername; }
   public void setParentAuthorUsername(String parentAuthorUsername) { this.parentAuthorUsername = parentAuthorUsername; }
}
```

---

## 🔧 Étape 5 : Services Métier

### ArticleService

```java
package com.example.blogapp.service;

import com.example.blogapp.dto.article.ArticleRequest;
import com.example.blogapp.dto.article.ArticleResponse;
import com.example.blogapp.entity.Article;
import com.example.blogapp.entity.User;
import com.example.blogapp.exception.ResourceNotFoundException;
import com.example.blogapp.exception.UnauthorizedException;
import com.example.blogapp.repository.ArticleRepository;
import com.example.blogapp.repository.CommentRepository;
import com.example.blogapp.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ArticleService {

   @Autowired
   private ArticleRepository articleRepository;

   @Autowired
   private CommentRepository commentRepository;

   @Autowired
   private SecurityUtils securityUtils;

   // Créer un nouvel article
   public ArticleResponse createArticle(ArticleRequest request) {
      User currentUser = securityUtils.getCurrentUser();

      Article article = new Article();
      article.setTitle(request.getTitle());
      article.setSummary(request.getSummary());
      article.setContent(request.getContent());
      article.setImageUrl(request.getImageUrl());
      article.setPublished(request.isPublished());
      article.setAuthor(currentUser);

      if (request.getTags() != null) {
         article.setTags(request.getTags());
      }

      if (request.isPublished()) {
         article.publish();
      }

      Article savedArticle = articleRepository.save(article);
      return convertToResponse(savedArticle);
   }

   // Obtenir tous les articles publiés (pour le public)
   public Page<ArticleResponse> getPublishedArticles(Pageable pageable) {
      Page<Article> articles = articleRepository.findByPublishedTrueOrderByPublishedAtDesc(pageable);
      return articles.map(this::convertToResponse);
   }

   // Obtenir un article spécifique par ID
   public ArticleResponse getArticleById(Long id) {
      Article article = articleRepository.findById(id)
              .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé avec l'ID : " + id));

      // Vérifier si l'article est publié ou si l'utilisateur est l'auteur/admin
      if (!article.isPublished() && !canManageArticle(article)) {
         throw new ResourceNotFoundException("Article non trouvé");
      }

      return convertToResponse(article);
   }

   // Obtenir les articles d'un utilisateur
   public Page<ArticleResponse> getMyArticles(Pageable pageable) {
      User currentUser = securityUtils.getCurrentUser();
      Page<Article> articles = articleRepository.findByAuthorOrderByCreatedAtDesc(currentUser, pageable);
      return articles.map(this::convertToResponse);
   }

   // Mettre à jour un article
   public ArticleResponse updateArticle(Long id, ArticleRequest request) {
      Article article = articleRepository.findById(id)
              .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé avec l'ID : " + id));

      if (!canManageArticle(article)) {
         throw new UnauthorizedException("Vous n'êtes pas autorisé à modifier cet article");
      }

      article.setTitle(request.getTitle());
      article.setSummary(request.getSummary());
      article.setContent(request.getContent());
      article.setImageUrl(request.getImageUrl());

      // Gestion de la publication
      if (request.isPublished() && !article.isPublished()) {
         article.publish();
      } else {
         article.setPublished(request.isPublished());
      }

      if (request.getTags() != null) {
         article.setTags(request.getTags());
      }

      Article updatedArticle = articleRepository.save(article);
      return convertToResponse(updatedArticle);
   }

   // Supprimer un article
   public void deleteArticle(Long id) {
      Article article = articleRepository.findById(id)
              .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé avec l'ID : " + id));

      if (!canManageArticle(article)) {
         throw new UnauthorizedException("Vous n'êtes pas autorisé à supprimer cet article");
      }

      articleRepository.delete(article);
   }

   // Rechercher des articles
   public Page<ArticleResponse> searchArticles(String keyword, Pageable pageable) {
      Page<Article> articles = articleRepository.findByKeywordInTitleOrSummary(keyword, pageable);
      return articles.map(this::convertToResponse);
   }

   // Publier/dépublier un article
   public ArticleResponse togglePublishStatus(Long id) {
      Article article = articleRepository.findById(id)
              .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé avec l'ID : " + id));

      if (!canManageArticle(article)) {
         throw new UnauthorizedException("Vous n'êtes pas autorisé à modifier cet article");
      }

      if (article.isPublished()) {
         article.setPublished(false);
      } else {
         article.publish();
      }

      Article updatedArticle = articleRepository.save(article);
      return convertToResponse(updatedArticle);
   }

   // Méthodes utilitaires
   private boolean canManageArticle(Article article) {
      User currentUser = securityUtils.getCurrentUser();

      // L'auteur peut toujours gérer ses articles
      if (article.getAuthor().getId().equals(currentUser.getId())) {
         return true;
      }

      // Les admins peuvent gérer tous les articles
      return securityUtils.hasRole("ADMIN");
   }

   private ArticleResponse convertToResponse(Article article) {
      ArticleResponse response = new ArticleResponse();
      response.setId(article.getId());
      response.setTitle(article.getTitle());
      response.setSummary(article.getSummary());
      response.setContent(article.getContent());
      response.setImageUrl(article.getImageUrl());
      response.setPublished(article.isPublished());
      response.setCreatedAt(article.getCreatedAt());
      response.setUpdatedAt(article.getUpdatedAt());
      response.setPublishedAt(article.getPublishedAt());
      response.setTags(article.getTags());

      // Informations sur l'auteur
      User author = article.getAuthor();
      response.setAuthorId(author.getId());
      response.setAuthorUsername(author.getUsername());
      response.setAuthorFirstName(author.getFirstName());
      response.setAuthorLastName(author.getLastName());

      // Nombre de commentaires
      response.setCommentsCount(commentRepository.countByArticle(article));

      return response;
   }
}
```

### CommentService

```java
package com.example.blogapp.service;

import com.example.blogapp.dto.comment.CommentRequest;
import com.example.blogapp.dto.comment.CommentResponse;
import com.example.blogapp.entity.Article;
import com.example.blogapp.entity.Comment;
import com.example.blogapp.entity.User;
import com.example.blogapp.exception.ResourceNotFoundException;
import com.example.blogapp.exception.UnauthorizedException;
import com.example.blogapp.repository.ArticleRepository;
import com.example.blogapp.repository.CommentRepository;
import com.example.blogapp.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CommentService {

   @Autowired
   private CommentRepository commentRepository;

   @Autowired
   private ArticleRepository articleRepository;

   @Autowired
   private SecurityUtils securityUtils;

   // Créer un nouveau commentaire
   public CommentResponse createComment(CommentRequest request) {
      User currentUser = securityUtils.getCurrentUser();

      // Vérifier que l'article existe et est publié
      Article article = articleRepository.findById(request.getArticleId())
              .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé"));

      if (!article.isPublished()) {
         throw new ResourceNotFoundException("Impossible de commenter un article non publié");
      }

      Comment comment = new Comment();
      comment.setContent(request.getContent());
      comment.setAuthor(currentUser);
      comment.setArticle(article);

      // Gestion du commentaire parent (réponse)
      if (request.getParentId() != null) {
         Comment parent = commentRepository.findById(request.getParentId())
                 .orElseThrow(() -> new ResourceNotFoundException("Commentaire parent non trouvé"));
         comment.setParent(parent);
      }

      Comment savedComment = commentRepository.save(comment);
      return convertToResponse(savedComment);
   }

   // Obtenir les commentaires d'un article
   public Page<CommentResponse> getCommentsByArticle(Long articleId, Pageable pageable) {
      Article article = articleRepository.findById(articleId)
              .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé"));

      Page<Comment> comments = commentRepository.findByArticleOrderByCreatedAtAsc(article, pageable);
      return comments.map(this::convertToResponse);
   }

   // Obtenir les commentaires d'un utilisateur
   public Page<CommentResponse> getMyComments(Pageable pageable) {
      User currentUser = securityUtils.getCurrentUser();
      Page<Comment> comments = commentRepository.findByAuthorOrderByCreatedAtDesc(currentUser, pageable);
      return comments.map(this::convertToResponse);
   }

   // Mettre à jour un commentaire
   public CommentResponse updateComment(Long id, CommentRequest request) {
      Comment comment = commentRepository.findById(id)
              .orElseThrow(() -> new ResourceNotFoundException("Commentaire non trouvé"));

      if (!canManageComment(comment)) {
         throw new UnauthorizedException("Vous n'êtes pas autorisé à modifier ce commentaire");
      }

      comment.setContent(request.getContent());
      Comment updatedComment = commentRepository.save(comment);
      return convertToResponse(updatedComment);
   }

   // Supprimer un commentaire
   public void deleteComment(Long id) {
      Comment comment = commentRepository.findById(id)
              .orElseThrow(() -> new ResourceNotFoundException("Commentaire non trouvé"));

      if (!canManageComment(comment)) {
         throw new UnauthorizedException("Vous n'êtes pas autorisé à supprimer ce commentaire");
      }

      commentRepository.delete(comment);
   }

   // Obtenir un commentaire spécifique
   public CommentResponse getCommentById(Long id) {
      Comment comment = commentRepository.findById(id)
              .orElseThrow(() -> new ResourceNotFoundException("Commentaire non trouvé"));

      return convertToResponse(comment);
   }

   // Méthodes utilitaires
   private boolean canManageComment(Comment comment) {
      User currentUser = securityUtils.getCurrentUser();

      // L'auteur peut toujours gérer ses commentaires
      if (comment.getAuthor().getId().equals(currentUser.getId())) {
         return true;
      }

      // Les admins peuvent gérer tous les commentaires
      return securityUtils.hasRole("ADMIN");
   }

   private CommentResponse convertToResponse(Comment comment) {
      CommentResponse response = new CommentResponse();
      response.setId(comment.getId());
      response.setContent(comment.getContent());
      response.setCreatedAt(comment.getCreatedAt());
      response.setUpdatedAt(comment.getUpdatedAt());

      // Informations sur l'auteur
      User author = comment.getAuthor();
      response.setAuthorId(author.getId());
      response.setAuthorUsername(author.getUsername());
      response.setAuthorFirstName(author.getFirstName());
      response.setAuthorLastName(author.getLastName());

      // Informations sur l'article
      Article article = comment.getArticle();
      response.setArticleId(article.getId());
      response.setArticleTitle(article.getTitle());

      // Commentaire parent (si c'est une réponse)
      if (comment.getParent() != null) {
         response.setParentId(comment.getParent().getId());
         response.setParentAuthorUsername(comment.getParent().getAuthor().getUsername());
      }

      return response;
   }
}
```

### Utilitaire SecurityUtils

```java
package com.example.blogapp.util;

import com.example.blogapp.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

   public User getCurrentUser() {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

      if (authentication == null || !authentication.isAuthenticated()) {
         throw new RuntimeException("Aucun utilisateur authentifié");
      }

      return (User) authentication.getPrincipal();
   }

   public boolean hasRole(String roleName) {
      User currentUser = getCurrentUser();
      return currentUser.getAuthorities().stream()
              .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + roleName));
   }

   public boolean isOwner(Long userId) {
      User currentUser = getCurrentUser();
      return currentUser.getId().equals(userId);
   }

   public boolean isOwnerOrAdmin(Long userId) {
      return isOwner(userId) || hasRole("ADMIN");
   }
}
```

---

## 🎮 Étape 6 : Contrôleurs REST

### ArticleController

```java
package com.example.blogapp.controller;

import com.example.blogapp.dto.article.ArticleRequest;
import com.example.blogapp.dto.article.ArticleResponse;
import com.example.blogapp.service.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
@Tag(name = "Articles", description = "Gestion des articles du blog")
public class ArticleController {

   @Autowired
   private ArticleService articleService;

   @PostMapping
   @Operation(summary = "Créer un article", description = "Crée un nouvel article")
   @SecurityRequirement(name = "bearerAuth")
   @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
   public ResponseEntity<ArticleResponse> createArticle(@Valid @RequestBody ArticleRequest request) {
      ArticleResponse article = articleService.createArticle(request);
      return new ResponseEntity<>(article, HttpStatus.CREATED);
   }

   @GetMapping
   @Operation(summary = "Liste des articles publiés", description = "Récupère tous les articles publiés avec pagination")
   public ResponseEntity<Page<ArticleResponse>> getPublishedArticles(
           @RequestParam(defaultValue = "0") int page,
           @RequestParam(defaultValue = "10") int size) {

      Pageable pageable = PageRequest.of(page, size);
      Page<ArticleResponse> articles = articleService.getPublishedArticles(pageable);
      return ResponseEntity.ok(articles);
   }

   @GetMapping("/{id}")
   @Operation(summary = "Article par ID", description = "Récupère un article spécifique par son ID")
   public ResponseEntity<ArticleResponse> getArticleById(@PathVariable Long id) {
      ArticleResponse article = articleService.getArticleById(id);
      return ResponseEntity.ok(article);
   }

   @GetMapping("/my-articles")
   @Operation(summary = "Mes articles", description = "Récupère les articles de l'utilisateur connecté")
   @SecurityRequirement(name = "bearerAuth")
   @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
   public ResponseEntity<Page<ArticleResponse>> getMyArticles(
           @RequestParam(defaultValue = "0") int page,
           @RequestParam(defaultValue = "10") int size) {

      Pageable pageable = PageRequest.of(page, size);
      Page<ArticleResponse> articles = articleService.getMyArticles(pageable);
      return ResponseEntity.ok(articles);
   }

   @PutMapping("/{id}")
   @Operation(summary = "Mettre à jour un article", description = "Met à jour un article existant")
   @SecurityRequirement(name = "bearerAuth")
   @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
   public ResponseEntity<ArticleResponse> updateArticle(
           @PathVariable Long id,
           @Valid @RequestBody ArticleRequest request) {

      ArticleResponse article = articleService.updateArticle(id, request);
      return ResponseEntity.ok(article);
   }

   @DeleteMapping("/{id}")
   @Operation(summary = "Supprimer un article", description = "Supprime un article")
   @SecurityRequirement(name = "bearerAuth")
   @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
   public ResponseEntity<Map<String, String>> deleteArticle(@PathVariable Long id) {
      articleService.deleteArticle(id);

      Map<String, String> response = new HashMap<>();
      response.put("message", "Article supprimé avec succès");

      return ResponseEntity.ok(response);
   }

   @GetMapping("/search")
   @Operation(summary = "Rechercher des articles", description = "Recherche des articles par mot-clé")
   public ResponseEntity<Page<ArticleResponse>> searchArticles(
           @RequestParam String keyword,
           @RequestParam(defaultValue = "0") int page,
           @RequestParam(defaultValue = "10") int size) {

      Pageable pageable = PageRequest.of(page, size);
      Page<ArticleResponse> articles = articleService.searchArticles(keyword, pageable);
      return ResponseEntity.ok(articles);
   }

   @PatchMapping("/{id}/toggle-publish")
   @Operation(summary = "Publier/Dépublier un article", description = "Change le statut de publication d'un article")
   @SecurityRequirement(name = "bearerAuth")
   @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
   public ResponseEntity<ArticleResponse> togglePublishStatus(@PathVariable Long id) {
      ArticleResponse article = articleService.togglePublishStatus(id);
      return ResponseEntity.ok(article);
   }
}
```

### CommentController

```java
package com.example.blogapp.controller;

import com.example.blogapp.dto.comment.CommentRequest;
import com.example.blogapp.dto.comment.CommentResponse;
import com.example.blogapp.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@Tag(name = "Comments", description = "Gestion des commentaires")
public class CommentController {

   @Autowired
   private CommentService commentService;

   @PostMapping
   @Operation(summary = "Créer un commentaire", description = "Ajoute un commentaire à un article")
   @SecurityRequirement(name = "bearerAuth")
   @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
   public ResponseEntity<CommentResponse> createComment(@Valid @RequestBody CommentRequest request) {
      CommentResponse comment = commentService.createComment(request);
      return new ResponseEntity<>(comment, HttpStatus.CREATED);
   }

   @GetMapping("/article/{articleId}")
   @Operation(summary = "Commentaires d'un article", description = "Récupère tous les commentaires d'un article")
   public ResponseEntity<Page<CommentResponse>> getCommentsByArticle(
           @PathVariable Long articleId,
           @RequestParam(defaultValue = "0") int page,
           @RequestParam(defaultValue = "10") int size) {

      Pageable pageable = PageRequest.of(page, size);
      Page<CommentResponse> comments = commentService.getCommentsByArticle(articleId, pageable);
      return ResponseEntity.ok(comments);
   }

   @GetMapping("/my-comments")
   @Operation(summary = "Mes commentaires", description = "Récupère les commentaires de l'utilisateur connecté")
   @SecurityRequirement(name = "bearerAuth")
   @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
   public ResponseEntity<Page<CommentResponse>> getMyComments(
           @RequestParam(defaultValue = "0") int page,
           @RequestParam(defaultValue = "10") int size) {

      Pageable pageable = PageRequest.of(page, size);
      Page<CommentResponse> comments = commentService.getMyComments(pageable);
      return ResponseEntity.ok(comments);
   }

   @GetMapping("/{id}")
   @Operation(summary = "Commentaire par ID", description = "Récupère un commentaire spécifique")
   public ResponseEntity<CommentResponse> getCommentById(@PathVariable Long id) {
      CommentResponse comment = commentService.getCommentById(id);
      return ResponseEntity.ok(comment);
   }

   @PutMapping("/{id}")
   @Operation(summary = "Mettre à jour un commentaire", description = "Modifie un commentaire existant")
   @SecurityRequirement(name = "bearerAuth")
   @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
   public ResponseEntity<CommentResponse> updateComment(
           @PathVariable Long id,
           @Valid @RequestBody CommentRequest request) {

      CommentResponse comment = commentService.updateComment(id, request);
      return ResponseEntity.ok(comment);
   }

   @DeleteMapping("/{id}")
   @Operation(summary = "Supprimer un commentaire", description = "Supprime un commentaire")
   @SecurityRequirement(name = "bearerAuth")
   @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
   public ResponseEntity<Map<String, String>> deleteComment(@PathVariable Long id) {
      commentService.deleteComment(id);

      Map<String, String> response = new HashMap<>();
      response.put("message", "Commentaire supprimé avec succès");

      return ResponseEntity.ok(response);
   }
}
```

---

## 🔐 Étape 7 : Configuration Complète (Reprise du guide précédent)

Pour l'authentification JWT, utilisez exactement les mêmes classes que dans le guide précédent :

1. **JwtService** - Gestion des tokens JWT
2. **CustomUserDetailsService** - Chargement des utilisateurs
3. **AuthService** - Services d'authentification
4. **JwtAuthenticationFilter** - Filtre pour valider les tokens
5. **SecurityConfig** - Configuration Spring Security
6. **AuthController** - Endpoints d'authentification

---

## 🛠️ Étape 8 : Script de Données Initiales

### data.sql

```sql
-- Insertion des rôles
INSERT INTO roles (id, name, description) VALUES 
(1, 'USER', 'Utilisateur standard du blog'),
(2, 'ADMIN', 'Administrateur du blog');

-- Vous pouvez ajouter un utilisateur admin par défaut
-- Le mot de passe sera hashé par l'application lors de l'inscription
```

---

## 🚀 Étape 9 : Tests de l'API

### 1. Inscription d'un utilisateur

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "blogauthor",
    "email": "author@blog.com",
    "password": "password123",
    "firstName": "Blog",
    "lastName": "Author"
  }'
```

### 2. Connexion

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "blogauthor",
    "password": "password123"
  }'
```

### 3. Créer un article

```bash
curl -X POST http://localhost:8080/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Mon Premier Article",
    "summary": "Ceci est le résumé de mon premier article de blog",
    "content": "Voici le contenu complet de mon premier article. Il contient beaucoup d'informations intéressantes...",
    "imageUrl": "https://example.com/image.jpg",
    "published": true,
    "tags": ["tech", "programmation", "spring-boot"]
  }'
```

### 4. Obtenir tous les articles publiés

```bash
curl -X GET "http://localhost:8080/api/articles?page=0&size=10"
```

### 5. Ajouter un commentaire

```bash
curl -X POST http://localhost:8080/api/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "Excellent article ! Merci pour le partage.",
    "articleId": 1
  }'
```

---

## 📱 Étape 10 : Frontend avec React (Aperçu)

### Structure du Frontend React

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── articles/
│   │   │   ├── ArticleList.jsx
│   │   │   ├── ArticleCard.jsx
│   │   │   ├── ArticleForm.jsx
│   │   │   └── ArticleDetail.jsx
│   │   ├── comments/
│   │   │   ├── CommentList.jsx
│   │   │   └── CommentForm.jsx
│   │   └── layout/
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       └── Sidebar.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── articleService.js
│   │   └── commentService.js
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   └── api.js
│   └── App.jsx
```

### Exemple de Service API (articleService.js)

```javascript
const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const articleService = {
  // Obtenir tous les articles publiés
  getPublishedArticles: async (page = 0, size = 10) => {
    const response = await fetch(`${API_BASE_URL}/articles?page=${page}&size=${size}`);
    return response.json();
  },

  // Créer un article
  createArticle: async (articleData) => {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(articleData),
    });
    return response.json();
  },

  // Obtenir un article par ID
  getArticleById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    return response.json();
  },

  // Mettre à jour un article
  updateArticle: async (id, articleData) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(articleData),
    });
    return response.json();
  },

  // Supprimer un article
  deleteArticle: async (id) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  }
};
```

---

## 🎯 Plan de Développement Week-end

### 🗓️ Samedi Matin (2-3h)

1. **Mise en place du projet**
   - ✅ Créer le projet Spring Boot (déjà fait)
   - ✅ Configurer PostgreSQL
   - ✅ Créer les entités User, Role, Article, Comment
   - ✅ Configurer l'authentification JWT

### 🗓️ Samedi Après-midi (3-4h)

2. **Implémentation des Articles**
   - ✅ Créer ArticleRepository et ArticleService
   - ✅ Créer ArticleController avec tous les endpoints
   - ✅ Tester les APIs avec Postman/curl
   - ✅ Implémenter les règles de permissions

### 🗓️ Dimanche Matin (2-3h)

3. **Implémentation des Commentaires**
   - ✅ Créer CommentRepository et CommentService
   - ✅ Créer CommentController
   - ✅ Tester l'association articles ↔ commentaires
   - ✅ Ajouter la gestion des réponses aux commentaires

### 🗓️ Dimanche Après-midi (3-4h)

4. **Frontend et Finalisation**
   - 🔄 Générer le frontend React avec Hostinger Horizons
   - 🔄 Connecter les APIs (auth, articles, commentaires)
   - 🔄 Implémenter les interfaces utilisateur de base
   - 🔄 Tests finaux et déploiement

---

## 📚 Documentation API Complète

Une fois votre application démarrée, vous pouvez accéder à la documentation API complète via Swagger à :

```
http://localhost:8080/api/swagger-ui.html
```

---

## 🔧 Commandes Utiles

### Démarrer PostgreSQL (Docker)

```bash
docker run --name postgres-blog -e POSTGRES_PASSWORD=password -e POSTGRES_DB=blog_db -p 5432:5432 -d postgres:13
```

### Compiler et démarrer l'application

```bash
mvn clean install
mvn spring-boot:run
```

### Vérifier les logs

```bash
tail -f logs/spring-boot-application.log
```

---

## ✅ Checklist de Validation

### Backend
- [ ] Authentification JWT fonctionnelle
- [ ] CRUD Articles complet
- [ ] CRUD Commentaires complet
- [ ] Règles de permissions respectées
- [ ] Tests API réussis avec Postman
- [ ] Documentation Swagger accessible

### Intégration
- [ ] Base de données PostgreSQL connectée
- [ ] Relations entre entités fonctionnelles
- [ ] Gestion d'erreurs appropriée
- [ ] Configuration CORS pour le frontend

### Prêt pour le Frontend
- [ ] Toutes les APIs documentées
- [ ] Responses JSON cohérentes
- [ ] Authentification testée
- [ ] Pagination implémentée

---

## 🎉 Conclusion

Vous avez maintenant toutes les bases pour créer un blog complet ! Ce guide vous donne :

✅ **Une architecture solide** avec Spring Boot + JWT
✅ **Des fonctionnalités complètes** : Articles + Commentaires + Auth
✅ **Des permissions appropriées** : Utilisateurs vs Admins
✅ **Du code prêt à l'emploi** : Copier-coller et adapter
✅ **Une documentation claire** : Swagger intégré
✅ **Un plan de développement** : Week-end structuré

**Prochaines étapes :**
1. Suivre le plan week-end
2. Tester toutes les APIs
3. Connecter le frontend React
4. Déployer sur Railway/Render

Bonne chance pour votre projet de blog ! 🚀