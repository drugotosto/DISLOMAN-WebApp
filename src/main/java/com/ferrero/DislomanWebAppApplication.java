package com.ferrero;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;

@SpringBootApplication
public class DislomanWebAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(DislomanWebAppApplication.class, args);
	}


	// CommandLineRunner callback so it is executed by Spring Boot on startup
    @Bean
    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
        return args -> {

            System.out.println("\n\nStampa di tutti i beans forniti da Spring Boot:");

            String[] beanNames = ctx.getBeanDefinitionNames();
            Arrays.sort(beanNames);
            for (String beanName : beanNames) {
                System.out.println(beanName);
            }
            System.out.println("\n");
        };
    }
}
