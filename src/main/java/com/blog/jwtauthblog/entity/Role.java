package com.blog.jwtauthblog.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "roles")
public class Role {

    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @NotBlank
    @Size(max = 50)
    private String name;

    @Getter
    @Setter
    @Size(max = 255)
    private String description;

//   Construteurs

    public Role(){}

    public Role(String name){
        this.name = name;
    }

    public Role(String name, String description){
        this.name = name;
        this.description = description;
    }
}