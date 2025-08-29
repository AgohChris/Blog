import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthContext as useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from '@/components/ui/use-toast';
import ArticleCard from '@/components/article/ArticleCard';
import { useMyArticles } from '@/hooks/useApi';
import { articleService } from '@/services/apiService';
import {
  PenTool,
  Eye,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Plus,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { articles, loading, error, pagination, goToPage, refresh } = useMyArticles();

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      await articleService.deleteArticle(articleId);
      toast({ title: 'Article supprimé', description: 'L\'article a été supprimé avec succès.' });
      refresh();
    } catch (error) {
      toast({ title: 'Erreur', description: error.message || 'Impossible de supprimer l\'article.', variant: 'destructive' });
    }
  };

  const stats = {
    totalArticles: pagination?.totalElements || 0,
    totalViews: articles.reduce((sum, article) => sum + (article.views || 0), 0),
    totalComments: articles.reduce((sum, article) => sum + article.commentsCount, 0),
  };

  if (loading && !articles.length) {
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
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenue, {user?.username} !</h1>
          <p className="text-muted-foreground">Gérez vos articles et consultez vos statistiques</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Articles</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalArticles}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Vues</CardTitle><Eye className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalViews}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Commentaires</CardTitle><MessageCircle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalComments}</div></CardContent></Card>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
          <Card>
            <CardHeader><CardTitle>Actions rapides</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/create-article"><Button><Plus className="mr-2 h-4 w-4" />Nouvel article</Button></Link>
                <Link to="/statistics"><Button variant="outline"><TrendingUp className="mr-2 h-4 w-4" />Voir les statistiques</Button></Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader><CardTitle>Mes articles</CardTitle></CardHeader>
            <CardContent>
              {error && <p className="text-destructive text-center">{error}</p>}
              {loading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}
              {!loading && !articles.length && !error ? (
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
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <Button onClick={() => goToPage(pagination.page - 1)} disabled={pagination.first}>Précédent</Button>
                  <Button onClick={() => goToPage(pagination.page + 1)} disabled={pagination.last}>Suivant</Button>
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
