package com.homeauto.platform.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger / OpenAPI 3 Configuration.
 * 
 * Provides interactive API documentation and testing interface at:
 * http://localhost:8080/swagger-ui/index.html
 * 
 * Configured with JWT Bearer Token authorization support.
 */
@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuthentication";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Online Home Automation Control Platform API")
                        .version("1.0.0")
                        .description("RESTful APIs for Home Automation Platform (Admin and Homeowner Portals)")
                        .contact(new Contact()
                                .name("Student Project Team")
                                .email("support@homeauto.com"))
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT token obtained from /api/auth/login")));
    }
}
