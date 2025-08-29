package com.blog.jwtauthblog.dto.article;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

public class ArticleResponse {
    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String title;

    @Getter
    @Setter
    private String contenu;

    @Getter
    @Setter
    private boolean published;

    @Getter
    @Setter
    private LocalDateTime createdAt;

    @Getter
    @Setter
    private LocalDateTime updateAt;

    @Getter
    @Setter
    private LocalDateTime publishedAt;

    @Getter
    @Setter
    private List<String> tags;

    @Getter
    @Setter
    private Long authorId;

    @Getter
    @Setter
    private String authorUsername;

    // Statistique
    @Getter
    @Setter
    private long commentsCount;

    // Constructeurs
    public ArticleResponse(){}




}
