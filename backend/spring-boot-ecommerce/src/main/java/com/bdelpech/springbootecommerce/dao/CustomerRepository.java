package com.bdelpech.springbootecommerce.dao;

import com.bdelpech.springbootecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;


public interface  CustomerRepository extends JpaRepository<Customer, Integer> {
    Customer findByEmail(String theEmail);
}