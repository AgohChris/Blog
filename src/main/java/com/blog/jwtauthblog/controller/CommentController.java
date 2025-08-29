package com.blog.jwtauthblog.controller;



import com.blog.jwtauthblog.dto.comment.CommentRequest;
import com.blog.jwtauthblog.dto.comment.CommentResponse;
import com.blog.jwtauthblog.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/commentaires")
@Tag(name = "Commentaires", description = "Gestion des commentaires du blog")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    @Operation(summary = "Créer un commentaire ", description = "Ajoute un nouveau commentaire")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")

    public ResponseEntity<CommentResponse> createdComment(@Valid @RequestBody CommentRequest request){
        CommentResponse comment = commentService.createComment(request);
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @GetMapping("/article/{articleId}")
    @Operation(summary = "Commentaires d'un article", description = "Récupère tous les commentaires d'un article")
    public ResponseEntity<Page<CommentResponse>> getCommentsByArticle(
            @PathVariable Long articleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<CommentResponse> comments = commentService.getCommentByArticle(articleId, pageable);
        return ResponseEntity.ok(comments);
    }


    @GetMapping("/mes-commentaires")
    @Operation(summary = "Mes commentaires", description = "Récupérer les commentaire de l'auteur")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<CommentResponse>> getMyComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){

        Pageable pageable = PageRequest.of(page, size);
        Page<CommentResponse> comments = commentService.getMyComments(pageable);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Commentaire par Id ", description = "Récupère un commentaire spécifique")
    public ResponseEntity<CommentResponse> getCommentById(@PathVariable Long id){
        CommentResponse comment = commentService.getCommentById(id);
        return ResponseEntity.ok(comment);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un commentaire", description = "Modifier un commentaire existant")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequest request){
        CommentResponse comment = commentService.updateComment(id, request);
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un commentaire", description = "Supprime un commentaire")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteComment(@PathVariable Long id){
        commentService.deleteComment(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Commentaire supprimer avec succès");
        return ResponseEntity.ok(response);
    }




}
