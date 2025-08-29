package com.blog.jwtauthblog.service;


import com.blog.jwtauthblog.dto.comment.CommentRequest;
import com.blog.jwtauthblog.dto.comment.CommentResponse;
import com.blog.jwtauthblog.entity.Article;
import com.blog.jwtauthblog.entity.Comment;
import com.blog.jwtauthblog.entity.User;
import com.blog.jwtauthblog.exception.ResourceNotFoundException;
import com.blog.jwtauthblog.exception.UnauthorizedException;
import com.blog.jwtauthblog.repository.ArticleRepository;
import com.blog.jwtauthblog.repository.CommentRepository;
import com.blog.jwtauthblog.util.SecurtyUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private SecurtyUtils securtyUtils;

//    Creer un nouveau commentaire
    public CommentResponse createComment(CommentRequest request){
        User currentUser = securtyUtils.getCurrentUser();

        Article article = articleRepository.findById((request.getArticleId()))
                .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé"));

        if (!article.isPublished()){
            throw new ResourceNotFoundException("impossible de commenter un article non publié");
        }

        Comment comment = new Comment();
        comment.setContenu(request.getContenu());
        comment.setAuthor(currentUser);
        comment.setArticle(article);

//        Gestion des réponses aux commentaires.
        if(request.getParentId() != null){
            Comment parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Commentaire prent non trouvé"));
            comment.setParent(parent);
        }
        Comment savedComment = commentRepository.save(comment);

        return convertToResponse(savedComment);
    }


    // Obtenir les commentaires d'un article
    public Page<CommentResponse> getCommentByArticle(Long articleId, Pageable pageable){
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé"));

        Page<Comment> comments = commentRepository.findByArticleOrderByCreatedAtAsc(article, pageable);
        return comments.map(this::convertToResponse);
    }


    //   Modifier un commentaire
    public CommentResponse updateComment(Long id, CommentRequest request){
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(("Commentaire introuvable")));

        if (!canManageComment(comment)) {
            throw new UnauthorizedException("Vous n'êtes pas autorisé à modifier ce commentaire");
        }

        comment.setContenu(request.getContenu());
        Comment updatedComment = commentRepository.save(comment);

        return convertToResponse(updatedComment);
    }


//    Supprimer un commentaire

    public void deleteComment(Long id){
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commentaire non trouvé"));

        if (!canManageComment(comment)){
            throw new UnauthorizedException("Vous n'êtes pas autorisé à supprimer ce commentaire");
        }
        commentRepository.delete(comment);
    }


    // Obtenir les commentaires de l'utilisateur connecté
    public Page<CommentResponse> getMyComments(Pageable pageable){
        User currentUser = securtyUtils.getCurrentUser();
        Page<Comment> comments = commentRepository.findByAuthorOrderByCreatedAtDesc(currentUser, pageable);
        return comments.map(this::convertToResponse);
    }

//    Pour ibtenir un commentaire spécifique

    public CommentResponse getCommentById(Long id){
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commentaire non trouvé"));


        return convertToResponse(comment);
    }



    public boolean canManageComment(Comment comment){
        User currentUser = securtyUtils.getCurrentUser();

        if (comment.getAuthor().getId().equals(currentUser.getId())){
            return true;
        }

        return securtyUtils.hasRole("ADMIN");
    }


    private CommentResponse convertToResponse(Comment comment){
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContenu(comment.getContenu());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdateAt());

        User author = comment.getAuthor();
        response.setAuthorId(author.getId());
        response.setAuthorUsername(author.getUsername());


        if(comment.getParent() != null){
            response.setParentId(comment.getParent().getId());
            response.setParentAuthorUsername(comment.getParent().getAuthor().getUsername());
        }

        return response;
    }
}
