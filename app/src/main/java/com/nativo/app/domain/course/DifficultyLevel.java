package com.nativo.app.domain.course;

/**
 * Difficulty level of an individual exercise.
 * Nullable — used for adaptive learning in Fase 2.
 * Stored as VARCHAR in the database (EnumType.STRING).
 */
public enum DifficultyLevel {
    EASY,
    MEDIUM,
    HARD
}
