package com.blog.jwtauthblog.service;


import com.blog.jwtauthblog.entity.User;
import com.blog.jwtauthblog.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllusers(){
        return userRepository.findAll();
    }

    public User getUserById(Long id){
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'Id L: "+ id));
    }

    public User getUSerByUsername(String username){
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(username + " non trouvé"));
    }

    public User updateUser(Long id, User userUpdate){
        User user = getUserById(id);

        if (userUpdate.getEmail() !=null && !userUpdate.getEmail().equals(user.getEmail())){
            if (userRepository.existsByEmail(userUpdate.getEmail())){
                throw new RuntimeException("Cet email est déjà utilisé par un autre utilisateur");
            }
            user.setEmail(userUpdate.getEmail());
        }

        if (userUpdate.getPassword() != null && !userUpdate.getPassword().isEmpty()){
            user.setPassword(passwordEncoder.encode(userUpdate.getPassword()));
        }
       return userRepository.save(user);
    }

    public void deleteUser(Long id){
        User user = getUserById(id);
        userRepository.delete(user);
    }
}
