import React from 'react';
import Comment from '@/components/comments/Comment';
import { MessageCircle } from 'lucide-react';

const CommentList = ({ comments, user, isAuthenticated, onEdit, onDelete, onUpdate }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment, index) => (
        <Comment
          key={comment.id}
          comment={comment}
          index={index}
          user={user}
          isAuthenticated={isAuthenticated}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default CommentList;