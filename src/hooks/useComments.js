import { useState, useEffect } from 'react';

export const useComments = (articleId) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = () => {
      const mockComments = [
        { id: 1, content: "Excellent article !", author: { id: 3, username: "Claire Rousseau" }, createdAt: "2024-01-15T12:30:00Z", articleId: 1 },
        { id: 2, content: "Merci pour ce guide clair.", author: { id: 4, username: "David Leroy" }, createdAt: "2024-01-15T14:45:00Z", articleId: 1 },
        { id: 3, content: "Très bon tutoriel sur TailwindCSS.", author: { id: 5, username: "Emma Moreau" }, createdAt: "2024-01-14T16:20:00Z", articleId: 2 }
      ];
      const articleComments = mockComments.filter(c => c.articleId === parseInt(articleId));
      setComments(articleComments);
    };

    if(articleId) {
        fetchComments();
    }
  }, [articleId]);

  return { comments, setComments };
};