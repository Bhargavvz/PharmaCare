package com.pharmacare.api.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsFilter implements Filter {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;
    
    @Value("${cors.allowed-methods}")
    private String allowedMethods;
    
    @Value("${cors.allowed-headers}")
    private String allowedHeaders;
    
    @Value("${cors.exposed-headers}")
    private String exposedHeaders;
    
    @Value("${cors.allow-credentials}")
    private String allowCredentials;
    
    @Value("${cors.max-age}")
    private String maxAge;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;
        
        String origin = request.getHeader("Origin");
        
        // Debug logging
        System.out.println("CORS Filter: Processing request to " + request.getRequestURI() + " from origin " + origin);
        
        // Check if the origin is allowed
        if (origin != null && isAllowedOrigin(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Methods", allowedMethods);
            response.setHeader("Access-Control-Allow-Headers", allowedHeaders);
            response.setHeader("Access-Control-Expose-Headers", exposedHeaders);
            response.setHeader("Access-Control-Allow-Credentials", allowCredentials);
            response.setHeader("Access-Control-Max-Age", maxAge);
        }
        
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }
    }
    
    private boolean isAllowedOrigin(String origin) {
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        return origins.contains(origin);
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void destroy() {
    }
}