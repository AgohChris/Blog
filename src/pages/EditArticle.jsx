import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useArticle } from '@/hooks/useArticle';
import { Save, ArrowLeft, PenTool } from 'lucide-react';

const EditArticle = () => {
  const { id } = useParams();
  const { article, loading: articleLoading, setArticle } = useArticle(id);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (article) {
      if (article.author.id !== user?.id) {
        toast({ title: "Accès non autorisé", description: "Vous ne pouvez pas modifier cet article.", variant: "destructive" });
        navigate('/dashboard');
      }
      setFormData({ title: article.title, content: article.content });
    }
  }, [article, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez remplir tous les champs.', variant: 'destructive' });
      return;
    }
    setLoading(true);

    try {
      const updatedArticle = { ...article, ...formData, updatedAt: new Date().toISOString() };
      
      const localArticles = JSON.parse(localStorage.getItem('userArticles') || '[]');
      const updatedArticles = localArticles.map(a => a.id === updatedArticle.id ? updatedArticle : a);
      localStorage.setItem('userArticles', JSON.stringify(updatedArticles));
      
      setArticle(updatedArticle);
      
      toast({ title: 'Article modifié !', description: 'Votre article a été mis à jour avec succès.' });
      navigate('/dashboard');
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de modifier l\'article.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (articleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>Modifier l'article - MiniBlog</title>
        <meta name="description" content="Modifiez votre article sur MiniBlog." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Modifier l'article</h1>
          <p className="text-muted-foreground">Apportez des modifications à votre publication.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><PenTool className="h-5 w-5" />Édition</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input id="title" name="title" type="text" required value={formData.title} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Contenu</Label>
                  <Textarea id="content" name="content" required value={formData.content} onChange={handleChange} className="min-h-[400px]" />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Sauvegarde...' : <><Save className="mr-2 h-4 w-4" />Sauvegarder les modifications</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EditArticle;