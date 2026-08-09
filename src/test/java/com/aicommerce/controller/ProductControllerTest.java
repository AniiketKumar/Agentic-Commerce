package com.aicommerce.controller;

import com.aicommerce.entity.Product;
import com.aicommerce.repository.ProductRepository;
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

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ProductController.class,
excludeAutoConfiguration = {SecurityAutoConfiguration.class, ServletWebSecurityAutoConfiguration.class},
excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthenticationFilter.class))
class ProductControllerTest{

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductRepository productRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void getALlProducts_returnsList() throws Exception{
        Product product = new Product("Keyboard", "Mechanical", new BigDecimal("99.99"), 10);
        when(productRepository.findAll()).thenReturn(List.of(product));

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Keyboard"));
    }

    @Test
    void getProductById_found_returns200() throws Exception {
        Product product = new Product("Monitor", "27-inch", new BigDecimal("249.99"), 5);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        mockMvc.perform(get("/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Monitor"));
    }

    @Test
    void getProductById_notFound_returns404WithErrorBody() throws Exception {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/products/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Product not found: 999"));
    }

    @Test
    void createProduct_valid_returns201() throws Exception{
        Product toCreate = new Product("Mouse", "Wireless", new BigDecimal("29.99"), 20);
        Product saved = new Product("Mouse", "Wireless", new BigDecimal("29.99"), 20);

        when(productRepository.save(any(Product.class))).thenReturn(saved);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(toCreate)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Mouse"));
    }

    @Test
    void createProduct_blankName_returns400() throws Exception {
        Product invalid = new Product("", "No name", new BigDecimal("10.00"), 1);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteProduct_found_returns204() throws Exception {
        when(productRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/products/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteProduct_notFound_returns404() throws Exception{
        when(productRepository.existsById(999L)).thenReturn(false);

        mockMvc.perform(delete("/products/999"))
                .andExpect(status().isNotFound());
    }

}