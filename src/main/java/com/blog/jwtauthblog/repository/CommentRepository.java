package com.blog.jwtauthblog.repository;

import com.blog.jwtauthblog.entity.Article;
import com.blog.jwtauthblog.entity.Comment;
import com.blog.jwtauthblog.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByArticleOrderByCreatedAtAsc(Article article, Pageable pageable);

    Page<Comment> findByAuthorOrderByCreatedAtDesc(User author, Pageable pageable);

    long countByArticle(Article article);

    List<Comment> findByArticleAndParentIsNullOrderByCreatedAtAsc(Article article);

//    Trouver les réponses à un commentaire
    List<Comment> findByParentOrderByCreatedAtAsc(Comment parent);

    boolean existsByIdAndAuthor(Long id, User author);

    @Query("SELECT c FROM Comment c ORDER BY c.createdAt DESC")
    List<Comment> findRecentComments(Pageable pageable);
}