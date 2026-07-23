package com.firstspringapplication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldController {

    //GET HTTP Method
    @GetMapping("/")
    public String message(){
        return "Welcome to spring boot application";
    }

    //GET HTTP Method
    @GetMapping("/hello-world")
    public String helloWorld(){
        return "Hello World";
    }

    //how to create your model/beam
}
