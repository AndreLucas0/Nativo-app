package com.nativo.api.domain.progress;

import com.nativo.api.domain.common.BaseEntity;
import com.nativo.api.domain.course.Course;
import com.nativo.api.domain.course.CourseModule;
import com.nativo.api.domain.course.Lesson;
import com.nativo.api.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "user_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProgress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_module_id")
    private CourseModule currentModule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_lesson_id")
    private Lesson currentLesson;

    @Column(nullable = false)
    @Builder.Default
    private int totalXpEarned = 0;

    @Column(nullable = false)
    @Builder.Default
    private int completedLessonsCount = 0;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal progressPercentage = BigDecimal.ZERO;

    @Column(nullable = false)
    private Instant startedAt;

    private Instant completedAt;
}
