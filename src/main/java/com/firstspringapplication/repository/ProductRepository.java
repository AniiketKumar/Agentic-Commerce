package com.firstspringapplication.repository;

import com.firstspringapplication.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

// TODO: extend JpaRepository<Product, Long> — that alone gives you
// findAll(), findById(), save(), deleteById(), etc. for free.
// No method body needed; this is an interface.
public interface ProductRepository extends JpaRepository<Product, Long> {

}