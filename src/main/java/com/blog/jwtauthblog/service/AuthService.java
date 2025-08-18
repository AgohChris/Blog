package com.blog.jwtauthblog.service;


import com.blog.jwtauthblog.dto.auth.JwtResponse;
import com.blog.jwtauthblog.dto.auth.LoginRequest;
import com.blog.jwtauthblog.dto.auth.RegisterRequest;
import com.blog.jwtauthblog.entity.Role;
import com.blog.jwtauthblog.entity.User;
import com.blog.jwtauthblog.exception.UserAlreadyExistsException;
import com.blog.jwtauthblog.repository.RoleRepository;
import com.blog.jwtauthblog.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;


    public JwtResponse authenticateUser(LoginRequest loginRequest){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User userPrincipal = (User) authentication.getPrincipal();
        String jwt = jwtService.generateToken(userPrincipal);

        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        Date expirationDate = jwtService.extractExpiration(jwt);
        LocalDateTime expiration = expirationDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        return new JwtResponse(
                jwt,
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getEmail(),
                roles,
                expiration
        );
    }
    public void registerUser(RegisterRequest signUpRequest){
        if (userRepository.existsByUsername(signUpRequest.getUsername())){
            throw new UserAlreadyExistsException("Erreur : Le nom nom d'utilisateur est déjà pris");
        } if (userRepository.existsByEmail(signUpRequest.getEmail())){
            throw new UserAlreadyExistsException("Erreur : L'Email est déjà utilisé");
        }

        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword())
        );
        Set<Role> roles = new HashSet<>();

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Erreur : Rôle non trouvé."));
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);
    }

    public JwtResponse refreshToken(String refreshToken){
        if (jwtService.isTokenExpired(refreshToken)){
            throw new RuntimeException("Refresh token expiré");
        }
        String username = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByUsernameWithRoles(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!jwtService.isTokenValid(refreshToken, user)){
            throw new RuntimeException("Refresh token invalid");
        }
        String newToken = jwtService.generateToken(user);
        List<String> roles = user.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        Date expirationDate = jwtService.extractExpiration(newToken);
        LocalDateTime expiration = expirationDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        return new JwtResponse(
                newToken,
                user.getId(),
                user.getUsername(),
                roles,
                expiration
        );

    }
}
