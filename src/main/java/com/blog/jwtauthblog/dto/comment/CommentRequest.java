package com.blog.jwtauthblog.dto.comment;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

public class CommentRequest {

    @Getter
    @Setter
    @NotBlank(message = "Le contenu du commentaire esr requis")
    @Size(max = 1000, message = "Le commentaire ne peut dépasser 1000 caractère")
    private String contenu;

    @Getter
    @Setter
    @NotNull(message = "L'ID de larticle est requis")
    private Long articleId;

    @Getter
    @Setter
    private Long parentId;

    public CommentRequest(){}



}
