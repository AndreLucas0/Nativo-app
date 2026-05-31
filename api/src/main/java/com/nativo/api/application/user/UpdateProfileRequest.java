package com.nativo.api.application.user;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(min = 2, max = 100)
        String name,

        @Size(max = 2048)
        String profileImageUrl
) {}
