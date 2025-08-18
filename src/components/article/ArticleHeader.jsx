import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Calendar, User, Eye, Heart } from 'lucide-react';

const ArticleHeader = ({ article, formatDate }) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
            variant="ghost" 
            size="sm"
            onClick={() => toast({ title: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀" })}
          >
            <Heart className="h-4 w-4 mr-1" />
            {article.likes}
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