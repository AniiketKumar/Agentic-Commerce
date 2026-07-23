package com.firstspringapplication.service;

//DTO:Data Transfer Object -> used for
import com.firstspringapplication.dto.OrderItemRequest;
import com.firstspringapplication.dto.OrderRequest;

import com.firstspringapplication.entity.Order;
import com.firstspringapplication.entity.OrderItem;
import com.firstspringapplication.entity.Product;
import com.firstspringapplication.entity.User;
import com.firstspringapplication.exception.InsufficientStockException;
import com.firstspringapplication.exception.ProductNotFoundException;
import com.firstspringapplication.exception.UserNotFoundException;

import com.firstspringapplication.repository.OrderRepository;
import com.firstspringapplication.repository.ProductRepository;
import com.firstspringapplication.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, UserRepository userRepository){
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Order createOrder(OrderRequest request){
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(()-> new UserNotFoundException(request.getUserId()));

        Order order = new Order();
        order.setUser(user);

        BigDecimal total = BigDecimal.ZERO;

        for(OrderItemRequest itemRequest: request.getItems()){
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(()-> new ProductNotFoundException(itemRequest.getProductId()));

            if(product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new InsufficientStockException("Not enough sotck for product: " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            total = total.add(lineTotal);

            order.getItems().add(new OrderItem(order, product, itemRequest.getQuantity(), product.getPrice()));
        }

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }
}