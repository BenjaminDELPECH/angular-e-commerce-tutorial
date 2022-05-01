package com.bdelpech.springbootecommerce.service;

import com.bdelpech.springbootecommerce.dto.Purchase;
import com.bdelpech.springbootecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOder(Purchase purchase);
}
