import React from 'react';
import { Calendar, Eye, MessageCircle } from 'lucide-react';

const ArticleInfo = ({ date, views, comments }) => {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        {date}
      </div>
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        {views} vues
      </div>
      <div className="flex items-center gap-1">
        <MessageCircle className="h-4 w-4" />
        {comments} commentaires
      </div>
    </div>
  );
};

export default ArticleInfo;