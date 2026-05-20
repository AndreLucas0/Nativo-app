-- V2__create_indexes.sql
-- Performance indexes for Nativo App - MVP Fase 1
-- Requirements: REQ-25, REQ-28

-- =============================================
-- users
-- =============================================

-- Authentication queries (email lookup)
CREATE UNIQUE INDEX idx_user_email ON users(email);

-- Ranking queries - Fase 3 preparation
CREATE INDEX idx_user_total_xp ON users(total_xp);

-- =============================================
-- courses
-- =============================================

-- URL routing by slug
CREATE UNIQUE INDEX idx_course_slug ON courses(slug);

-- Active course listing ordered by display_order
CREATE INDEX idx_course_active_order ON courses(is_active, display_order);

-- =============================================
-- modules
-- =============================================

-- Ordered module listing per course
CREATE INDEX idx_module_course_order ON modules(course_id, display_order);

-- =============================================
-- lessons
-- =============================================

-- Ordered lesson listing per module
CREATE INDEX idx_lesson_module_order ON lessons(module_id, display_order);

-- =============================================
-- exercises
-- =============================================

-- Ordered exercise listing per lesson
CREATE INDEX idx_exercise_lesson_order ON exercises(lesson_id, display_order);

-- =============================================
-- user_progress
-- =============================================

-- Progress lookup by user + course (unique constraint already creates an index,
-- but an explicit named index improves readability and query planning)
CREATE UNIQUE INDEX idx_progress_user_course ON user_progress(user_id, course_id);

-- Dashboard queries: all progress records for a user
CREATE INDEX idx_progress_user ON user_progress(user_id);

-- =============================================
-- lesson_completions
-- =============================================

-- History queries: completions per user + lesson ordered by date
CREATE INDEX idx_completion_user_lesson_date ON lesson_completions(user_id, lesson_id, completed_at);

-- Course progress queries: all completions for a user in a course
CREATE INDEX idx_completion_user_course ON lesson_completions(user_id, course_id);

-- =============================================
-- exercise_attempts
-- =============================================

-- Performance analysis: attempts per user + exercise ordered by date
CREATE INDEX idx_attempt_user_exercise_date ON exercise_attempts(user_id, exercise_id, attempted_at);

-- Lesson attempt queries
CREATE INDEX idx_attempt_user_lesson ON exercise_attempts(user_id, lesson_id);

-- Exercise difficulty analysis - Fase 2 preparation
CREATE INDEX idx_attempt_exercise_correct ON exercise_attempts(exercise_id, is_correct);

-- =============================================
-- achievements
-- =============================================

-- Active achievement listing ordered by display_order
CREATE INDEX idx_achievement_active_order ON achievements(is_active, display_order);

-- =============================================
-- user_achievements
-- =============================================

-- User achievement queries (unique constraint already covers this,
-- explicit named index for clarity)
CREATE UNIQUE INDEX idx_user_achievement ON user_achievements(user_id, achievement_id);

-- Achievement timeline queries
CREATE INDEX idx_user_achievement_date ON user_achievements(user_id, unlocked_at);
