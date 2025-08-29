import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import CommentActions from '@/components/comments/CommentActions';
import CommentForm from '@/components/comments/CommentForm';

const Comment = ({ comment, index, user, isAuthenticated, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleUpdate = (content) => {
    onUpdate(comment.id, content);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border rounded-lg p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{comment.authorUsername}</span>
          <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>
          {comment.updatedAt && comment.createdAt !== comment.updatedAt && <Badge variant="secondary" className="text-xs">Modifié</Badge>}
        </div>
        {isAuthenticated && user?.username === comment.authorUsername && (
          <CommentActions onEdit={() => setIsEditing(true)} onDelete={() => onDelete(comment.id)} />
        )}
      </div>
      
      {isEditing ? (
        <CommentForm
          isEditing
          initialValue={comment.contenu}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <p className="text-foreground whitespace-pre-wrap">{comment.contenu}</p>
      )}
    </motion.div>
  );
};

export default Comment;
