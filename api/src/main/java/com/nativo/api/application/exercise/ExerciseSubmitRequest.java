package com.nativo.api.application.exercise;

import jakarta.validation.constraints.NotBlank;

public record ExerciseSubmitRequest(
        @NotBlank String answer
) {}
