import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useAuthContext as useAuth } from '@/contexts/AuthContext.jsx';
import CommentList from '@/components/comments/CommentList';
import CommentForm from '@/components/comments/CommentForm';
import { MessageCircle } from 'lucide-react';

const CommentsSection = ({
  comments,
  loading,
  error,
  createComment,
  updateComment,
  deleteComment,
  goToPage,
  pagination
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async (content) => {
    try {
      await createComment({ contenu: content });
      toast({ title: 'Commentaire ajouté', description: 'Votre commentaire a été publié.' });
    } catch (error) {
      toast({ title: 'Erreur', description: error.message || 'Impossible d\'ajouter le commentaire.', variant: 'destructive' });
    }
  };

  const handleUpdate = async (commentId, content) => {
    try {
      await updateComment(commentId, { contenu: content });
      toast({ title: 'Commentaire modifié', description: 'Votre commentaire a été mis à jour.' });
    } catch (error) {
      toast({ title: 'Erreur', description: error.message || 'Impossible de modifier le commentaire.', variant: 'destructive' });
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return;
    try {
      await deleteComment(commentId);
      toast({ title: 'Commentaire supprimé', description: 'Le commentaire a été supprimé.' });
    } catch (error) {
      toast({ title: 'Erreur', description: error.message || 'Impossible de supprimer le commentaire.', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          Commentaires ({pagination?.totalElements || comments.length})
        </h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAuthenticated ? (
          <CommentForm
            onSubmit={handleSubmit}
            submitting={loading}
          />
        ) : (
          <div className="text-center py-8 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground mb-4">Connectez-vous pour laisser un commentaire</p>
            <Button onClick={() => navigate('/login')}>Se connecter</Button>
          </div>
        )}
        
        {loading && <p>Chargement des commentaires...</p>}
        {error && <p className="text-destructive">{error}</p>}

        {comments.length > 0 && <Separator />}
        
        <CommentList
          comments={comments}
          user={user}
          isAuthenticated={isAuthenticated}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <Button 
                key={i} 
                variant={pagination.page === i ? 'default' : 'outline'}
                onClick={() => goToPage(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentsSection;
