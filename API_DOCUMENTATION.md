# 📚 Documentation API - Blog Spring Boot

> **URL de base :** `http://127.0.0.1:8080/api`
> **Version :** 1.0  
> **Authentification :** JWT Bearer Token

---

## 🔐 Authentification

### POST `/auth/login`
**Connexion utilisateur**

```javascript
// Request
{
  "username": "johndoe",
  "password": "password123"
}

// Response (200)
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe", 
  "email": "john.doe@example.com",
  "roles": ["ROLE_USER"],
  "expiresAt": "2025-08-23T08:37:01"
}

// Error (401)
{
  "message": "Identifiants invalides"
}
```

### POST `/auth/register`
**Inscription utilisateur**

```javascript
// Request
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123"
}

// Response (201)
{
  "message": "Utilisateur enregistré avec succès !"
}

// Error (409)
{
  "message": "Utilisateur déjà existant"
}
```

### POST `/auth/refresh`
**Rafraîchir le token**

```javascript
// Request
{
  "refreshToken": "your-refresh-token-here"
}

// Response (200)
{
  "token": "new-jwt-token",
  "type": "Bearer",
  // ... autres propriétés
}
```

### POST `/auth/logout`
**Déconnexion**

```javascript
// Response (200)
{
  "message": "Déconnexion réussie !"
}
```

---

## 📝 Articles

### GET `/articles`
**Liste des articles publiés (public)**

```javascript
// Query Parameters
const params = {
  page: 0,      // Numéro de page (défaut: 0)
  size: 10      // Nombre d'éléments par page (défaut: 10)
}

// Response (200)
{
  "content": [
    {
      "id": 1,
      "title": "Mon premier article",
      "contenu": "Contenu de l'article...",
      "published": true,
      "createdAt": "2025-08-22T10:30:00",
      "updateAt": "2025-08-22T11:00:00",
      "publishedAt": "2025-08-22T10:45:00",
      "tags": ["tech", "blog"],
      "authorId": 1,
      "authorUsername": "johndoe",
      "commentsCount": 5
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {...}
  },
  "totalElements": 50,
  "totalPages": 5,
  "first": true,
  "last": false
}
```

### GET `/articles/{id}`
**Article par ID (public)**

```javascript
// Response (200)
{
  "id": 1,
  "title": "Mon premier article",
  "contenu": "Contenu complet de l'article...",
  "published": true,
  "createdAt": "2025-08-22T10:30:00",
  "updateAt": "2025-08-22T11:00:00",
  "publishedAt": "2025-08-22T10:45:00",
  "tags": ["tech", "blog"],
  "authorId": 1,
  "authorUsername": "johndoe",
  "commentsCount": 5
}

// Error (404)
{
  "message": "Article non trouvé"
}
```

### POST `/articles`
**Créer un article** 🔒 *Authentification requise*

```javascript
// Headers
{
  "Authorization": "Bearer your-jwt-token",
  "Content-Type": "application/json"
}

// Request
{
  "title": "Mon nouvel article",
  "contenu": "Contenu de l'article...",
  "published": false,
  "tags": ["tech", "react"]
}

// Response (201)
{
  "id": 2,
  "title": "Mon nouvel article",
  // ... autres propriétés
}
```

### GET `/articles/mes_articles`
**Mes articles** 🔒 *Authentification requise*

```javascript
// Headers + Query Parameters identiques à GET /articles
// Retourne uniquement les articles de l'utilisateur connecté
```

### PUT `/articles/{id}`
**Mettre à jour un article** 🔒 *Authentification requise*

```javascript
// Headers
{
  "Authorization": "Bearer your-jwt-token",
  "Content-Type": "application/json"
}

// Request
{
  "title": "Titre modifié",
  "contenu": "Contenu modifié...",
  "published": true,
  "tags": ["tech", "react", "updated"]
}

// Response (200) - Structure identique à GET /articles/{id}
```

### DELETE `/articles/{id}`
**Supprimer un article** 🔒 *Authentification requise*

```javascript
// Response (200)
{
  "message": "Article supprimé avec succès"
}
```

### GET `/articles/search`
**Rechercher des articles**

```javascript
// Query Parameters
const params = {
  keyword: "react",  // Mot-clé de recherche
  page: 0,
  size: 10
}

// Response (200) - Structure identique à GET /articles
```

### PATCH `/articles/{id}/toggle-publish`
**Publier/Dépublier un article** 🔒 *Authentification requise*

```javascript
// Response (200) - Article avec statut de publication modifié
```

---

## 💬 Commentaires

### GET `/commentaires/article/{articleId}`
**Commentaires d'un article (public)**

