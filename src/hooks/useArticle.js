import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};

export const useArticle = (articleId) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userArticles, setUserArticles] = useLocalStorage('userArticles', []);
  const [allArticlesData, setAllArticlesData] = useLocalStorage('allArticles', []);

  useEffect(() => {
    const fetchArticle = () => {
      try {
        const mockArticles = [
          { id: 1, title: "Introduction à React et ses hooks", content: `React est une bibliothèque JavaScript populaire...`, author: { id: 1, username: "Alice Dupont" }, createdAt: "2024-01-15T10:30:00Z", views: 245, likes: 18, dislikes: 2 },
          { id: 2, title: "Guide complet de TailwindCSS", content: `TailwindCSS est un framework CSS utility-first...`, author: { id: 2, username: "Bob Martin" }, createdAt: "2024-01-14T14:20:00Z", views: 189, likes: 12, dislikes: 1 },
          { id: 3, title: "Brouillon: Les nouveautés JavaScript 2024", content: "Un aperçu des nouvelles fonctionnalités JavaScript...", author: { id: 1, username: "Alice Dupont" }, createdAt: "2024-01-10T09:15:00Z", views: 0, comments: 0, status: "draft", likes: 0, dislikes: 0 }
        ];

        let allArticles;
        if(allArticlesData.length === 0) {
            allArticles = [...mockArticles, ...userArticles];
            setAllArticlesData(allArticles);
        } else {
            const userArticlesIds = userArticles.map(a => a.id);
            const baseArticles = allArticlesData.filter(a => !userArticlesIds.includes(a.id));
            allArticles = [...baseArticles, ...userArticles];
        }

        const foundArticle = allArticles.find(a => a.id === parseInt(articleId));
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          toast({ title: 'Article non trouvé', variant: 'destructive' });
          navigate('/dashboard');
        }
      } catch (error) {
        toast({ title: 'Erreur', description: 'Impossible de charger l\'article.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    } else {
      setLoading(false);
    }
  }, [articleId, navigate, userArticles, allArticlesData, setAllArticlesData]);

  const updateArticle = (updatedArticle) => {
      setArticle(updatedArticle);
      
      const updateUserArticles = (prev) => prev.map(a => a.id === updatedArticle.id ? updatedArticle : a);
      const updateAllArticles = (prev) => prev.map(a => a.id === updatedArticle.id ? updatedArticle : a);

      setUserArticles(updateUserArticles);
      setAllArticlesData(updateAllArticles);
  }

  return { article, loading, setArticle: updateArticle };
};