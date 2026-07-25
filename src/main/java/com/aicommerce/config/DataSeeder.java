package com.aicommerce.config;

import com.aicommerce.entity.Product;
import com.aicommerce.repository.ProductRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner{

    private final ProductRepository productRepository;

    public DataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String[] args){
        productRepository.save(new Product("Keyboard", "Mechanical keyboard", new BigDecimal("49.99"), 25));
        productRepository.save(new Product("Monitor", "27 inch 4k display", new BigDecimal("299.99"), 10));
        productRepository.save(new Product("Mouse", "Wireless Mouse", new BigDecimal("19.99"), 50));
    }
}
