package com.homeauto.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main Application Entry Point for the Online Home Automation Control Platform.
 * 
 * @EnableScheduling enables Spring's scheduled background tasks,
 * which we use to simulate IoT sensor data (temperature, humidity, energy consumption)
 * and evaluate real-time automation rules.
 */
@SpringBootApplication
@EnableScheduling
public class HomeAutomationApplication {

    public static void main(String[] args) {
        SpringApplication.run(HomeAutomationApplication.class, args);
    }
}
