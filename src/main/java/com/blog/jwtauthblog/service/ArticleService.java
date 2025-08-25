package com.blog.jwtauthblog.service;

import com.blog.jwtauthblog.dto.article.ArticleRequest;
import com.blog.jwtauthblog.dto.article.ArticleResponse;
import com.blog.jwtauthblog.entity.Article;
import com.blog.jwtauthblog.entity.User;
import com.blog.jwtauthblog.exception.ResourceNotFoundException;
import com.blog.jwtauthblog.exception.UnauthorizedException;
import com.blog.jwtauthblog.repository.ArticleRepository;
import com.blog.jwtauthblog.repository.CommentRepository;
import com.blog.jwtauthblog.util.SecurtyUtils;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.swing.text.IconView;

@Service
@Transactional
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private SecurtyUtils securtyUtils;

    // Créer un nouvel article
    public ArticleResponse createdArticle(ArticleRequest request){
        User currentUser = securtyUtils.getCurrentUser();

        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setContenu(request.getContenu());
        article.setPublished(request.isPublished());
        article.setAuthor(currentUser);

        if (request.getTags() != null){
            article.setTags(request.getTags());
        }
        if (request.isPublished()){
            article.publish();
        }
        Article savedArticle = articleRepository.save(article);
        return convertToResponse(savedArticle);
    }

    //Pour Avoir tous les articles publiés (pour le public)
    public Page<ArticleResponse> getPublishedArticles(Pageable pageable){
        Page<Article> articles = articleRepository.findByPublishedTrueOrderByPublishedAtDesc(pageable);
        return articles.map(this::convertToResponse);
    }

    // Pour obtenir un article apècifique par ID
    public ArticleResponse getArticleById(Long id){
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé avec l'ID : " + id));

        // Pour Vérifier si l'article est publié ou si l'utilisateur est un auteur ou admin
        if(!article.isPublished() && !canManagerArticle(article)){
            throw new ResourceNotFoundException("Article non trouvé");
        }
        return convertToResponse(article);
    }

    //    Obtenir les articles d;un utilisateur
    public Page<ArticleResponse> getMyArticles(Pageable pageable){
        User currentUser = securtyUtils.getCurrentUser();
        Page<Article> articles = articleRepository.findByAuthorOrderByCreatedAtDesc(currentUser, pageable);
        return articles.map(this::convertToResponse);
    }

    //    Pour mettre a jour un article
    public ArticleResponse updateArticle(Long id, ArticleRequest request){
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé avec l'ID : " + id));

        if (!canManagerArticle(article)){
            throw new UnauthorizedException("Vous n'êtes pas autorisé à modifier cet article");
        }
        article.setTitle(request.getTitle());
        article.setContenu(request.getContenu());

    //        Gestion de la publication
        if (request.isPublished() && !article.isPublished()){
            article.publish();
        }else {
            article.setPublished(request.isPublished());
        }

        if(request.getTags() != null){
            article.setTags(request.getTags());
        }
        Article updateArticle = articleRepository.save(article);
        return convertToResponse(updateArticle);
    }

    //    Pour supprimer un article
    public void deleteArticle(Long id){
        Article article = articleRepository.findById(id)
                .orElseThrow( () -> new ResourceNotFoundException("Article non trouver avec l'id : " + id));
        if (!canManagerArticle(article)){
            throw new UnauthorizedException("Vous n'êtes pas autorisé à supprimer cet article");
        }
        articleRepository.delete(article);
    }

//    Pour rechercher des articles
    public Page<ArticleResponse> searchArticles(String keyword, Pageable pageable){
        Page<Article> articles = articleRepository.findByKeywordInTitle(keyword, pageable);
        return articles.map(this::convertToResponse);
    }

    public ArticleResponse togglePublishStatus(Long id){
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé avec l'ID : " + id));

        if(!canManagerArticle(article)){
            throw new UnauthorizedException("Vous n'êtes pas autorisé à modifier cet article");
        }
        if (article.isPublished()){
            article.setPublished(false);
        }else {
            article.publish();
        }
        Article updateArticle = articleRepository.save(article);
        return convertToResponse(updateArticle);
    }



    private boolean canManagerArticle(Article article) {
        User currentUser = securtyUtils.getCurrentUser();

        if (article.getAuthor().getId().equals(currentUser.getId())){
            return true;
        }

//        Pour que les admins puisse gérer tous les articles.
        return securtyUtils.hasRole("ADMIN");
    }




    private ArticleResponse convertToResponse(Article article){
        ArticleResponse response = new ArticleResponse();
        response.setId(article.getId());
        response.setTitle(article.getTitle());
        response.setContenu(article.getContenu());
        response.setPublished(article.isPublished());
        response.setCreatedAt(article.getCreatedAt());
        response.setUpdateAt(article.getUpdatedAt());
        response.setPublishedAt(article.getPublishedAt());
        response.setTags(article.getTags());

//        Les infos sur l'auteur
        User author = article.getAuthor();
        response.setAuthorId(author.getId());
        response.setAuthorUsername(author.getUsername());

        response.setCommentsCount(commentRepository.countByArticle(article));

        return response;
    }


}
