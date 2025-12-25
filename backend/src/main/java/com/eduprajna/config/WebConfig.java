package com.eduprajna.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // CRITICAL: Do NOT use /** handler - it intercepts ALL requests including API calls
        // This causes infinite forwarding loops in Spring dispatcher
        
        // Serve uploaded files from dedicated /uploads/** path ONLY
        String uploadDir = System.getProperty("upload.dir", "./uploads");
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/")
                .setCachePeriod(86400); // 1 day cache for uploads
        
        // Serve static frontend files ONLY from /static/** path
        // This prevents intercepting API requests like /api/admin/products/{id}
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/", "file:./static/")
                .setCachePeriod(31556926); // 1 year cache for static assets
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:3000", 
                    "http://127.0.0.1:3000",
                    "https://*.onrender.com",
                    "https://your-app-name.onrender.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
