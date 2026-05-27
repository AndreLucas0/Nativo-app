package com.nativo.api.application.exercise;

import java.util.UUID;

public record ExerciseSubmitResponse(
        UUID attemptId,
        boolean correct,
        String explanation
) {}
