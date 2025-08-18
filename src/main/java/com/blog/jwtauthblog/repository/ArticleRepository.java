package com.blog.jwtauthblog.repository;

import com.blog.jwtauthblog.entity.Article;
import com.blog.jwtauthblog.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    //Pour trouver tous les articles publiés
    Page<Article> findByPublishedTrueOrderByPublishedAtDesc(Pageable pageable);

    //    Pour trouver les articles d'un auteur
    Page<Article> findByAuthorOrderByCreatedAtDesc(User author, Pageable pageable);

    //    Pour touver les articles publiés d'un auteur
    Page<Article> findByAuthorAndPublishedTrueOrderByPublishedAtDesc(User author, Pageable pageable);

    //    Rechercher dans les titres et contenus
    @Query("SELECT a FROM Article a WHERE a.published = true AND " +
            "LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Article> findByKeywordInTitle(@Param("keyword") String keyword, Pageable pageable);

    long countByAuthorAndPublishedTrue(User author);

    List<Article> findTop5ByPublishedTrueOrderByPublishedAtDesc();

    boolean existsByIdAndAuthor(Long id, User author);
}