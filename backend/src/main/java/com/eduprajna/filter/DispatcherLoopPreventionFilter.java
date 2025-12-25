package com.eduprajna.filter;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Filter to prevent internal dispatcher loops that cause OutOfMemoryError.
 * This filter must run EARLY in the filter chain to intercept forwarded requests.
 */
@Component
public class DispatcherLoopPreventionFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(DispatcherLoopPreventionFilter.class);
    private static final String DISPATCHER_LOOP_ATTR = "com.eduprajna.filter.dispatcherLoopDetected";
    private static final String FORWARD_CHAIN_ATTR = "com.eduprajna.filter.forwardChain";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String dispatcherType = request.getDispatcherType().toString();
        String requestUri = request.getRequestURI();
        
        // For API requests, REJECT ANY FORWARD attempt immediately
        // API endpoints should never trigger view-based forwarding
        if (requestUri.startsWith("/api/") && "FORWARD".equals(dispatcherType)) {
            log.error("CRITICAL: API request being forwarded - this indicates a misconfigured handler! URI: {}", requestUri);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"API request should not trigger view forwarding\"}");
            return;
        }
        
        // Check if this request has already been forwarded multiple times
        Integer forwardChainLength = (Integer) request.getAttribute(FORWARD_CHAIN_ATTR);
        if (forwardChainLength == null) {
            forwardChainLength = 0;
        }
        
        // Detect if this is a forwarded request
        if ("FORWARD".equals(dispatcherType)) {
            forwardChainLength++;
            
            // REJECT ANY FORWARD (even first one) to prevent loops entirely
            if (forwardChainLength > 0) {
                log.error("CRITICAL: Request forwarding detected at chain position: {} for URI: {}", 
                    forwardChainLength, requestUri);
                
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Request forwarding not allowed - misconfigured handler\"}");
                return;
            }
        }
        
        // Store updated forward chain length
        request.setAttribute(FORWARD_CHAIN_ATTR, forwardChainLength);
        
        try {
            filterChain.doFilter(request, response);
        } catch (OutOfMemoryError e) {
            log.error("OutOfMemoryError caught during request processing. This indicates a critical issue.", e);
            if (!response.isCommitted()) {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Server resource exhaustion\"}");
            }
            throw e;
        }
    }
}
