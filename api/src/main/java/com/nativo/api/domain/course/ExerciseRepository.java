package com.nativo.api.domain.course;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {
    List<Exercise> findByLessonIdOrderByDisplayOrderAsc(UUID lessonId);
}
