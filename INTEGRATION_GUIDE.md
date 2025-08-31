# 🚀 Guide d'Intégration Frontend - Blog API

Ce guide vous explique comment intégrer votre frontend React Vite avec l'API Spring Boot du blog.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Configuration initiale](#configuration-initiale)
3. [Installation des dépendances](#installation-des-dépendances)
4. [Configuration de l'environnement](#configuration-de-lenvironnement)
5. [Utilisation des services API](#utilisation-des-services-api)
6. [Exemples d'implémentation](#exemples-dimplémentation)
7. [Gestion des erreurs](#gestion-des-erreurs)
8. [Optimisations et bonnes pratiques](#optimisations-et-bonnes-pratiques)

---

## 🔧 Prérequis

- Node.js 18+ et npm/yarn
- React 18+
- Vite comme bundler
- API Spring Boot démarrée sur `http://127.0.0.1:8080/api`

---

## ⚙️ Configuration initiale

### 1. Structure des fichiers

Assurez-vous d'avoir cette structure dans votre projet :

```
src/
├── services/
│   └── apiService.js          # Services API
├── hooks/
│   └── useApi.js             # Hooks personnalisés
├── types/
│   └── api.ts                # Types TypeScript (optionnel)
├── components/
│   ├── auth/
│   ├── articles/
│   └── comments/
└── utils/
```

### 2. Copier les fichiers fournis

Les fichiers suivants sont déjà créés dans ce répertoire :
- `src/services/apiService.js` - Services API complets
- `src/hooks/useApi.js` - Hooks React personnalisés
- `src/types/api.ts` - Types TypeScript
- `.env.example` - Configuration d'environnement

---

## 📦 Installation des dépendances

```bash
# Installer Axios pour les requêtes HTTP
npm install axios

# Pour TypeScript (optionnel)
npm install -D typescript @types/react @types/react-dom

# Pour la gestion des formulaires (recommandé)
npm install react-hook-form

# Pour les notifications (optionnel)
npm install react-hot-toast

# Pour le routage (si pas déjà installé)
npm install react-router-dom
```

---

## 🔐 Configuration de l'environnement

### 1. Créer le fichier `.env`

```bash
cp .env.example .env
```

### 2. Configurer les variables

```bash
# .env
VITE_API_BASE_URL=http://127.0.0.1:8080/api
VITE_APP_NAME=Mon Blog
VITE_DEFAULT_PAGE_SIZE=10
```

---

## 🛠️ Utilisation des services API

### Import des services

```javascript
import { authService, articleService, commentService } from './services/apiService';
import { useAuth, useArticles, useComments } from './hooks/useApi';
```

### Authentification

```javascript
// Composant de connexion
import { useAuth } from '../hooks/useApi';

function LoginComponent() {
  const { login, loading, error } = useAuth();

  const handleLogin = async (formData) => {
    try {
      await login({
        username: formData.username,
        password: formData.password
      });
      // Redirection après connexion réussie
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    // Votre JSX de formulaire de connexion
  );
}
```

### Afficher la liste des articles

```javascript
// Composant liste d'articles
import { useArticles } from '../hooks/useApi';

function ArticleList() {
  const { 
    articles, 
    loading, 
    error, 
    pagination, 
    goToPage 
  } = useArticles(0, 10);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>
          <h3>{article.title}</h3>
          <p>{article.contenu.substring(0, 200)}...</p>
          <small>Par {article.authorUsername}</small>
        </div>
      ))}
      
      {/* Pagination */}
      <div>
        {Array.from({ length: pagination.totalPages }, (_, i) => (
          <button 
            key={i} 
            onClick={() => goToPage(i)}
            disabled={i === pagination.page}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Afficher un article avec commentaires

```javascript
// Composant article détail
import { useParams } from 'react-router-dom';
import { useArticle, useComments } from '../hooks/useApi';

function ArticleDetail() {
  const { id } = useParams();
  const { article, loading: articleLoading } = useArticle(id);
  const { 
    comments, 
    loading: commentsLoading, 
    createComment 
  } = useComments(id);

  const handleAddComment = async (commentData) => {
    try {
      await createComment({ contenu: commentData.content });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    }
  };

  if (articleLoading) return <div>Chargement de l'article...</div>;
  if (!article) return <div>Article non trouvé</div>;

  return (
    <div>
      <article>
        <h1>{article.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: article.contenu }} />
        <div>
          Tags: {article.tags.join(', ')}
        </div>
      </article>

      <section>
        <h2>Commentaires ({article.commentsCount})</h2>
        {commentsLoading ? (
          <div>Chargement des commentaires...</div>
        ) : (
          comments.map(comment => (
            <div key={comment.id}>
              <p>{comment.contenu}</p>
              <small>Par {comment.authorUsername}</small>
            </div>
          ))
        )}
        
        {/* Formulaire d'ajout de commentaire */}
        <CommentForm onSubmit={handleAddComment} />
      </section>
    </div>
  );
}
```

---

## 🎯 Exemples d'implémentation

### Composant de recherche

```javascript
import { useState } from 'react';
import { articleService } from '../services/apiService';

function SearchArticles() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await articleService.searchArticles(query);
      setResults(response.content);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher des articles..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>

      <div>
        {results.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
```

### Créateur d'article

```javascript
import { useMyArticles } from '../hooks/useApi';
import { useState } from 'react';

function CreateArticle() {
  const { createArticle, loading } = useMyArticles();
  const [formData, setFormData] = useState({
    title: '',
    contenu: '',
    published: false,
    tags: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await createArticle({
        ...formData,
        tags: tagsArray
      });

      // Réinitialiser le formulaire
      setFormData({
        title: '',
        contenu: '',
        published: false,
        tags: []
      });

      alert('Article créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Titre:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            title: e.target.value 
          }))}
          required
        />
      </div>

      <div>
        <label>Contenu:</label>
        <textarea
          value={formData.contenu}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            contenu: e.target.value 
          }))}
          required
          rows="10"
        />
      </div>

      <div>
        <label>Tags (séparés par des virgules):</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            tags: e.target.value 
          }))}
          placeholder="tech, react, tutorial"
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              published: e.target.checked 
            }))}
          />
          Publier immédiatement
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Création...' : 'Créer l\'article'}
      </button>
    </form>
  );
}
```

---

## ❌ Gestion des erreurs

### Composant d'erreur global

```javascript
// components/ErrorBoundary.jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erreur capturée par ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Une erreur est survenue</h2>
          <details>
            <summary>Détails de l'erreur</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Hook pour la gestion d'erreurs

