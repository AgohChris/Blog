package com.blog.jwtauthblog.controller;


import com.blog.jwtauthblog.entity.User;
import com.blog.jwtauthblog.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@Tag(name = "User management", description = "Gestion des utilisateurs")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping("/profie")
    @Operation(summary = "Profil utilisateur", description = "Récupère le prtofie de l'utilisateur connecté")
    public ResponseEntity<Map<String, Object>> getUserProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("roles", user.getRoles());
        profile.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(profile);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Liste de tous les utilisateurs", description = "Résupère la liste de tout les utilisateurs (Admin uniquement)")
    public ResponseEntity<List<User>> getAllUsers(){
    List<User> users = userService.getAllusers();

    return ResponseEntity.ok(users);
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    @Operation(summary = "Utilisateur par ID", description = "Récupère un utilisateur par son Id ")
    public ResponseEntity<User> getUserId(@PathVariable Long id){
        User user = userService.getUserById(id);

        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    @Operation(summary = "Mettre à jour utilisateur", description = "Met à jour les informations d'un utilisateur")
    public ResponseEntity<Map<String, String>> updateUser(@PathVariable Long id, @RequestBody User userUpdate) {
        userService.updateUser(id, userUpdate);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Utilisateur mis à jour avec succès !");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprimer utilisateur", description = "Supprime un utilisateur (Admin uniquement)")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Utilisateur supprimé avec succès !");

        return ResponseEntity.ok(response);
    }
}
