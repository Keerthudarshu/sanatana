package com.eduprajna.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.DispatcherType;

@Controller
public class FrontendController {
    
    /**
     * Forward specific frontend routes to index.html for React Router
     * CRITICAL: Do NOT use /** pattern - it causes infinite loops with /api requests
     * Instead, only handle specific frontend routes that aren't API/static/resources
     */
    @RequestMapping(value = {"/", "/about", "/contact", "/categories", "/products", "/checkout", "/account", "/wishlist", "/{path:[a-z-]+}", "/{path:[a-z-]+}/{subpath:[a-z0-9-]+}"})
    public String forward(HttpServletRequest request) {

        // Prevent recursive FORWARD dispatches
        if (request.getDispatcherType() == DispatcherType.FORWARD) {
            return null;
        }

        // Forward client-side routes to React index.html
        return "forward:/index.html";
    }
}