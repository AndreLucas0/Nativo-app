package com.nativo.api.application.auth;

import com.nativo.api.domain.course.CourseRepository;
import com.nativo.api.domain.progress.UserProgress;
import com.nativo.api.domain.progress.UserProgressRepository;
import com.nativo.api.domain.user.User;
import com.nativo.api.domain.user.UserRepository;
import com.nativo.api.infrastructure.exception.ConflictException;
import com.nativo.api.infrastructure.exception.ResourceNotFoundException;
import com.nativo.api.infrastructure.exception.UnauthorizedException;
import com.nativo.api.infrastructure.security.JwtService;
import com.nativo.api.infrastructure.security.PasswordResetTokenStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    private static final String DEFAULT_COURSE_SLUG = "expo-react-native";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenStore passwordResetTokenStore;
    private final CourseRepository courseRepository;
    private final UserProgressRepository userProgressRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email já cadastrado");
        }

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .name(request.name())
                .build();

        user = userRepository.save(user);
        enrollInDefaultCourse(user);
        return buildAuthResponse(user);
    }

    private void enrollInDefaultCourse(User user) {
        courseRepository.findBySlug(DEFAULT_COURSE_SLUG).ifPresentOrElse(
                course -> {
                    var progress = UserProgress.builder()
                            .user(user)
                            .course(course)
                            .startedAt(Instant.now())
                            .build();
                    userProgressRepository.save(progress);
                    log.info("Usuário {} matriculado automaticamente em '{}'", user.getId(), DEFAULT_COURSE_SLUG);
                },
                () -> log.warn("Curso padrão '{}' não encontrado — matrícula automática ignorada.", DEFAULT_COURSE_SLUG)
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UnauthorizedException("Credenciais inválidas"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Credenciais inválidas");
        }

        return buildAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse refresh(RefreshRequest request) {
        if (!jwtService.isTokenValid(request.refreshToken())) {
            throw new UnauthorizedException("Refresh token inválido ou expirado");
        }

        var userId = jwtService.extractUserId(request.refreshToken());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Usuário não encontrado"));

        return buildAuthResponse(user);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            String token = passwordResetTokenStore.createToken(user.getId());
            // MVP: email é stub — token logado para testes
            log.info("Password reset token for [{}]: {}", request.email(), token);
        });
        // Retorno silencioso independente de o email existir (não vaza informação)
    }

    public void resetPassword(ResetPasswordRequest request) {
        var userId = passwordResetTokenStore.consumeToken(request.token());
        if (userId == null) {
            throw new UnauthorizedException("Token de reset inválido ou expirado.");
        }

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        return new AuthResponse(
                jwtService.generateAccessToken(user.getId()),
                jwtService.generateRefreshToken(user.getId()),
                new AuthResponse.UserInfo(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getTotalXp(),
                        user.getCurrentLevel()
                )
        );
    }
}
