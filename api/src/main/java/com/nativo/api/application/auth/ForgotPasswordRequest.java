package com.nativo.api.application.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @Email(message = "Email inválido")
        @NotBlank(message = "Email é obrigatório")
        String email
) {}
