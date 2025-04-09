package com.pharmacare.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger filterLogger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        filterLogger.debug("Processing request: {}", request.getRequestURI());
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt)) {
                filterLogger.debug("Found JWT token in request");
                String username = tokenProvider.getUsernameFromToken(jwt);
                filterLogger.debug("Username from token: {}", username);

                if (StringUtils.hasText(username) && SecurityContextHolder.getContext().getAuthentication() == null) {
                    filterLogger.debug("Security context is null, attempting to load UserDetails");
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    filterLogger.debug("UserDetails loaded: {}", userDetails.getUsername());

                    if (tokenProvider.validateToken(jwt, userDetails)) {
                        filterLogger.debug("JWT token is valid");
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        filterLogger.debug("Authentication set in SecurityContext for user: {}", username);
                    } else {
                        filterLogger.warn("JWT token validation failed for user: {}", username);
                    }
                } else {
                    filterLogger.debug("Username is blank or SecurityContext already has Authentication");
                }
            } else {
                filterLogger.debug("No JWT token found in request Authorization header");
            }
        } catch (Exception ex) {
            filterLogger.error("Could not set user authentication in security context for request: {}", request.getRequestURI(), ex);
        }

        filterChain.doFilter(request, response);
        filterLogger.debug("Finished processing request: {}", request.getRequestURI());
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
} 