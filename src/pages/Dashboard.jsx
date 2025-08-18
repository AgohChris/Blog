import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import ArticleCard from '@/components/article/ArticleCard';
import { 
  PenTool, 
  Eye, 
  TrendingUp,
  BookOpen,
  MessageCircle,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({ totalArticles: 0, totalViews: 0, totalComments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserArticles();
  }, []);

  const fetchUserArticles = () => {
    try {
      const mockUserArticles = [
        { id: 1, title: "Mon premier article sur React", content: "...", createdAt: "2024-01-15T10:30:00Z", views: 125, comments: 8, status: "published" },
        { id: 2, title: "Guide pratique de TailwindCSS", content: "...", createdAt: "2024-01-12T14:20:00Z", views: 89, comments: 5, status: "published" },
        { id: 3, title: "Brouillon: Les nouveautés JavaScript 2024", content: "...", createdAt: "2024-01-10T09:15:00Z", views: 0, comments: 0, status: "draft" }
      ];
      
      const localArticles = JSON.parse(localStorage.getItem('userArticles') || '[]');
      const allArticles = [...mockUserArticles.filter(a => !localArticles.find(la => la.id === a.id)), ...localArticles];
      
      setArticles(allArticles);
      
      const totalViews = allArticles.reduce((sum, article) => sum + article.views, 0);
      const totalComments = allArticles.reduce((sum, article) => sum + article.comments, 0);
      
      setStats({
        totalArticles: allArticles.filter(a => a.status === 'published').length,
        totalViews,
        totalComments,
      });
      
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de charger vos articles.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const updatedArticles = articles.filter(article => article.id !== articleId);
      setArticles(updatedArticles);
      localStorage.setItem('userArticles', JSON.stringify(updatedArticles));
      toast({ title: 'Article supprimé', description: 'L\'article a été supprimé avec succès.' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer l\'article.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>Dashboard - MiniBlog</title>
        <meta name="description" content="Gérez vos articles et consultez vos statistiques." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenue, {user?.username} !</h1>
          <p className="text-muted-foreground">Gérez vos articles et consultez vos statistiques</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Articles publiés</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.totalArticles}</div></CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Vues totales</CardTitle><Eye className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.totalViews}</div></CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Commentaires</CardTitle><MessageCircle className="h-4 w-4 text-muted-foreground" /></CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.totalComments}</div></CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
          <Card>
            <CardHeader><CardTitle>Actions rapides</CardTitle><CardDescription>Créez du nouveau contenu ou gérez vos articles.</CardDescription></CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/create-article"><Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />Nouvel article</Button></Link>
                <Link to="/statistics"><Button variant="outline"><TrendingUp className="mr-2 h-4 w-4" />Voir les statistiques</Button></Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader><CardTitle>Mes articles</CardTitle><CardDescription>Gérez et modifiez vos publications.</CardDescription></CardHeader>
            <CardContent>
              {articles.length === 0 ? (
                <div className="text-center py-8">
                  <PenTool className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Aucun article pour le moment</h3>
                  <Link to="/create-article"><Button className="mt-4"><Plus className="mr-2 h-4 w-4" />Créer un article</Button></Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article, index) => (
                    <ArticleCard key={article.id} article={article} index={index} onDelete={handleDeleteArticle} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;