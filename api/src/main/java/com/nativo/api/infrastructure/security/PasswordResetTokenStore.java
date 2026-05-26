package com.nativo.api.infrastructure.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class PasswordResetTokenStore {

    private static final long TTL_SECONDS = 900; // 15 minutes

    private record Entry(UUID userId, Instant expiresAt) {}

    private final Map<String, Entry> store = new ConcurrentHashMap<>();

    public String createToken(UUID userId) {
        String token = UUID.randomUUID().toString();
        store.put(token, new Entry(userId, Instant.now().plusSeconds(TTL_SECONDS)));
        return token;
    }

    public UUID consumeToken(String token) {
        Entry entry = store.remove(token);
        if (entry == null || entry.expiresAt().isBefore(Instant.now())) {
            return null;
        }
        return entry.userId();
    }
}
