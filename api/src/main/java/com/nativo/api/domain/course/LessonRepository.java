package com.nativo.api.domain.course;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByModuleIdAndActiveTrueOrderByDisplayOrderAsc(UUID moduleId);
    int countByCourseIdAndActiveTrue(UUID courseId);
}
