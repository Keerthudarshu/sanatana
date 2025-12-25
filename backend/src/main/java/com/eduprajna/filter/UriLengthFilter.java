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

@Component
public class UriLengthFilter extends OncePerRequestFilter {

    // Reject requests with extremely long URIs to avoid path-tokenization OOM
    private static final int MAX_URI_LENGTH = 8 * 1024; // 8 KB

    private static final Logger log = LoggerFactory.getLogger(UriLengthFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Detect forwarded dispatch loops: count forwards via a request attribute
        final String FORWARD_COUNT_ATTR = "com.eduprajna.filter.forwardCount";
        Integer forwardCount = (Integer) request.getAttribute(FORWARD_COUNT_ATTR);
        if (forwardCount == null) forwardCount = 0;
        forwardCount++;
        request.setAttribute(FORWARD_COUNT_ATTR, forwardCount);
        // Immediately reject any forwarding to prevent memory exhaustion
        if (forwardCount > 1) {
            String uri = request.getRequestURI();
            String remote = request.getRemoteAddr();
            String ua = request.getHeader("User-Agent");
            log.error("Rejecting request due to forwarding loop (count={}) from {} UA={} URI={}", forwardCount, remote, ua, uri);
            response.sendError(HttpStatus.BAD_REQUEST.value(), "Detected forwarding loop");
            return;
        }
        String uri = request.getRequestURI();
        String qs = request.getQueryString();
        int total = (uri != null ? uri.length() : 0) + (qs != null ? qs.length() : 0);

        // Quick reject oversized URIs
        if (total > MAX_URI_LENGTH) {
            String remote = request.getRemoteAddr();
            String ua = request.getHeader("User-Agent");
            log.warn("Rejecting oversized request URI ({} chars) from {} UA={} URI={}", total, remote, ua, uri);
            response.sendError(HttpStatus.URI_TOO_LONG.value(), "Request URI too long");
            return;
        }

        // Reject obviously malformed repeated segments like /api repeated many times
        int apiCount = countOccurrences(uri, "/api");
        int uploadsCount = countOccurrences(uri, "/uploads");
        if (apiCount > 4 || uploadsCount > 4) {
            String remote = request.getRemoteAddr();
            String ua = request.getHeader("User-Agent");
            log.warn("Rejecting request with repeated path segments from {} UA={} apiCount={} uploadsCount={} URI={}", remote, ua, apiCount, uploadsCount, uri);
            response.sendError(HttpStatus.BAD_REQUEST.value(), "Malformed request URI");
            return;
        }
        filterChain.doFilter(request, response);
    }

    private int countOccurrences(String haystack, String needle) {
        if (haystack == null || needle == null || needle.length() == 0) return 0;
        int count = 0;
        int idx = 0;
        while ((idx = haystack.indexOf(needle, idx)) != -1) {
            count++;
            idx += needle.length();
        }
        return count;
    }
}
