package com.nativo.app.infrastructure.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

/**
 * Service responsible for JWT generation and validation.
 *
 * Access token:  15 minutes (900_000 ms), contains userId and email claims
 * Refresh token: 7 days (604_800_000 ms), contains only userId
 *
 * Both tokens are signed with HS256 using the secret from app.jwt.secret.
 * The secret is read from an environment variable in prod (${JWT_SECRET}).
 */
@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    static final String CLAIM_USER_ID = "userId";
    static final String CLAIM_EMAIL   = "email";
    static final String TOKEN_TYPE    = "type";
    static final String ACCESS_TYPE   = "access";
    static final String REFRESH_TYPE  = "refresh";

    private final SecretKey signingKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-token-expiration}") long accessTokenExpiration,
            @Value("${app.jwt.refresh-token-expiration}") long refreshTokenExpiration) {

        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    // -------------------------------------------------------------------------
    // Token generation
    // -------------------------------------------------------------------------

    /**
     * Generates a short-lived access token (15 min).
     * Claims: userId, email, type=access, iat, exp
     *
     * @param userId the user's UUID
     * @param email  the user's email address
     * @return signed JWT string
     */
    public String generateAccessToken(UUID userId, String email) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(userId.toString())
                .claim(CLAIM_USER_ID, userId.toString())
                .claim(CLAIM_EMAIL, email)
                .claim(TOKEN_TYPE, ACCESS_TYPE)
                .issuedAt(new Date(now))
                .expiration(new Date(now + accessTokenExpiration))
                .signWith(signingKey)
                .compact();
    }

    /**
     * Generates a long-lived refresh token (7 days).
     * Claims: userId, type=refresh, iat, exp
     *
     * @param userId the user's UUID
     * @return signed JWT string
     */
    public String generateRefreshToken(UUID userId) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(userId.toString())
                .claim(CLAIM_USER_ID, userId.toString())
                .claim(TOKEN_TYPE, REFRESH_TYPE)
                .issuedAt(new Date(now))
                .expiration(new Date(now + refreshTokenExpiration))
                .signWith(signingKey)
                .compact();
    }

    // -------------------------------------------------------------------------
    // Token validation
    // -------------------------------------------------------------------------

    /**
     * Validates a JWT token.
     * Returns false for expired, malformed, or tampered tokens.
     *
     * @param token the JWT string to validate
     * @return true if the token is valid and not expired
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException e) {
            log.debug("Invalid JWT token: {}", e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            log.debug("JWT token is null or empty: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Validates that a token is specifically a refresh token.
     *
     * @param token the JWT string to validate
     * @return true if valid and type=refresh
     */
    public boolean validateRefreshToken(String token) {
        if (!validateToken(token)) return false;
        return REFRESH_TYPE.equals(extractClaim(token, TOKEN_TYPE));
    }

    // -------------------------------------------------------------------------
    // Claims extraction
    // -------------------------------------------------------------------------

    /**
     * Extracts the userId (UUID) from a token.
     *
     * @param token a valid JWT string
     * @return the user's UUID
     */
    public UUID extractUserId(String token) {
        String userIdStr = extractClaim(token, CLAIM_USER_ID);
        return UUID.fromString(userIdStr);
    }

    /**
     * Extracts the email from an access token.
     *
     * @param token a valid access JWT string
     * @return the user's email, or null if not present (e.g. refresh token)
     */
    public String extractEmail(String token) {
        return extractClaim(token, CLAIM_EMAIL);
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private String extractClaim(String token, String claimName) {
        return parseClaims(token).get(claimName, String.class);
    }
}
