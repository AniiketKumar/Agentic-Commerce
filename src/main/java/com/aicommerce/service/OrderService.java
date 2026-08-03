package com.aicommerce.service;

//DTO:Data Transfer Object -> used for
import com.aicommerce.dto.OrderItemRequest;
import com.aicommerce.dto.OrderRequest;

import com.aicommerce.entity.Order;
import com.aicommerce.entity.OrderItem;
import com.aicommerce.entity.Product;
import com.aicommerce.entity.User;
import com.aicommerce.exception.InsufficientStockException;
import com.aicommerce.exception.ProductNotFoundException;
import com.aicommerce.exception.UserNotFoundException;

import com.aicommerce.repository.OrderRepository;
import com.aicommerce.repository.ProductRepository;
import com.aicommerce.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

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
    public Order createOrder(String username, OrderRequest request){
        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new UserNotFoundException("User not found: " + username));

        Order order = new Order();
        order.setUser(user);

        BigDecimal total = BigDecimal.ZERO;

        for(OrderItemRequest itemRequest: request.getItems()){
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(()-> new ProductNotFoundException(itemRequest.getProductId()));

            if(product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new InsufficientStockException("Not enough stock for product: " + product.getName());
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

    public List<Order> getOrdersForUser(String username){
        return orderRepository.findByUserUsernameOrderByCreatedAtDesc(username);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}