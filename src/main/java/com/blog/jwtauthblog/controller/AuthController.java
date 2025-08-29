package com.blog.jwtauthblog.controller;

import com.blog.jwtauthblog.dto.auth.JwtResponse;
import com.blog.jwtauthblog.dto.auth.LoginRequest;
import com.blog.jwtauthblog.dto.auth.RegisterRequest;
import com.blog.jwtauthblog.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/auth"})
@Tag(name = "Authentication", description = "Api d'authentification")

public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Connexion de l'User", description = "Authentifie un user et retourne un Jwt")
    @ApiResponse(responseCode = "200", description = "Connexion réussie")
    @ApiResponse(responseCode = "401", description = "Identifiants invalides")

    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest){
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/register")
    @Operation(summary = "Inscription utilisateur", description = "Cré un nouvel utilisateur")
    @ApiResponse(responseCode = "201", description = "Utilisateur créé avec succès")
    @ApiResponse(responseCode = "400", description = "Donnée invalides")
    @ApiResponse(responseCode = "409", description = "Utilisateur déja existant")

    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody RegisterRequest signUpRequest){
        authService.registerUser(signUpRequest);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Utilisateur enregistré avec succès !");

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    @PostMapping("/refresh")
    @Operation(summary = "Rafraichir le token", description = "Génère un nouveau JWT à partir d'un token")
    @ApiResponse(responseCode = "200", description = "Token rafraichi avec succès")
    @ApiResponse(responseCode = "401", description = "Refresh token invalide ou expiré")

    public ResponseEntity<JwtResponse> refreshToken(@RequestBody Map<String, String> request){
        String refreshToken = request.get("refreshToken");
        JwtResponse jwtResponse = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/logout")
    @Operation(summary = "Deconnexion", description = "Deconnecte l'utilisateur")
    @ApiResponse(responseCode = "200", description = "Deconnexion réussie")
    public ResponseEntity<Map<String, String>> logoutUser() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Deconnexion réussie !");

        return ResponseEntity.ok(response);
    }





}
