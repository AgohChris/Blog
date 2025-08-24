import axios from 'axios';

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Instance Axios configurée
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // Augmenté à 20 secondes
});

// Intercepteur pour ajouter automatiquement le token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==========================================
// SERVICES D'AUTHENTIFICATION
// ==========================================

export const authService = {
  // Connexion
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, ...userData } = response.data;
      
      // Stocker le token et les infos utilisateur
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Inscription
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Rafraîchir le token
  async refreshToken(refreshToken) {
    try {
      const response = await apiClient.post('/auth/refresh', { refreshToken });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Déconnexion
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le stockage local dans tous les cas
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  // Récupérer les infos utilisateur
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// ==========================================
// SERVICES D'ARTICLES
// ==========================================

export const articleService = {
  // Récupérer tous les articles publiés
  async getPublishedArticles(page = 0, size = 10) {
    try {
      const response = await apiClient.get('/articles/liste', {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Récupérer un article par ID
  async getArticleById(id) {
    try {
      const response = await apiClient.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Récupérer mes articles (authentifié)
  async getMyArticles(page = 0, size = 10) {
    try {
      const response = await apiClient.get('/articles/mes_articles', {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Créer un article
  async createArticle(articleData) {
    try {
      const response = await apiClient.post('/articles/creer', articleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Mettre à jour un article
  async updateArticle(id, articleData) {
    try {
      const response = await apiClient.put(`/articles/${id}`, articleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Supprimer un article
  async deleteArticle(id) {
    try {
      const response = await apiClient.delete(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Rechercher des articles
  async searchArticles(keyword, page = 0, size = 10) {
    try {
      const response = await apiClient.get('/articles/search', {
        params: { keyword, page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Publier/Dépublier un article
  async togglePublishStatus(id) {
    try {
      const response = await apiClient.patch(`/articles/${id}/toggle-publish`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }
};

// ==========================================
// SERVICES DE COMMENTAIRES
// ==========================================

export const commentService = {
  // Récupérer les commentaires d'un article
  async getArticleComments(articleId, page = 0, size = 10) {
    try {
      const response = await apiClient.get(`/commentaires/article/${articleId}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Récupérer mes commentaires
  async getMyComments(page = 0, size = 10) {
    try {
      const response = await apiClient.get('/commentaires/mes-commentaires', {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Récupérer un commentaire par ID
  async getCommentById(id) {
    try {
      const response = await apiClient.get(`/commentaires/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Créer un commentaire
  async createComment(commentData) {
    try {
      const response = await apiClient.post('/commentaires', commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Mettre à jour un commentaire
  async updateComment(id, commentData) {
    try {
      const response = await apiClient.put(`/commentaires/${id}`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Supprimer un commentaire
  async deleteComment(id) {
    try {
      const response = await apiClient.delete(`/commentaires/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }
};

// Export de l'instance Axios pour usage avancé
export default apiClient;
