package com.bdelpech.springbootecommerce.controller;

import com.bdelpech.springbootecommerce.dto.Purchase;
import com.bdelpech.springbootecommerce.dto.PurchaseResponse;
import com.bdelpech.springbootecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/checkout")
public class CheckoutController {
    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){
        PurchaseResponse purchaseResponse = checkoutService.placeOder(purchase);
        return purchaseResponse;
    }
}
