package com.bdelpech.springbootecommerce.service;

import com.bdelpech.springbootecommerce.dao.CustomerRepository;
import com.bdelpech.springbootecommerce.dto.Purchase;
import com.bdelpech.springbootecommerce.dto.PurchaseResponse;
import com.bdelpech.springbootecommerce.entity.Customer;
import com.bdelpech.springbootecommerce.entity.Order;
import com.bdelpech.springbootecommerce.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;


    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOder(Purchase purchase) {
        //retrieve the order into from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with order items
        Set<OrderItem> orderItemSet = purchase.getOrderItems();
        orderItemSet.forEach(item->order.addOrderItem(item) );

        //populate order with billing address and shipping address
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());


        //populate customer with order
        Customer customer = purchase.getCustomer();

        String theEmail = customer.getEmail();
        Customer customerFromDB = customerRepository.findByEmail(theEmail);
        if(customerFromDB!=null){
            customer = customerFromDB;
        }

        customer.addOrder(order);

        //save to the database
        customerRepository.save(customer);

        //return a reponse
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber(){
        //generate a random UUID number (UUID version-4)
        return UUID.randomUUID().toString();
    }
}
