import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import CommentList from '@/components/comments/CommentList';
import CommentForm from '@/components/comments/CommentForm';
import { MessageCircle } from 'lucide-react';

const CommentsSection = ({ comments: initialComments, articleId }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const newCommentData = {
        id: Date.now(), content: newComment, author: user, createdAt: new Date().toISOString(), articleId: parseInt(articleId)
      };
      setComments([...comments, newCommentData]);
      setNewComment('');
      toast({ title: 'Commentaire ajouté', description: 'Votre commentaire a été publié.' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible d\'ajouter le commentaire.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (commentId, content) => {
    try {
      const updatedComments = comments.map(c => c.id === commentId ? { ...c, content, updatedAt: new Date().toISOString() } : c);
      setComments(updatedComments);
      toast({ title: 'Commentaire modifié', description: 'Votre commentaire a été mis à jour.' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de modifier le commentaire.', variant: 'destructive' });
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return;
    try {
      setComments(comments.filter(c => c.id !== commentId));
      toast({ title: 'Commentaire supprimé', description: 'Le commentaire a été supprimé.' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer le commentaire.', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          Commentaires ({comments.length})
        </h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAuthenticated ? (
          <CommentForm
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        ) : (
          <div className="text-center py-8 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground mb-4">Connectez-vous pour laisser un commentaire</p>
            <Button onClick={() => navigate('/login')}>Se connecter</Button>
          </div>
        )}
        {comments.length > 0 && <Separator />}
        <CommentList
          comments={comments}
          user={user}
          isAuthenticated={isAuthenticated}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default CommentsSection;