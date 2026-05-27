package com.nativo.api.domain.progress;

import com.nativo.api.domain.common.BaseEntity;
import com.nativo.api.domain.course.Exercise;
import com.nativo.api.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "exercise_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseAttempt extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_completion_id")
    private LessonCompletion lessonCompletion;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String givenAnswer;

    @Column(name = "is_correct", nullable = false)
    private boolean correct;

    @Column(nullable = false)
    private Instant attemptedAt;
}
