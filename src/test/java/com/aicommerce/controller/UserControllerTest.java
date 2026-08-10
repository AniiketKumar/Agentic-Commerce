package com.aicommerce.controller;

import com.aicommerce.entity.User;
import com.aicommerce.repository.UserRepository;
import com.aicommerce.security.JwtAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.ServletWebSecurityAutoConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

import org.springframework.http.MediaType;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = UserController.class, excludeAutoConfiguration = {SecurityAutoConfiguration.class, ServletWebSecurityAutoConfiguration.class}, excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthenticationFilter.class))
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void register_valid_returns201AndNeverLeaksPassword() throws Exception {
        String requestJson = """
                {"username": "aniket", "email": "aniket@example.com", "password": "plaintext"}
                """;

        when(userRepository.existsByUsername("aniket")).thenReturn(false);
        when(userRepository.existsByEmail("aniket@example.com")).thenReturn(false);
        when(passwordEncoder.encode("plaintext")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("aniket"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void register_duplicateUsername_returns409() throws Exception {
        String requestJson = """
                {"username": "aniket", "email":"aniket@example.com", "password":"plaintext"}
                """;
        when(userRepository.existsByUsername("aniket")).thenReturn(true);

        mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("username already taken: aniket"));
    }

    @Test
    void register_duplicateEmail_returns409() throws Exception {
        String requestJson = """
                { "username": "newuser", "email": "aniket@example.com", "password":"plaintext" }
                """;

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("aniket@example.com")).thenReturn(true);

        mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Email already registered: aniket@example.com"));
    }

    @Test
    void register_blankUsername_returns400() throws Exception {
        String requestJson = """
                { "username": "", "email": "aniket@example.com", "password":"plaintext" }
                """;
        mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_invalidEmail_returns400() throws Exception {
        String requestJson = """
                { "username":"aniket", "email": "not-an-email", "password": "plaintext" }
                """;
        mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isBadRequest());
    }
}