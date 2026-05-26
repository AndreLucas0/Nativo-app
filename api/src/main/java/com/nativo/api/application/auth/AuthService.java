package com.nativo.api.application.auth;

import com.nativo.api.domain.user.User;
import com.nativo.api.domain.user.UserRepository;
import com.nativo.api.infrastructure.exception.ConflictException;
import com.nativo.api.infrastructure.exception.UnauthorizedException;
import com.nativo.api.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

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
        return buildAuthResponse(user);
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
        // MVP: verifica se email existe; envio de email é implementado na Fase 2
        userRepository.findByEmail(request.email());
    }

    public void resetPassword(ResetPasswordRequest request) {
        // MVP: stub — reset por token é implementado na Fase 2
        throw new UnsupportedOperationException("Reset de senha via token não implementado no MVP");
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
