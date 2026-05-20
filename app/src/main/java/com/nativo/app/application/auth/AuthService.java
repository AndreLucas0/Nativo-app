package com.nativo.app.application.auth;

import com.nativo.app.domain.user.User;
import com.nativo.app.domain.user.UserRepository;
import com.nativo.app.infrastructure.exception.EmailAlreadyExistsException;
import com.nativo.app.infrastructure.exception.InvalidCredentialsException;
import com.nativo.app.infrastructure.exception.InvalidTokenException;
import com.nativo.app.infrastructure.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Application service for authentication operations.
 *
 * Handles user registration, login, and token refresh.
 * Password reset endpoints return 200 regardless of email existence
 * to prevent email enumeration attacks.
 */
@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // -------------------------------------------------------------------------
    // Register
    // -------------------------------------------------------------------------

    /**
     * Registers a new user.
     *
     * @param email    the user's email address (must be unique)
     * @param password plain-text password (hashed with BCrypt strength 10)
     * @param name     the user's display name
     * @return auth response with userId, email, name, accessToken, refreshToken
     * @throws EmailAlreadyExistsException if the email is already registered
     */
    public AuthResponse register(String email, String password, String name) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException(email);
        }

        String passwordHash = passwordEncoder.encode(password);
        User user = new User(email, passwordHash, name);
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    // -------------------------------------------------------------------------
    // Login
    // -------------------------------------------------------------------------

    /**
     * Authenticates a user with email and password.
     *
     * @param email    the user's email address
     * @param password plain-text password to verify
     * @return auth response with userId, email, name, accessToken, refreshToken
     * @throws InvalidCredentialsException if email not found or password doesn't match
     */
    @Transactional(readOnly = true)
    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        return buildAuthResponse(user);
    }

    // -------------------------------------------------------------------------
    // Refresh token
    // -------------------------------------------------------------------------

    /**
     * Issues new access and refresh tokens from a valid refresh token.
     *
     * @param refreshToken the refresh JWT string
     * @return new auth response with fresh tokens
     * @throws InvalidTokenException if the refresh token is invalid, expired, or wrong type
     */
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtService.validateRefreshToken(refreshToken)) {
            throw new InvalidTokenException("Invalid or expired refresh token");
        }

        UUID userId = jwtService.extractUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidTokenException("User not found for refresh token"));

        return buildAuthResponse(user);
    }

    // -------------------------------------------------------------------------
    // Password reset (stub — email sending out of scope for MVP-1)
    // -------------------------------------------------------------------------

    /**
     * Initiates password reset flow.
     * Always returns successfully to prevent email enumeration.
     * Email sending is out of scope for MVP-1.
     *
     * @param email the email address to send reset instructions to
     */
    public void forgotPassword(String email) {
        // Intentionally does not reveal whether the email exists.
        // In a full implementation: generate a reset token, store it,
        // and send an email with the reset link.
        userRepository.findByEmail(email).ifPresent(user -> {
            // TODO MVP-2: generate reset token and send email
        });
    }

    /**
     * Resets a user's password using a reset token.
     * Token validation is out of scope for MVP-1.
     *
     * @param token       the password reset token
     * @param newPassword the new plain-text password
     */
    public void resetPassword(String token, String newPassword) {
        // TODO MVP-2: validate reset token, find user, update password hash
        throw new UnsupportedOperationException(
                "Password reset via token is not implemented in MVP-1");
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    private AuthResponse buildAuthResponse(User user) {
        String accessToken  = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getId());
        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                accessToken,
                refreshToken
        );
    }
}
