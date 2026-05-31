-- ============================================================
-- V1: Schema inicial completo
-- ============================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255)                NOT NULL,
    password_hash   VARCHAR(255)                NOT NULL,
    name            VARCHAR(255)                NOT NULL,
    profile_image_url VARCHAR(2048),
    total_xp        INT                         NOT NULL DEFAULT 0,
    current_level   INT                         NOT NULL DEFAULT 1,
    current_streak  INT                         NOT NULL DEFAULT 0,
    longest_streak  INT                         NOT NULL DEFAULT 0,
    last_activity_date DATE,
    deleted_at      TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE    NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE    NOT NULL
);

CREATE TABLE courses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            VARCHAR(100)                NOT NULL,
    title           VARCHAR(255)                NOT NULL,
    description     TEXT,
    icon_url        VARCHAR(2048),
    is_active       BOOLEAN                     NOT NULL DEFAULT TRUE,
    display_order   INT                         NOT NULL DEFAULT 0,
    total_xp_reward INT                         NOT NULL DEFAULT 0,
    estimated_hours INT,
    difficulty      VARCHAR(50),
    deleted_at      TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE    NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE    NOT NULL
);

CREATE TABLE modules (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id     UUID                        NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    title         VARCHAR(255)                NOT NULL,
    description   TEXT,
    display_order INT                         NOT NULL,
    is_active     BOOLEAN                     NOT NULL DEFAULT TRUE,
    deleted_at    TIMESTAMP WITH TIME ZONE,
    created_at    TIMESTAMP WITH TIME ZONE    NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE    NOT NULL
);

CREATE TABLE lessons (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id       UUID                        NOT NULL REFERENCES modules(id) ON DELETE RESTRICT,
    course_id       UUID                        NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    title           VARCHAR(255)                NOT NULL,
    description     TEXT,
    content         TEXT,
    display_order   INT                         NOT NULL,
    xp_reward       INT                         NOT NULL DEFAULT 10,
    minimum_score   INT                         NOT NULL DEFAULT 70,
    is_active       BOOLEAN                     NOT NULL DEFAULT TRUE,
    deleted_at      TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE    NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE    NOT NULL
);

CREATE TABLE exercises (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id      UUID                        NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
    question       TEXT                        NOT NULL,
    exercise_type  VARCHAR(50)                 NOT NULL,
    options        JSONB,
    correct_answer TEXT                        NOT NULL,
    explanation    TEXT,
    display_order  INT                         NOT NULL,
    deleted_at     TIMESTAMP WITH TIME ZONE,
    created_at     TIMESTAMP WITH TIME ZONE    NOT NULL,
    updated_at     TIMESTAMP WITH TIME ZONE    NOT NULL
);

CREATE TABLE user_progress (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                  UUID                        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id                UUID                        NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    current_module_id        UUID REFERENCES modules(id),
    current_lesson_id        UUID REFERENCES lessons(id),
    total_xp_earned          INT                         NOT NULL DEFAULT 0,
    completed_lessons_count  INT                         NOT NULL DEFAULT 0,
    progress_percentage      DECIMAL(5, 2)               NOT NULL DEFAULT 0,
    started_at               TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT now(),
    completed_at             TIMESTAMP WITH TIME ZONE,
    created_at               TIMESTAMP WITH TIME ZONE    NOT NULL,
    updated_at               TIMESTAMP WITH TIME ZONE    NOT NULL
);

CREATE TABLE lesson_completions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID                        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id   UUID                        NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
    course_id   UUID                        NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    score       INT                         NOT NULL,
    xp_earned   INT                         NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE   NOT NULL DEFAULT now(),
    created_at  TIMESTAMP WITH TIME ZONE    NOT NULL,
    updated_at  TIMESTAMP WITH TIME ZONE    NOT NULL
);

CREATE TABLE exercise_attempts (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               UUID                        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id           UUID                        NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
    lesson_completion_id  UUID REFERENCES lesson_completions(id),
    given_answer          TEXT                        NOT NULL,
    is_correct            BOOLEAN                     NOT NULL,
    attempted_at          TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT now(),
    created_at            TIMESTAMP WITH TIME ZONE    NOT NULL,
    updated_at            TIMESTAMP WITH TIME ZONE    NOT NULL
);

CREATE TABLE achievements (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(255)                NOT NULL,
    description TEXT,
    icon_url    VARCHAR(2048),
    category    VARCHAR(50)                 NOT NULL,
    criteria    JSONB,
    xp_reward   INT                         NOT NULL DEFAULT 0,
    created_at  TIMESTAMP WITH TIME ZONE    NOT NULL,
    updated_at  TIMESTAMP WITH TIME ZONE    NOT NULL
);

CREATE TABLE user_achievements (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID                        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID                        NOT NULL REFERENCES achievements(id) ON DELETE RESTRICT,
    earned_at      TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT now(),
    created_at     TIMESTAMP WITH TIME ZONE    NOT NULL,
    updated_at     TIMESTAMP WITH TIME ZONE    NOT NULL
);
