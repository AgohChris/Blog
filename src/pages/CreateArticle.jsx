
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { PenTool, Save, Eye, ArrowLeft } from 'lucide-react';

const CreateArticle = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Simuler la création d'un article
      const newArticle = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        author: user,
        createdAt: new Date().toISOString(),
        views: 0,
        comments: 0,
      };

      // Sauvegarder dans localStorage pour la démo
      const existingArticles = JSON.parse(localStorage.getItem('userArticles') || '[]');
      existingArticles.push(newArticle);
      localStorage.setItem('userArticles', JSON.stringify(existingArticles));

      toast({
        title: 'Article créé !',
        description: 'Votre article a été publié avec succès.',
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'article.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    // Sauvegarder en tant que brouillon
    const draft = {
      ...formData,
      id: Date.now(),
      status: 'draft',
      author: user,
      createdAt: new Date().toISOString(),
    };

    const existingDrafts = JSON.parse(localStorage.getItem('userDrafts') || '[]');
    existingDrafts.push(draft);
    localStorage.setItem('userDrafts', JSON.stringify(existingDrafts));

    toast({
      title: 'Brouillon sauvegardé',
      description: 'Votre brouillon a été sauvegardé.',
    });
  };

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>Créer un article - MiniBlog</title>
        <meta name="description" content="Créez et publiez un nouvel article sur MiniBlog. Partagez vos idées avec la communauté." />
        <meta property="og:title" content="Créer un article - MiniBlog" />
        <meta property="og:description" content="Créez et publiez un nouvel article sur MiniBlog. Partagez vos idées avec la communauté." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Créer un nouvel article
          </h1>
          <p className="text-muted-foreground">
            Partagez vos idées et connaissances avec la communauté
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  {preview ? 'Aperçu de l\'article' : 'Rédiger l\'article'}
                </CardTitle>
                <CardDescription>
                  {preview ? 'Voici comment votre article apparaîtra aux lecteurs' : 'Rédigez le contenu de votre article'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!preview ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre de l'article</Label>
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        required
                        placeholder="Entrez le titre de votre article..."
                        value={formData.title}
                        onChange={handleChange}
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Contenu</Label>
                      <Textarea
                        id="content"
                        name="content"
                        required
                        placeholder="Rédigez le contenu de votre article..."
                        value={formData.content}
                        onChange={handleChange}
                        className="min-h-[400px] resize-none"
                      />
                      <p className="text-sm text-muted-foreground">
                        {formData.content.length} caractères
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Publication...
                          </div>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Publier l'article
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={!formData.title.trim() && !formData.content.trim()}
                      >
                        Sauvegarder en brouillon
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-4">
                        {formData.title || 'Titre de l\'article'}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <span>Par {user?.username}</span>
                        <span>•</span>
                        <span>{new Date().toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    
                    <div className="article-content prose prose-slate dark:prose-invert max-w-none">
                      {formData.content ? (
                        <div className="whitespace-pre-wrap">
                          {formData.content}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
                          Le contenu de votre article apparaîtra ici...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Preview Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aperçu</CardTitle>
                <CardDescription>
                  Visualisez votre article avant publication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant={preview ? "default" : "outline"}
                  onClick={() => setPreview(!preview)}
                  className="w-full"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {preview ? 'Mode édition' : 'Aperçu'}
                </Button>
              </CardContent>
            </Card>

            {/* Writing Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conseils de rédaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <h4 className="font-semibold mb-1">Titre accrocheur</h4>
                  <p className="text-muted-foreground">
                    Choisissez un titre clair et engageant
                  </p>
                </div>
                <div className="text-sm">
                  <h4 className="font-semibold mb-1">Structure claire</h4>
                  <p className="text-muted-foreground">
                    Organisez votre contenu avec des paragraphes
                  </p>
                </div>
                <div className="text-sm">
                  <h4 className="font-semibold mb-1">Longueur optimale</h4>
                  <p className="text-muted-foreground">
                    Visez 300-1000 mots pour un bon engagement
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Article Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mots:</span>
                  <span className="font-medium">
                    {formData.content.split(/\s+/).filter(word => word.length > 0).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Caractères:</span>
                  <span className="font-medium">{formData.content.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Temps de lecture:</span>
                  <span className="font-medium">
                    {Math.max(1, Math.ceil(formData.content.split(/\s+/).length / 200))} min
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
