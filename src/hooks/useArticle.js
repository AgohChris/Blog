import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export const useArticle = (articleId) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = () => {
      try {
        const mockArticles = [
          { id: 1, title: "Introduction à React et ses hooks", content: `React est une bibliothèque JavaScript populaire...`, author: { id: 1, username: "Alice Dupont" }, createdAt: "2024-01-15T10:30:00Z", views: 245, likes: 18 },
          { id: 2, title: "Guide complet de TailwindCSS", content: `TailwindCSS est un framework CSS utility-first...`, author: { id: 2, username: "Bob Martin" }, createdAt: "2024-01-14T14:20:00Z", views: 189, likes: 12 },
          { id: 3, title: "Brouillon: Les nouveautés JavaScript 2024", content: "Un aperçu des nouvelles fonctionnalités JavaScript...", author: { id: 1, username: "Alice Dupont" }, createdAt: "2024-01-10T09:15:00Z", views: 0, comments: 0, status: "draft" }
        ];

        const allMockArticles = [
          ...mockArticles,
          ...JSON.parse(localStorage.getItem('userArticles') || '[]')
        ];

        const foundArticle = allMockArticles.find(a => a.id === parseInt(articleId));
        
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
  }, [articleId, navigate]);

  return { article, loading, setArticle };
};