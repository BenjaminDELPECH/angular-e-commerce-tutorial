package com.bdelpech.springbootecommerce.config;

import com.bdelpech.springbootecommerce.dao.CountryRepository;
import com.bdelpech.springbootecommerce.dao.OrderRepository;
import com.bdelpech.springbootecommerce.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private final EntityManager entityManager;

    @Value("${config.data.rest.base-path}")
    private String basePath;

    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;

    @Autowired
    public MyDataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }


    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsupportedActions = {HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH, HttpMethod.DELETE};

        disableHttpMethods(Product.class, config, theUnsupportedActions);
        disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);
        disableHttpMethods(Country.class, config, theUnsupportedActions);
        disableHttpMethods(CountryRepository.class, config, theUnsupportedActions);
        disableHttpMethods(Customer.class, config, theUnsupportedActions);
        disableHttpMethods(OrderRepository.class, config, theUnsupportedActions);


        config.exposeIdsFor(ProductCategory.class);
        config.exposeIdsFor(Product.class);
        config.exposeIdsFor(State.class);
        config.exposeIdsFor(Country.class);
        config.exposeIdsFor(Customer.class);


        cors.addMapping(this.basePath+"/**")
                .allowedOrigins(this.theAllowedOrigins);

    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure(((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions)));
    }


//    public void exposeIds(RepositoryRestConfiguration config){
//        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
//        List<Class> entityClass = new ArrayList<>();
//
//    }


}
