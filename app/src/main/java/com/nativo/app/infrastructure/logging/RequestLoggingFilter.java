package com.nativo.app.infrastructure.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Servlet filter that:
 * 1. Extracts or generates a Correlation ID (X-Request-ID header) and stores it in MDC
 *    so every log line in the request thread includes the request ID automatically.
 * 2. Logs each incoming request with method, path, status and duration on completion.
 *
 * Runs once per request (OncePerRequestFilter) and is ordered first (@Order(1))
 * so the requestId is available to all downstream filters and handlers.
 */
@Component
@Order(1)
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    /** MDC key used in logback-spring.xml pattern as %X{requestId} */
    static final String MDC_REQUEST_ID = "requestId";

    /** Header name for correlation ID propagation */
    static final String REQUEST_ID_HEADER = "X-Request-ID";

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Resolve or generate Correlation ID
        String requestId = request.getHeader(REQUEST_ID_HEADER);
        if (requestId == null || requestId.isBlank()) {
            requestId = UUID.randomUUID().toString();
        }

        // 2. Store in MDC so all log statements in this thread include it
        MDC.put(MDC_REQUEST_ID, requestId);

        // 3. Echo the request ID back in the response header
        response.setHeader(REQUEST_ID_HEADER, requestId);

        long startTime = System.currentTimeMillis();
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            log.info("{} {} -> {} ({}ms)",
                    request.getMethod(),
                    request.getRequestURI(),
                    response.getStatus(),
                    duration);

            // 4. Always clear MDC to avoid leaking values across thread-pool reuse
            MDC.remove(MDC_REQUEST_ID);
        }
    }
}
