package com.aicommerce.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class OrderRequest {

//    @NotNull
//    private Long userId;

    @NotEmpty
    @Valid
    private List<OrderItemRequest> items;

//    public Long getUserId(){
//        return userId;
//    }
//
//    public void setUserId(Long userId){
//        this.userId = userId;
//    }
    //the frontend doesn't use userId while placing order, so I'm removing it from the request dto

    public List<OrderItemRequest> getItems(){
        return items;
    }

    public void setItems(List<OrderItemRequest> items){
        this.items = items;
    }
}