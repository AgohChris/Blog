import { useState, useEffect, useCallback } from 'react';
import { authService, articleService, commentService } from '../services/apiService';

// ==========================================
// HOOK D'AUTHENTIFICATION
// ==========================================

export const useAuth = () => {
  const [auth, setAuth] = useState({
    isAuthenticated: authService.isAuthenticated(),
    user: authService.getCurrentUser(),
    loading: false,
    error: null
  });

  const login = async (credentials) => {
    setAuth(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await authService.login(credentials);
      setAuth({
        isAuthenticated: true,
        user: response,
        loading: false,
        error: null
      });
      return response;
    } catch (error) {
      setAuth(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Erreur de connexion' 
      }));
      throw error;
    }
  };

  const register = async (userData) => {
    setAuth(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await authService.register(userData);
      setAuth(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error) {
      setAuth(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Erreur d\'inscription' 
      }));
      throw error;
    }
  };

  const logout = async () => {
    setAuth(prev => ({ ...prev, loading: true }));
    try {
      await authService.logout();
      setAuth({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, on déconnecte l'utilisateur côté client
      setAuth({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    }
  };

  const refreshAuth = useCallback(() => {
    setAuth({
      isAuthenticated: authService.isAuthenticated(),
      user: authService.getCurrentUser(),
      loading: false,
      error: null
    });
  }, []);

  return {
    ...auth,
    login,
    register,
    logout,
    refreshAuth
  };
};

// ==========================================
// HOOK POUR LES ARTICLES
// ==========================================

export const useArticles = (initialPage = 0, initialSize = 10) => {
  const [state, setState] = useState({
    articles: [],
    loading: false,
    error: null,
    pagination: {
      page: initialPage,
      size: initialSize,
      totalPages: 0,
      totalElements: 0
    }
  });

  const fetchArticles = useCallback(async (page = 0, size = 10) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.getPublishedArticles(page, size);
      setState(prev => ({
        ...prev,
        articles: response.content,
        loading: false,
        pagination: {
          page: response.number,
          size: response.size,
          totalPages: response.totalPages,
          totalElements: response.totalElements
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors du chargement des articles'
      }));
    }
  }, []);

  const searchArticles = async (keyword, page = 0, size = 10) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.searchArticles(keyword, page, size);
      setState(prev => ({
        ...prev,
        articles: response.content,
        loading: false,
        pagination: {
          page: response.number,
          size: response.size,
          totalPages: response.totalPages,
          totalElements: response.totalElements
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la recherche'
      }));
    }
  };

  const goToPage = (page) => {
    fetchArticles(page, state.pagination.size);
  };

  const refresh = () => {
    fetchArticles(state.pagination.page, state.pagination.size);
  };

  useEffect(() => {
    fetchArticles(initialPage, initialSize);
  }, [fetchArticles, initialPage, initialSize]);

  return {
    ...state,
    fetchArticles,
    searchArticles,
    goToPage,
    refresh
  };
};

// ==========================================
// HOOK POUR UN ARTICLE SPÉCIFIQUE
// ==========================================

export const useArticle = (id) => {
  const [state, setState] = useState({
    article: null,
    loading: false,
    error: null
  });

  const fetchArticle = useCallback(async () => {
    if (!id) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.getArticleById(id);
      setState({
        article: response,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        article: null,
        loading: false,
        error: error.message || 'Erreur lors du chargement de l\'article'
      });
    }
  }, [id]);

  const updateArticle = async (articleData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.updateArticle(id, articleData);
      setState(prev => ({
        ...prev,
        article: response,
        loading: false
      }));
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la mise à jour'
      }));
      throw error;
    }
  };

  const deleteArticle = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await articleService.deleteArticle(id);
      setState({
        article: null,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la suppression'
      }));
      throw error;
    }
  };

  const togglePublishStatus = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.togglePublishStatus(id);
      setState(prev => ({
        ...prev,
        article: response,
        loading: false
      }));
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors du changement de statut'
      }));
      throw error;
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return {
    ...state,
    refresh: fetchArticle,
    updateArticle,
    deleteArticle,
    togglePublishStatus
  };
};

// ==========================================
// HOOK POUR MES ARTICLES
// ==========================================

