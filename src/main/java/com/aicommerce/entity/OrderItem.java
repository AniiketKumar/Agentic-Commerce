package com.aicommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
//import org.springframework.security.core.parameters.P;

import java.math.BigDecimal;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int quantity;

    private BigDecimal priceAtPurchase;

    public OrderItem(){

    }

    public OrderItem(Order order, Product product, int quantity, BigDecimal priceAtPurchase){
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.priceAtPurchase = priceAtPurchase;
    }

    public Long getId(){
        return id;
    }

    public Product getProduct(){
        return product;
    }

    public int getQuantity(){
        return quantity;
    }

    public BigDecimal getPriceAtPurchase(){
        return priceAtPurchase;
    }

}