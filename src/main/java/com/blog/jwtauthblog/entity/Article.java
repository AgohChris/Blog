package com.blog.jwtauthblog.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "articles")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @NotBlank
    @Size(max = 100)
    private String title;

    @Getter
    @Setter
    @NotBlank
    @Lob
    private String contenu;

    @Getter
    @Setter
    private boolean published = false;

    @Getter
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Getter
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Getter
    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Getter
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Getter
    @Setter
    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @Getter
    @Setter
    @ElementCollection
    @CollectionTable(name = "article_tags", joinColumns = @JoinColumn(name = "article_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    public Article(){}

    public Article(String title, String contenu, User author){
        this.title = title;
        this.contenu = contenu;
        this.author = author;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist(){
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    public void preUpdate(){
        this.updatedAt = LocalDateTime.now();
        if (this.published && this.publishedAt == null){
            this.publishedAt = LocalDateTime.now();
        }
    }

    public void publish(){
        this.published = true;
        this.publishedAt = LocalDateTime.now();
    }


    public Long getId(){return id;}
    public void setId(Long Id){this.id = id;}






}