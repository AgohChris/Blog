package com.blog.jwtauthblog.controller;


import com.blog.jwtauthblog.dto.article.ArticleRequest;
import com.blog.jwtauthblog.dto.article.ArticleResponse;
import com.blog.jwtauthblog.service.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/articles")
@Tag(name = "Articles", description = "Gestion des Articles du blog")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @PostMapping("/creer")
    @Operation(summary = "Créer un article", description = "Cré un nouvel article")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")

    public ResponseEntity<ArticleResponse> createdArticle(@Valid @RequestBody ArticleRequest request){
        ArticleResponse article = articleService.createdArticle(request);
        return new ResponseEntity<>(article, HttpStatus.CREATED);
    }

    @GetMapping("/liste")
    @Operation(summary = "Liste des Articles publiés", description = "Récupère tous les articles publié avec pagination")
    public ResponseEntity<Page<ArticleResponse>> getPublishedArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){

        Pageable pageable = PageRequest.of(page, size);
        Page<ArticleResponse> articles = articleService.getPublishedArticles(pageable);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Article par ID", description = "Récupère un article spécifique par son ID")
    public ResponseEntity<ArticleResponse> getArticleById(@PathVariable Long id){
        ArticleResponse article = articleService.getArticleById(id);
        return ResponseEntity.ok(article);
    }



    @GetMapping("/mes_articles")
    @Operation(summary = "Mes articles", description = "Pour récuperer les articles de l'utilisateir connecté")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<ArticleResponse>> getMyArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){

        Pageable pageable = PageRequest.of(page, size);
        Page<ArticleResponse> articles = articleService.getMyArticles(pageable);

        return ResponseEntity.ok(articles);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un artice", description = "Met à jour un article existant")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ArticleResponse> updateArticle(
            @PathVariable Long id,
            @Valid @RequestBody ArticleRequest request){

        ArticleResponse article = articleService.updateArticle(id, request);
        return ResponseEntity.ok(article);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un article", description = "Supprimer un article")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteArticle(@PathVariable Long id){
        articleService.deleteArticle(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Article supprimer avec succès");

        return ResponseEntity.ok(response);
    }


    @GetMapping("/search")
    @Operation(summary = "Rechercher des articles", description = "Rechercher des articles par mot-clé")
    public ResponseEntity<Page<ArticleResponse>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page, size);
        Page<ArticleResponse> articles = articleService.searchArticles(keyword, pageable);

        return ResponseEntity.ok(articles);
    }

    @PatchMapping("/{id}/toggle-publish")
    @Operation(summary = "Publier/Depublier un articlel", description = "change le statut de pubication d'un article")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ArticleResponse> togglePublishStatus(@RequestParam Long id){
        ArticleResponse article = articleService.togglePublishStatus(id);
        return ResponseEntity.ok(article);
    }
}