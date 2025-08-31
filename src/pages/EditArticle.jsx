import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuthContext as useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from '@/components/ui/use-toast';
import { useArticle } from '@/hooks/useApi';
import { Save, ArrowLeft, PenTool, Loader2 } from 'lucide-react';

const EditArticle = () => {
  const { id } = useParams();
  const { article, loading: articleLoading, error, updateArticle } = useArticle(id);
  const [title, setTitle] = useState('');
  const [contenu, setContenu] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (article) {
      if (article.authorUsername !== user?.username) {
        toast({ title: "Accès non autorisé", description: "Vous ne pouvez pas modifier cet article.", variant: "destructive" });
        navigate('/dashboard');
      }
      setTitle(article.title);
      setContenu(article.contenu);
      setTags(article.tags?.join(', ') || '');
      setPublished(article.published);
    }
  }, [article, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !contenu.trim()) {
      toast({ title: 'Erreur', description: 'Le titre et le contenu sont requis.', variant: 'destructive' });
      return;
    }

    const articleData = {
      title,
      contenu,
      published,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    try {
      await updateArticle(articleData);
      toast({ title: 'Article modifié !', description: 'Votre article a été mis à jour.' });
      navigate('/dashboard');
    } catch (error) {
      toast({ title: 'Erreur de modification', description: error.message || 'Une erreur est survenue.', variant: 'destructive' });
    }
  };

  if (articleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center text-center">
            <div>
                <h2 className="text-2xl font-bold mb-4">{error}</h2>
                <Button onClick={() => navigate('/')}><ArrowLeft className="mr-2 h-4 w-4" />Retour à l'accueil</Button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>Modifier: {title} - MiniBlog</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 mb-4">
                <ArrowLeft className="h-4 w-4" />
                Retour au dashboard
            </Button>
          <h1 className="text-3xl font-bold">Modifier l'article</h1>
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
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contenu">Contenu</Label>
                  <Textarea id="contenu" value={contenu} onChange={(e) => setContenu(e.target.value)} rows={15} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
                <Button type="submit" disabled={articleLoading}>
                  {articleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Sauvegarder
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
