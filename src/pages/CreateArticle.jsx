import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuthContext as useAuth } from '@/contexts/AuthContext.jsx';
import { useMyArticles } from '@/hooks/useApi';
import { toast } from '@/components/ui/use-toast';
import { PenTool, Save, Eye, ArrowLeft, Loader2 } from 'lucide-react';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [contenu, setContenu] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(true);
  const [preview, setPreview] = useState(false);
  
  const { createArticle, loading } = useMyArticles();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (isPublished) => {
    if (!title.trim() || !contenu.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le titre et le contenu sont requis.',
        variant: 'destructive',
      });
      return;
    }

    const articleData = {
      title,
      contenu,
      published: isPublished,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    try {
      await createArticle(articleData);
      toast({
        title: isPublished ? 'Article publié !' : 'Brouillon sauvegardé !',
        description: isPublished 
          ? 'Votre article est maintenant visible par la communauté.'
          : 'Votre brouillon a été sauvegardé avec succès.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Erreur de création',
        description: error.message || 'Une erreur est survenue.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>Créer un article - MiniBlog</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Retour au dashboard
          </Button>
          <h1 className="text-3xl font-bold">Créer un nouvel article</h1>
          <p className="text-muted-foreground">Partagez vos idées avec la communauté.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  {preview ? 'Aperçu' : 'Éditeur'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {preview ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <h1>{title || 'Titre de l\'article'}</h1>
                    <div dangerouslySetInnerHTML={{ __html: contenu.replace(/\n/g, '<br />') || '<p>Contenu de l\'article...</p>' }} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre</Label>
                      <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de votre article" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contenu">Contenu</Label>
                      <Textarea id="contenu" value={contenu} onChange={(e) => setContenu(e.target.value)} placeholder="Écrivez votre article ici..." rows={15} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                      <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ex: react, javascript, webdev" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => handleSubmit(published)} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {published ? 'Publier' : 'Sauvegarder le brouillon'}
                </Button>
                {!published && (
                  <Button onClick={() => handleSubmit(false)} variant="outline" disabled={loading} className="w-full">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Sauvegarder en brouillon
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;