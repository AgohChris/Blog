package com.blog.jwtauthblog.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

public class LoginRequest {
    @Getter
    @Setter
    @NotBlank(message = "Le nom d'utilisateur est requis")
    private String username;

    @Getter
    @Setter
    @NotBlank
    private String password;

    public LoginRequest(){}

    public LoginRequest(String username, String password){
        this.username = username;
        this.password = password;
    }
}
