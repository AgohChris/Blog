package com.blog.jwtauthblog.dto.auth;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

public class JwtResponse {

    @Getter
    @Setter
    private String token;

    @Getter
    @Setter
    private String type = "Bearer";

    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String username;

    @Getter
    @Setter
    private String email;

    @Getter
    @Setter
    private List<String> roles;

    @Getter
    @Setter
    private LocalDateTime expiresAt;

    public JwtResponse(String newToken, Long id, String username, List<String> roles, LocalDateTime expiration){}

    public JwtResponse(String token, Long id, String username, String email, List<String> roles, LocalDateTime expiresAt){
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.expiresAt = expiresAt;
    }

}
