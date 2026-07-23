package com.firstspringapplication.repository;

import com.firstspringapplication.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