export const useMyArticles = (initialPage = 0, initialSize = 10) => {
  const [state, setState] = useState({
    articles: [],
    loading: false,
    error: null,
    pagination: {
      page: initialPage,
      size: initialSize,
      totalPages: 0,
      totalElements: 0
    }
  });

  const fetchMyArticles = useCallback(async (page = 0, size = 10) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.getMyArticles(page, size);
      setState(prev => ({
        ...prev,
        articles: response.content,
        loading: false,
        pagination: {
          page: response.number,
          size: response.size,
          totalPages: response.totalPages,
          totalElements: response.totalElements
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors du chargement de vos articles'
      }));
    }
  }, []);

  const createArticle = async (articleData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.createArticle(articleData);
      // Recharger la liste après création
      await fetchMyArticles(state.pagination.page, state.pagination.size);
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la création de l\'article'
      }));
      throw error;
    }
  };

  const goToPage = (page) => {
    fetchMyArticles(page, state.pagination.size);
  };

  const refresh = () => {
    fetchMyArticles(state.pagination.page, state.pagination.size);
  };

  useEffect(() => {
    fetchMyArticles(initialPage, initialSize);
  }, [fetchMyArticles, initialPage, initialSize]);

  return {
    ...state,
    fetchMyArticles,
    createArticle,
    goToPage,
    refresh
  };
};

// ==========================================
// HOOK POUR LES COMMENTAIRES
// ==========================================

export const useComments = (articleId, initialPage = 0, initialSize = 10) => {
  const [state, setState] = useState({
    comments: [],
    loading: false,
    error: null,
    pagination: {
      page: initialPage,
      size: initialSize,
      totalPages: 0,
      totalElements: 0
    }
  });

  const fetchComments = useCallback(async (page = 0, size = 10) => {
    if (!articleId) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await commentService.getArticleComments(articleId, page, size);
      setState(prev => ({
        ...prev,
        comments: response.content,
        loading: false,
        pagination: {
          page: response.number,
          size: response.size,
          totalPages: response.totalPages,
          totalElements: response.totalElements
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors du chargement des commentaires'
      }));
    }
  }, [articleId]);

  const createComment = async (commentData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await commentService.createComment({
        ...commentData,
        articleId
      });
      // Recharger les commentaires après création
      await fetchComments(state.pagination.page, state.pagination.size);
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la création du commentaire'
      }));
      throw error;
    }
  };

  const updateComment = async (commentId, commentData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await commentService.updateComment(commentId, {
        ...commentData,
        articleId
      });
      // Recharger les commentaires après mise à jour
      await fetchComments(state.pagination.page, state.pagination.size);
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la mise à jour du commentaire'
      }));
      throw error;
    }
  };

  const deleteComment = async (commentId) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await commentService.deleteComment(commentId);
      // Recharger les commentaires après suppression
      await fetchComments(state.pagination.page, state.pagination.size);
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la suppression du commentaire'
      }));
      throw error;
    }
  };

  const goToPage = (page) => {
    fetchComments(page, state.pagination.size);
  };

  const refresh = () => {
    fetchComments(state.pagination.page, state.pagination.size);
  };

  useEffect(() => {
    fetchComments(initialPage, initialSize);
  }, [fetchComments, initialPage, initialSize]);

  return {
    ...state,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    goToPage,
    refresh
  };
};

// ==========================================
// HOOK POUR MES COMMENTAIRES
// ==========================================

export const useMyComments = (initialPage = 0, initialSize = 10) => {
  const [state, setState] = useState({
    comments: [],
    loading: false,
    error: null,
    pagination: {
      page: initialPage,
      size: initialSize,
      totalPages: 0,
      totalElements: 0
    }
  });

  const fetchMyComments = useCallback(async (page = 0, size = 10) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await commentService.getMyComments(page, size);
      setState(prev => ({
        ...prev,
        comments: response.content,
        loading: false,
        pagination: {
          page: response.number,
          size: response.size,
          totalPages: response.totalPages,
          totalElements: response.totalElements
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors du chargement de vos commentaires'
      }));
    }
  }, []);

  const goToPage = (page) => {
    fetchMyComments(page, state.pagination.size);
  };

  const refresh = () => {
    fetchMyComments(state.pagination.page, state.pagination.size);
  };

  useEffect(() => {
    fetchMyComments(initialPage, initialSize);
  }, [fetchMyComments, initialPage, initialSize]);

  return {
    ...state,
    fetchMyComments,
    goToPage,
    refresh
  };
};
