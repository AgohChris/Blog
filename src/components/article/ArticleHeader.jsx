import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuthContext as useAuth } from '@/contexts/AuthContext.jsx';
import { Calendar, User, Eye, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

const ArticleHeader = ({ article, formatDate }) => {
  const { isAuthenticated } = useAuth();

  const handleVote = () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour voter.",
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Fonctionnalité non disponible", description: "Le vote n'est pas encore implémenté." });
  };

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        {article.title}
      </h1>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {article.authorUsername || 'Auteur inconnu'}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(article.createdAt)}
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {article.commentsCount} commentaires
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={'ghost'} 
            size="sm"
            onClick={handleVote}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            {/* {article.likes || 0} */}
          </Button>
          <Button 
            variant={'ghost'} 
            size="sm"
            onClick={handleVote}
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            {/* {article.dislikes || 0} */}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ArticleHeader;
