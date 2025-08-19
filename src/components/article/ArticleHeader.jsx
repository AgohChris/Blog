import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, User, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';

const ArticleHeader = ({ article, formatDate, onVote }) => {
  const { isAuthenticated } = useAuth();
  const [voteStatus, setVoteStatus] = useState(null); // 'liked', 'disliked', or null

  useEffect(() => {
    // This is a simple simulation of fetching user's vote status for this article
    const userVote = localStorage.getItem(`vote_article_${article.id}`);
    if (userVote) {
      setVoteStatus(userVote);
    }
  }, [article.id]);

  const handleVote = (type) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour voter.",
        variant: "destructive",
      });
      return;
    }

    let newVoteStatus = voteStatus;

    if (voteStatus === type) {
      // User is un-voting
      newVoteStatus = null;
    } else {
      // User is voting or changing vote
      newVoteStatus = type;
    }

    setVoteStatus(newVoteStatus);
    localStorage.setItem(`vote_article_${article.id}`, newVoteStatus || '');
    onVote(type, voteStatus); // Pass current vote status to calculate changes
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {article.author.username}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(article.createdAt)}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {article.views} vues
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={voteStatus === 'liked' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => handleVote('liked')}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            {article.likes}
          </Button>
          <Button 
            variant={voteStatus === 'disliked' ? 'destructive' : 'ghost'} 
            size="sm"
            onClick={() => handleVote('disliked')}
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            {article.dislikes}
          </Button>
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        {article.title}
      </h1>
    </>
  );
};

export default ArticleHeader;