
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowLeft,
  Eye, 
  MessageCircle, 
  ThumbsUp,
  BarChart2,
  List
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Simuler des données statistiques
      const mockStats = {
        totalViews: 8540,
        totalComments: 320,
        totalLikes: 1250,
        mostViewedArticle: {
          title: 'Guide pratique de TailwindCSS',
          views: 1250,
        },
        mostCommentedArticle: {
          title: 'Introduction à React et ses hooks',
          comments: 45,
        },
        viewsPerMonth: [
          { month: 'Jan', views: 1200 },
          { month: 'Fév', views: 1800 },
          { month: 'Mar', views: 1500 },
          { month: 'Avr', views: 2200 },
          { month: 'Mai', views: 1840 },
        ],
        articles: [
            { id: 1, title: 'Mon premier article sur React', views: 125, comments: 8, likes: 25 },
            { id: 2, title: 'Guide pratique de TailwindCSS', views: 89, comments: 5, likes: 15 },
            { id: 4, title: 'Créer une API REST avec Node.js', views: 156, comments: 12, likes: 32 },
        ]
      };
      
      setStats(mockStats);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les statistiques.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Vues par mois',
      },
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
  };

  const chartData = {
    labels: stats?.viewsPerMonth.map(d => d.month) || [],
    datasets: [
      {
        label: 'Vues',
        data: stats?.viewsPerMonth.map(d => d.views) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      },
    ],
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
        <title>Statistiques - MiniBlog</title>
        <meta name="description" content="Consultez les statistiques détaillées de vos articles." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Statistiques</h1>
            <p className="text-muted-foreground">Analyse des performances de vos articles.</p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Vues totales</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Commentaires</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalComments.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Likes</CardTitle>
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><BarChart2 className="mr-2 h-5 w-5"/>Performance mensuelle</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                      <Bar options={chartOptions} data={chartData} />
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* Articles Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><List className="mr-2 h-5 w-5"/>Détails par article</CardTitle>
              <CardDescription>Performance individuelle de chaque article publié.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between"
                  >
                    <p className="font-semibold text-foreground flex-1 mb-2 md:mb-0">{article.title}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="h-4 w-4"/> {article.views}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4"/> {article.comments}</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4"/> {article.likes}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Statistics;
