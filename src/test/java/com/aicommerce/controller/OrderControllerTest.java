package com.aicommerce.controller;

import com.aicommerce.entity.Order;
import com.aicommerce.security.JwtAuthenticationFilter;
import com.aicommerce.service.OrderService;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.security.autoconfigure.web.servlet.ServletWebSecurityAutoConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = OrderController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class,
        ServletWebSecurityAutoConfiguration.class},
        excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE,
        classes = JwtAuthenticationFilter.class))
class OrderControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrderService orderService;

    private static UsernamePasswordAuthenticationToken loggedInAs(String username) {
        return new UsernamePasswordAuthenticationToken(username, null, List.of());
    }

    @Test
    void createOrder_derivesUsernameFromAuthentication_returns201() throws Exception{

        String requestJson = """
                {"items":[{"productId":1, "quantity":2}]}
                """;
        Order order = new Order();
        order.setTotalAmount(new BigDecimal("199.98"));

        when(orderService.createOrder(eq("aniket"), any())).thenReturn(order);

        mockMvc.perform(post("/orders")
                .principal(loggedInAs("aniket"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.totalAmount").value(199.98));
    }

    @Test
    void getMyOrders_returnOnlyCallersOrders() throws Exception {
        Order order = new Order();
        order.setTotalAmount(new BigDecimal("99.99"));

        when(orderService.getOrdersForUser("aniket")).thenReturn(List.of(order));

        mockMvc.perform(get("/orders/my").principal(loggedInAs("aniket")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].totalAmount").value(99.99));
    }

    @Test
    void getAllOrders_returnsEveryOrder() throws Exception {
        Order order = new Order();
        order.setTotalAmount(new BigDecimal("49.99"));

        when(orderService.getAllOrders()).thenReturn(List.of(order));

        mockMvc.perform(get("/orders").principal(loggedInAs("admin")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].totalAmount").value(49.99));
    }

}
