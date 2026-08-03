package com.aicommerce.controller;

import com.aicommerce.entity.Product;
import com.aicommerce.exception.ProductNotFoundException;
import com.aicommerce.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

//validation
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

//exception handling


import java.util.List;

@RestController
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    @GetMapping("/products")
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    @GetMapping("/products/{id}")
    public Product getProductById(@PathVariable Long id){
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
//                .orElseThrow(() -> new RuntimeException("product not found: " + id)); //previous
    }


    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product){
        Product saved = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Long id, @Valid @RequestBody Product updatedProduct){

        Product existing = productRepository.findById(id)
                .orElseThrow(()-> new ProductNotFoundException(id));

        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setPrice(updatedProduct.getPrice());
        existing.setStockQuantity(updatedProduct.getStockQuantity());
        existing.setImageUrl(updatedProduct.getImageUrl());

        return productRepository.save(existing);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id){
        if (!productRepository.existsById(id)){
            //doesnt exist
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}