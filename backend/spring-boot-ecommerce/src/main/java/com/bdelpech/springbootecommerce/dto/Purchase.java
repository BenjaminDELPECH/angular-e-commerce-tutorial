package com.bdelpech.springbootecommerce.dto;

import com.bdelpech.springbootecommerce.entity.Address;
import com.bdelpech.springbootecommerce.entity.Customer;
import com.bdelpech.springbootecommerce.entity.Order;
import com.bdelpech.springbootecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
