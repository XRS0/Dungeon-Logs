package ru.max.servicesendingjson;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ServiceSendingJsonApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceSendingJsonApplication.class, args);
    }

}
