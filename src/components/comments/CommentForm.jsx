import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

const CommentForm = ({ isEditing, value, onChange, onSubmit, onSave, onCancel, submitting }) => {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <Textarea
          value={value}
          onChange={onChange}
          className="min-h-[80px]"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={onSave}>Sauvegarder</Button>
          <Button size="sm" variant="outline" onClick={onCancel}>Annuler</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Textarea
        placeholder="Ajoutez votre commentaire..."
        value={value}
        onChange={onChange}
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={submitting || !value.trim()}>
        {submitting ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Publication...
          </div>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Publier le commentaire
          </>
        )}
      </Button>
    </form>
  );
};

export default CommentForm;