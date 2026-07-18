package com.programacion.distribuida.customers;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AppCustomersApplication {

    public static void main(String[] args) {
        SpringApplication.run(AppCustomersApplication.class, args);
    }
}