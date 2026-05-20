-- V1__initial_schema.sql
-- Initial schema for Nativo App - MVP Fase 1
-- Tables created in FK dependency order

-- 1. users
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email               VARCHAR(255) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    name                VARCHAR(255) NOT NULL,
    profile_image_url   TEXT,
    total_xp            INT NOT NULL DEFAULT 0,
    current_level       INT NOT NULL DEFAULT 1,
    current_streak      INT NOT NULL DEFAULT 0,
    longest_streak      INT NOT NULL DEFAULT 0,
    last_activity_date  DATE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE
);

-- 2. courses
CREATE TABLE courses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    image_url       TEXT,
    difficulty      VARCHAR(20) NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    display_order   INT NOT NULL,
    estimated_hours INT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);

-- 3. modules
CREATE TABLE modules (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    name          VARCHAR(255) NOT NULL,
    description   TEXT NOT NULL,
    display_order INT NOT NULL,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMP WITH TIME ZONE,
    UNIQUE (course_id, display_order)
);

-- 4. lessons
CREATE TABLE lessons (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id         UUID NOT NULL REFERENCES modules(id) ON DELETE RESTRICT,
    name              VARCHAR(255) NOT NULL,
    content           TEXT NOT NULL,
    display_order     INT NOT NULL,
    xp_reward         INT NOT NULL DEFAULT 10,
    minimum_score     INT NOT NULL DEFAULT 70 CHECK (minimum_score >= 0 AND minimum_score <= 100),
    estimated_minutes INT,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMP WITH TIME ZONE,
    UNIQUE (module_id, display_order)
);

-- 5. exercises
CREATE TABLE exercises (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id        UUID NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
    type             VARCHAR(20) NOT NULL CHECK (type IN ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_CODE', 'MATCH', 'ORDER_STEPS')),
    question         TEXT NOT NULL,
    options          JSONB,
    correct_answer   TEXT NOT NULL,
    explanation      TEXT,
    display_order    INT NOT NULL,
    points           INT NOT NULL DEFAULT 10,
    difficulty_level VARCHAR(10) CHECK (difficulty_level IN ('EASY', 'MEDIUM', 'HARD')),
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMP WITH TIME ZONE,
    UNIQUE (lesson_id, display_order)
);

-- 6. user_progress
CREATE TABLE user_progress (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id               UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    current_module_id       UUID REFERENCES modules(id) ON DELETE SET NULL,
    current_lesson_id       UUID REFERENCES lessons(id) ON DELETE SET NULL,
    total_xp_earned         INT NOT NULL DEFAULT 0,
    completed_lessons_count INT NOT NULL DEFAULT 0,
    last_accessed_at        TIMESTAMP WITH TIME ZONE,
    started_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at            TIMESTAMP WITH TIME ZONE,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, course_id)
);

-- 7. lesson_completions
CREATE TABLE lesson_completions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id           UUID NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
    course_id           UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    score               INT NOT NULL,
    xp_earned           INT NOT NULL,
    completed_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    time_spent_seconds  INT,
    attempt_number      INT NOT NULL DEFAULT 1,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 8. exercise_attempts
CREATE TABLE exercise_attempts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id         UUID NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
    lesson_id           UUID NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
    user_answer         TEXT NOT NULL,
    is_correct          BOOLEAN NOT NULL,
    attempted_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    time_spent_seconds  INT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 9. achievements
CREATE TABLE achievements (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    description   TEXT NOT NULL,
    icon_url      TEXT,
    category      VARCHAR(20) NOT NULL CHECK (category IN ('STREAK', 'LESSONS', 'XP', 'COURSE', 'SPECIAL')),
    criteria      JSONB NOT NULL,
    xp_reward     INT NOT NULL DEFAULT 0,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 10. user_achievements
CREATE TABLE user_achievements (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE RESTRICT,
    unlocked_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, achievement_id)
);
