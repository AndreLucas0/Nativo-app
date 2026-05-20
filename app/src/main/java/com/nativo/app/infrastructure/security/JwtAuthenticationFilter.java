package com.nativo.app.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT authentication filter.
 *
 * Runs once per request (OncePerRequestFilter). For each request:
 * 1. Extracts the Bearer token from the Authorization header
 * 2. Validates the token via JwtService
 * 3. Loads UserDetails and injects UsernamePasswordAuthenticationToken
 *    into the SecurityContextHolder
 *
 * Returns 401 for invalid or expired tokens.
 * Skips filtering for public routes (handled by SecurityConfig permit rules).
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService,
                                   UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // No Authorization header or not a Bearer token — skip JWT processing.
        // Spring Security will handle the 401 for protected routes via its own mechanism.
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(BEARER_PREFIX.length());

        // Validate token before attempting to load user
        if (!jwtService.validateToken(token)) {
            log.debug("Invalid or expired JWT token for request: {} {}",
                    request.getMethod(), request.getRequestURI());
            sendUnauthorized(response, "Invalid or expired token");
            return;
        }

        // Only inject authentication if not already set (avoid double processing)
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // userId is stored as the subject/principal in the token
                String userId = jwtService.extractUserId(token).toString();

                // UserDetailsServiceImpl loads by userId (stored as username)
                UserDetails userDetails = userDetailsService.loadUserByUsername(
                        jwtService.extractEmail(token));

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("Authenticated user [{}] for request: {} {}",
                        userId, request.getMethod(), request.getRequestURI());

            } catch (Exception e) {
                log.warn("Failed to authenticate JWT token: {}", e.getMessage());
                sendUnauthorized(response, "Authentication failed");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Writes a 401 JSON response directly, bypassing the filter chain.
     * Used when the token is present but invalid — we must not continue.
     */
    private void sendUnauthorized(HttpServletResponse response, String message)
            throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(
                "{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"" + message + "\"}");
    }
}