```javascript
// Query Parameters
const params = {
  page: 0,
  size: 10
}

// Response (200)
{
  "content": [
    {
      "id": 1,
      "contenu": "Super article !",
      "createdAt": "2025-08-22T12:00:00",
      "updatedAt": "2025-08-22T12:00:00",
      "authorId": 2,
      "authorUsername": "jane",
      "articleId": 1,
      "articleTitle": "Mon premier article",
      "parentId": null,  // null si commentaire principal
      "parentAuthorUsername": null
    }
  ],
  // ... pagination identique aux articles
}
```

### POST `/commentaires`
**Créer un commentaire** 🔒 *Authentification requise*

```javascript
// Request
{
  "contenu": "Mon commentaire...",
  "articleId": 1,
  "parentId": null  // null pour commentaire principal, ID pour réponse
}

// Response (201)
{
  "id": 5,
  "contenu": "Mon commentaire...",
  "createdAt": "2025-08-22T12:30:00",
  "authorId": 1,
  "authorUsername": "johndoe",
  "articleId": 1,
  "parentId": null
}
```

### GET `/commentaires/mes-commentaires`
**Mes commentaires** 🔒 *Authentification requise*

```javascript
// Query Parameters + Response identiques à GET /commentaires/article/{id}
```

### GET `/commentaires/{id}`
**Commentaire par ID (public)**

```javascript
// Response (200) - Structure identique au commentaire dans la liste
```

### PUT `/commentaires/{id}`
**Modifier un commentaire** 🔒 *Authentification requise*

```javascript
// Request
{
  "contenu": "Commentaire modifié...",
  "articleId": 1,  // ID de l'article (requis même pour modification)
  "parentId": null
}

// Response (200) - Commentaire modifié
```

### DELETE `/commentaires/{id}`
**Supprimer un commentaire** 🔒 *Authentification requise*

```javascript
// Response (200)
{
  "message": "Commentaire supprimé avec succès"
}
```

---

## 🔧 Configuration Frontend

### Variables d'environnement (.env)
```bash
VITE_API_BASE_URL=http://127.0.0.1:8080/api
VITE_APP_NAME=Blog App
```

### Service API (utils/api.js)
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Configuration Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Exemples d'utilisation

#### Connexion
```javascript
const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

#### Récupérer les articles
```javascript
const getArticles = async (page = 0, size = 10) => {
  try {
    const response = await apiClient.get('/articles', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

#### Créer un article
```javascript
const createArticle = async (articleData) => {
  try {
    const response = await apiClient.post('/articles', articleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

---

## 📋 Types TypeScript

```typescript
// Types pour l'authentification
interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
  expiresAt: string;
}

// Types pour les articles
interface ArticleRequest {
  title: string;
  contenu: string;
  published: boolean;
  tags?: string[];
}

interface ArticleResponse {
  id: number;
  title: string;
  contenu: string;
  published: boolean;
  createdAt: string;
  updateAt: string;
  publishedAt: string | null;
  tags: string[];
  authorId: number;
  authorUsername: string;
  commentsCount: number;
}

// Types pour les commentaires
interface CommentRequest {
  contenu: string;
  articleId: number;
  parentId?: number | null;
}

interface CommentResponse {
  id: number;
  contenu: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  authorUsername: string;
  articleId: number;
  articleTitle: string;
  parentId: number | null;
  parentAuthorUsername: string | null;
}

// Type pour la pagination
interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any;
  };
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
```

---

## 🚨 Gestion des erreurs

### Codes d'erreur courants
- **200**: Succès
- **201**: Créé avec succès
- **400**: Données invalides
- **401**: Non authentifié
- **403**: Accès interdit
- **404**: Ressource non trouvée
- **409**: Conflit (ex: utilisateur déjà existant)
- **500**: Erreur serveur

### Structure des erreurs
```javascript
{
  "message": "Description de l'erreur",
  "timestamp": "2025-08-22T12:00:00",
  "path": "/api/articles/1"
}
```

---

## 🧪 Swagger/OpenAPI

L'API dispose d'une documentation Swagger accessible à :
`http://127.0.0.1:8080/api/swagger-ui.html`

---

## 📝 Notes importantes

1. **Authentification** : Stockez le JWT dans `localStorage` ou un store sécurisé
2. **Expiration des tokens** : Gérez le rafraîchissement automatique des tokens
3. **CORS** : L'API est configurée pour accepter les requêtes du frontend
4. **Pagination** : Toutes les listes sont paginées
5. **Validation** : Le backend valide tous les champs selon les contraintes définies
6. **Dates** : Toutes les dates sont au format ISO 8601 (LocalDateTime)

---

*Documentation générée pour le blog Spring Boot - Version 1.0*
