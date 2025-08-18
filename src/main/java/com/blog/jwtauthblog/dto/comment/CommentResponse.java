package com.blog.jwtauthblog.dto.comment;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class CommentResponse {
    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String contenu;

    @Getter
    @Setter
    private LocalDateTime createdAt;

    @Getter
    @Setter
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    private Long authorId;

    @Getter
    @Setter
    private String authorUsername;

    @Getter
    @Setter
    private Long articleId;

    @Getter
    @Setter
    private String articleTitle;

    @Getter
    @Setter
    private Long parentId;

    @Getter
    @Setter
    private String parentAuthorUsername;

    public CommentResponse(){}
}
