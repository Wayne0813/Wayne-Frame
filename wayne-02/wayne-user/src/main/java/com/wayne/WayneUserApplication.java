package com.wayne;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WayneUserApplication {

    public static void main(String[] args) {
        SpringApplication.run(WayneUserApplication.class, args);
        System.out.println("[wayne-user-starting-port-9025......]");
    }

}
