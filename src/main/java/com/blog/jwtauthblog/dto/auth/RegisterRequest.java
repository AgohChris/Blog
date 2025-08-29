package com.blog.jwtauthblog.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

public class RegisterRequest {

    @Getter
    @Setter
    @NotBlank(message = "Le nom d'utilisateur est requis")
    @Size(min = 3, max = 16, message = "Le nom d'utilisateur doit contenir entre 3 et 16 caractères")
    private String username;


    @Getter
    @Setter
    @NotBlank(message = "Le mot de passe est requis")
    @Email(message = "Format d'eamil invalide")
    @Size(max = 100, message = "L'email ne peut pas depasser 100 carctères")
    private String email;


    @Getter
    @Setter
    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 6, max = 60, message = "Le mot de passe doit contenir au moins 6 caractères ")
    private String password;

    public RegisterRequest() {}



}
