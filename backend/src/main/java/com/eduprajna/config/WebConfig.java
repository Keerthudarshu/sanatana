package com.eduprajna.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

        @Override
        public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {

                // Serve uploaded files (images, docs, etc.)
                String uploadDir = System.getProperty("upload.dir", "./uploads");
                registry.addResourceHandler("/uploads/**")
                                .addResourceLocations("file:" + uploadDir + "/")
                                .setCachePeriod(86400); // 1 day cache

                // Serve static frontend assets if needed
                registry.addResourceHandler("/static/**")
                                .addResourceLocations(
                                                "classpath:/static/",
                                                "file:./static/")
                                .setCachePeriod(31556926); // 1 year cache
        }
}