```javascript
// hooks/useErrorHandler.js
import { useState, useCallback } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((error) => {
    console.error('Erreur capturée:', error);
    
    let message = 'Une erreur est survenue';
    
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    setError(message);
    
    // Auto-effacer l'erreur après 5 secondes
    setTimeout(() => setError(null), 5000);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { error, handleError, clearError };
};
```

---

## ⚡ Optimisations et bonnes pratiques

### 1. Mise en cache avec React Query (recommandé)

```bash
npm install @tanstack/react-query
```

```javascript
// Wrapper pour React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleService } from '../services/apiService';

export const useArticlesQuery = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['articles', page, size],
    queryFn: () => articleService.getPublishedArticles(page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateArticleMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: articleService.createArticle,
    onSuccess: () => {
      // Invalider le cache pour recharger les articles
      queryClient.invalidateQueries(['articles']);
      queryClient.invalidateQueries(['my-articles']);
    },
  });
};
```

### 2. Context pour l'authentification

```javascript
// contexts/AuthContext.jsx
import { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
```

### 3. Route protégée

```javascript
// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated } = useAuthContext();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
```

### 4. Configuration du routeur principal

```javascript
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## 📚 Ressources supplémentaires

- [Documentation API complète](./API_DOCUMENTATION.md)
- [Swagger UI](http://127.0.0.1:8080/api/swagger-ui.html) (quand l'API est démarrée)
- [Types TypeScript](./src/types/api.ts)

---

## 🐛 Dépannage

### Problèmes courants

1. **CORS Error**: L'API est configurée pour CORS, utilisez `http://127.0.0.1:8080` au lieu de `localhost`

2. **Token expiré**: Les tokens JWT expirent, implémentez le rafraîchissement automatique

3. **Erreur 401**: Vérifiez que le token est correctement stocké et envoyé dans les headers

4. **Pagination**: Les pages commencent à 0, pas à 1

### Commandes utiles pour le debug

```bash
# Vérifier les variables d'environnement
echo $VITE_API_BASE_URL

# Tester l'API manuellement
curl -X GET http://127.0.0.1:8080/api/articles

# Vérifier la connectivité
ping 127.0.0.1
```

---

*Guide d'intégration pour le Blog Spring Boot API - Version 1.0*
