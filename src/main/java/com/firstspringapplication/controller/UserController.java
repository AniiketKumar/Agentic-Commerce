package com.firstspringapplication.controller;

import com.firstspringapplication.entity.User;
import com.firstspringapplication.exception.UserAlreadyExistsException;
//import com.firstspringapplication.exception.UserAlreadyExistsException;
import com.firstspringapplication.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("users")
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController( UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody User user){
        if(userRepository.existsByUsername(user.getUsername())){
            throw new UserAlreadyExistsException("username already taken: " + user.getUsername());
        }
        if(userRepository.existsByEmail(user.getEmail())){
            throw new UserAlreadyExistsException("Email already registered: " + user.getEmail());
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}