package com.blog.jwtauthblog.dto.article;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class ArticleRequest {

    @Getter
    @Setter
    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 255, message = "Titre trop long 255 caractères max")
    private String title;

    @Getter
    @Setter
    @NotBlank(message = "le contenu est requis")
    private String contenu;

    @Getter
    @Setter
    private boolean published = false;

    @Getter
    @Setter
    private List<String> tags;

    private ArticleRequest(){}



}
