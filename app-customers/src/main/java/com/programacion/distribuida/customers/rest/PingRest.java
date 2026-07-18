package com.programacion.distribuida.customers.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ping")
public class PingRest {

    @GetMapping
    public String ping() {
        return "pong";
    }
}