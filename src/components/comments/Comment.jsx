import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import CommentActions from '@/components/comments/CommentActions';
import CommentForm from '@/components/comments/CommentForm';

const Comment = ({ comment, index, user, isAuthenticated, onEdit, onDelete, onUpdate }) => {
  const [editing, setEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(comment.content);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleEdit = () => {
    setEditing(true);
    setEditText(comment.content);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleUpdate = () => {
    onUpdate(comment.id, editText);
    setEditing(false);
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
          <span className="font-semibold text-foreground">{comment.author.username}</span>
          <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>
          {comment.updatedAt && <Badge variant="secondary" className="text-xs">Modifié</Badge>}
        </div>
        {isAuthenticated && user?.id === comment.author.id && (
          <CommentActions onEdit={handleEdit} onDelete={() => onDelete(comment.id)} />
        )}
      </div>
      
      {editing ? (
        <CommentForm
          isEditing
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onSave={handleUpdate}
          onCancel={handleCancel}
        />
      ) : (
        <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
      )}
    </motion.div>
  );
};

export default Comment;