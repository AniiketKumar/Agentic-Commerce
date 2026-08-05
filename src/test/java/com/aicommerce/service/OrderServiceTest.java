package com.aicommerce.service;

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

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    private OrderService orderService;

    @BeforeEach
    void setUp() {

        orderService = new OrderService(orderRepository, productRepository, userRepository);
    }

    @Test
    void createOrder_success_decrementsStockAndComputesTotal() {

        User user = new User("aniket", "aniket@example.com", "hashed pwd");
        Product product = new Product("Keyboard", "Mechanical", new BigDecimal("99.99"), 10);

        when(userRepository.findByUsername("aniket")).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantity(2);

        OrderRequest request = new OrderRequest();
        request.setItems(List.of(itemRequest));

        Order result = orderService.createOrder("aniket", request);

        assertThat(result.getTotalAmount()).isEqualByComparingTo("199.98");
        assertThat(result.getItems()).hasSize(1);
        assertThat(product.getStockQuantity()).isEqualTo(8);

        verify(productRepository).save(product);
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_throwsWhenUserNotFound() {

        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        OrderRequest request = new OrderRequest();
        request.setItems(List.of());

        assertThrows(UserNotFoundException.class, () -> orderService.createOrder("ghost", request));

        verify(orderRepository, never()).save(any());
    }

    @Test
    void createOrder_throwsWhenProductNotFound() {

        User user = new User("aniket", "aniket@example.com", "hashed pwd");
        when(userRepository.findByUsername("aniket")).thenReturn(Optional.of(user));
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(99L);
        itemRequest.setQuantity(1);

        OrderRequest request = new OrderRequest();
        request.setItems(List.of(itemRequest));

        assertThrows(ProductNotFoundException.class, () -> orderService.createOrder("aniket", request));
    }

    @Test
    void createOrder_throwsWhenStockInsufficient() {

        User user = new User("aniket", "aniket@example.com", "hashed pwd");
        Product product = new Product("Monitor", "27-inch", new BigDecimal("249.99"), 2);

        when(userRepository.findByUsername("aniket")).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantity(5);

        OrderRequest request = new OrderRequest();
        request.setItems(List.of(itemRequest));

        assertThrows(InsufficientStockException.class, () -> orderService.createOrder("aniket", request));

        verify(productRepository, never()).save(any());
        verify(orderRepository, never()).save(any());
    }
}