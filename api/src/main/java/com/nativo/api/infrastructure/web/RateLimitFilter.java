package com.nativo.api.infrastructure.web;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS = 100;
    private static final long WINDOW_SECONDS = 60;

    private final Map<String, Deque<Instant>> requestLog = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String key = resolveKey(request);
        Instant now = Instant.now();
        Instant windowStart = now.minusSeconds(WINDOW_SECONDS);

        int[] count = {0};
        requestLog.compute(key, (k, deque) -> {
            if (deque == null) deque = new ArrayDeque<>();
            while (!deque.isEmpty() && deque.peekFirst().isBefore(windowStart)) deque.pollFirst();
            deque.addLast(now);
            count[0] = deque.size();
            return deque;
        });

        if (count[0] > MAX_REQUESTS) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"status\":429,\"error\":\"Too Many Requests\"," +
                    "\"message\":\"Limite de requisições excedido. Tente novamente em 1 minuto.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String resolveKey(HttpServletRequest request) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            return "user:" + auth.getName();
        }
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return "ip:" + forwarded.split(",")[0].trim();
        }
        return "ip:" + request.getRemoteAddr();
    }
}
