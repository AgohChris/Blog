import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ArticleHeader from '@/components/article/ArticleHeader';
import ArticleContent from '@/components/article/ArticleContent';
import CommentsSection from '@/components/comments/CommentsSection';
import { useArticle } from '@/hooks/useArticle';
import { useComments } from '@/hooks/useComments';
import { ArrowLeft } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { article, loading: articleLoading, setArticle } = useArticle(id);
  const { comments } = useComments(id);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleVote = (voteType, currentVoteStatus) => {
    if (!article) return;

    let { likes, dislikes } = article;

    if (voteType === 'liked') {
      if (currentVoteStatus === 'liked') {
        likes -= 1; // Unlike
      } else {
        likes += 1; // Like
        if (currentVoteStatus === 'disliked') {
          dislikes -= 1; // Remove dislike
        }
      }
    } else if (voteType === 'disliked') {
      if (currentVoteStatus === 'disliked') {
        dislikes -= 1; // Undislike
      } else {
        dislikes += 1; // Dislike
        if (currentVoteStatus === 'liked') {
          likes -= 1; // Remove like
        }
      }
    }
    
    const updatedArticle = { ...article, likes, dislikes };
    setArticle(updatedArticle);
  };


  if (articleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Article non trouvé</h2>
          <Button onClick={() => navigate('/')}><ArrowLeft className="mr-2 h-4 w-4" />Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>{article.title} - MiniBlog</title>
        <meta name="description" content={article.content.substring(0, 160) + '...'} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="mb-8">
            <CardHeader>
              <ArticleHeader article={article} formatDate={formatDate} onVote={handleVote} />
            </CardHeader>
            <CardContent>
              <ArticleContent content={article.content} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <CommentsSection comments={comments} articleId={id} />
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleDetail;