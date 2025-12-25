package com.eduprajna.config;

import com.eduprajna.filter.UriLengthFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Registers filters with highest precedence so they run very early during request processing.
 */
@Configuration
public class FilterRegistrationConfig {

    @Bean
    public FilterRegistrationBean<UriLengthFilter> uriLengthFilterRegistration(UriLengthFilter filter) {
        FilterRegistrationBean<UriLengthFilter> reg = new FilterRegistrationBean<>();
        reg.setFilter(filter);
        reg.addUrlPatterns("/*");
        // Very high precedence so it executes before other filters
        reg.setOrder(Integer.MIN_VALUE);
        return reg;
    }
}
