-- ============================================================
-- V2: Índices para performance
-- ============================================================

CREATE UNIQUE INDEX idx_users_email                  ON users(email);
CREATE INDEX        idx_users_total_xp               ON users(total_xp);

CREATE UNIQUE INDEX idx_courses_slug                 ON courses(slug);
CREATE INDEX        idx_courses_active_order         ON courses(is_active, display_order);

CREATE UNIQUE INDEX idx_modules_course_order         ON modules(course_id, display_order) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_lessons_module_order         ON lessons(module_id, display_order) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_exercises_lesson_order       ON exercises(lesson_id, display_order) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX idx_user_progress_user_course    ON user_progress(user_id, course_id);
CREATE INDEX        idx_user_progress_user           ON user_progress(user_id);

CREATE INDEX        idx_lesson_completions_user      ON lesson_completions(user_id, lesson_id, completed_at);
CREATE INDEX        idx_lesson_completions_course    ON lesson_completions(user_id, course_id);

CREATE INDEX        idx_exercise_attempts_user       ON exercise_attempts(user_id, exercise_id, attempted_at);
CREATE INDEX        idx_exercise_attempts_correct    ON exercise_attempts(exercise_id, is_correct);

CREATE UNIQUE INDEX idx_user_achievements_unique     ON user_achievements(user_id, achievement_id);
