import React from 'react';

const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
      }
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return <p key={index} className="font-semibold mb-3">{paragraph.replace(/\*\*/g, '')}</p>;
      }
      if (paragraph.startsWith('```') || paragraph.endsWith('```')) {
        return null;
      }
      if (paragraph.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
    });
};

const ArticleContent = ({ content }) => {
  return (
    <div className="article-content prose prose-slate dark:prose-invert max-w-none">
      {formatContent(content)}
    </div>
  );
};

export default ArticleContent;