import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import ArticleInfo from '@/components/article/ArticleInfo';
import ArticleActions from '@/components/article/ArticleActions';

const ArticleCard = ({ article, index, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-foreground">
            {article.title}
          </h3>
          <Badge variant={article.published ? 'default' : 'secondary'}>
            {article.published ? 'Publié' : 'Brouillon'}
          </Badge>
        </div>
        <ArticleInfo 
          date={formatDate(article.createdAt)}
          views={article.views || 0}
          comments={article.commentsCount}
        />
      </div>
      
      <ArticleActions article={article} onDelete={onDelete} />
    </motion.div>
  );
};

export default ArticleCard;
