import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuthContext as useAuth } from '@/contexts/AuthContext.jsx';
import { useArticles } from '@/hooks/useApi';
import { 
  Calendar, 
  User, 
  Eye, 
  Search, 
  BookOpen,
  TrendingUp,
  Clock,
  ArrowRight,
  PenTool,
  MessageSquare
} from 'lucide-react';

const Home = () => {
  const { articles, loading, error, pagination, goToPage, searchArticles } = useArticles();
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();
  const articlesSectionRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchArticles(searchTerm);
      } else {
        goToPage(0);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
  const scrollToArticles = () => {
    articlesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading && !articles.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>MiniBlog - Accueil</title>
        <meta name="description" content="Découvrez les derniers articles de notre communauté de développeurs et créateurs de contenu." />
      </Helmet>

      {/* Hero Section */}
      <section className="gradient-bg text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Bienvenue sur MiniBlog
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Découvrez, partagez et explorez des articles passionnants écrits par notre communauté
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={isAuthenticated ? "/create-article" : "/register"}>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <PenTool className="mr-2 h-5 w-5" />
                  Commencer à écrire
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-primary hover:bg-gray dark:text-white dark:hover:bg-white/10" onClick={scrollToArticles}>
                <BookOpen className="mr-2 h-5 w-5" />
                Explorer les articles
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">{pagination?.totalElements || 0}</h3>
              <p className="text-muted-foreground">Articles publiés</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">50+</h3>
              <p className="text-muted-foreground">Auteurs actifs</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">10k+</h3>
              <p className="text-muted-foreground">Lectures mensuelles</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section ref={articlesSectionRef} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Articles récents</h2>
              <p className="text-muted-foreground">Découvrez les dernières publications de notre communauté</p>
            </div>
            
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher des articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-80"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-destructive text-center">{error}</p>}

          {!loading && !articles.length && !error && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Aucun article trouvé</h3>
              <p className="text-muted-foreground">Essayez de modifier vos critères de recherche ou revenez plus tard.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(article.publishedAt || article.createdAt)}
                      </Badge>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {article.commentsCount}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {article.authorUsername}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
                      {truncateContent(article.contenu)}
                    </p>
                    <Link to={`/articles/${article.id}`} className="mt-auto">
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Lire l'article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12 space-x-2">
              <Button
                variant="outline"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.first}
              >
                Précédent
              </Button>
              
              {[...Array(pagination.totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant={pagination.page === index ? "default" : "outline"}
                  onClick={() => goToPage(index)}
                  className="w-10"
                >
                  {index + 1}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.last}
              >
                Suivant
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
