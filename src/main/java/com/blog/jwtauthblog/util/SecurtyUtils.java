package com.blog.jwtauthblog.util;

import com.blog.jwtauthblog.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurtyUtils {
    public User getCurrentUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()){
            throw new RuntimeException("Aucun utilisateur authentifié");
        }
        return (User) authentication.getPrincipal();
    }

    public boolean hasRole(String roleName){
        User currentUser = getCurrentUser();
        return  currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + roleName));
    }

    public boolean isOwner(Long userId){
        User currentUser = getCurrentUser();
        return currentUser.getId().equals(userId);
    }

    public boolean isOwnerOrAdmin(Long userId){
        return isOwner(userId) || hasRole("ADMIN");
    }
}
