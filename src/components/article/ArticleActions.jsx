import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

const ArticleActions = ({ article, onDelete }) => {
  return (
    <div className="flex items-center gap-2">
      <Link to={`/article/${article.id}`}>
        <Button variant="ghost" size="sm" aria-label={`Voir l'article ${article.title}`}>
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Link to={`/edit-article/${article.id}`}>
        <Button variant="ghost" size="sm" aria-label={`Modifier l'article ${article.title}`}>
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(article.id)}
        className="text-red-500 hover:text-red-600"
        aria-label={`Supprimer l'article ${article.title}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ArticleActions;