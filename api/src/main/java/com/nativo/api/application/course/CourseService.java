package com.nativo.api.application.course;

import com.nativo.api.domain.course.Course;
import com.nativo.api.domain.course.CourseModule;
import com.nativo.api.domain.course.CourseRepository;
import com.nativo.api.domain.course.Lesson;
import com.nativo.api.domain.progress.UserProgress;
import com.nativo.api.domain.progress.UserProgressRepository;
import com.nativo.api.domain.user.UserRepository;
import com.nativo.api.infrastructure.exception.ConflictException;
import com.nativo.api.infrastructure.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;

    public List<CourseListItem> listActiveCourses() {
        return courseRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::toCourseListItem)
                .toList();
    }

    public CourseDetailResponse getCourseDetails(String slug) {
        var course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado: " + slug));
        return toCourseDetailResponse(course);
    }

    @Transactional
    public EnrollResponse enrollInCourse(UUID userId, String slug) {
        var course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado: " + slug));

        if (userProgressRepository.existsByUserIdAndCourseId(userId, course.getId())) {
            throw new ConflictException("Usuário já está matriculado neste curso.");
        }

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        var progress = UserProgress.builder()
                .user(user)
                .course(course)
                .startedAt(Instant.now())
                .build();

        var saved = userProgressRepository.save(progress);
        return new EnrollResponse(saved.getId(), course.getId(), course.getSlug(), saved.getStartedAt());
    }

    private CourseListItem toCourseListItem(Course course) {
        return new CourseListItem(
                course.getId(),
                course.getSlug(),
                course.getTitle(),
                course.getDescription(),
                course.getIconUrl(),
                course.getTotalXpReward(),
                course.getEstimatedHours(),
                course.getDifficulty() != null ? course.getDifficulty().name() : null
        );
    }

    private CourseDetailResponse toCourseDetailResponse(Course course) {
        var modules = course.getModules().stream()
                .filter(CourseModule::isActive)
                .map(this::toModuleResponse)
                .toList();

        return new CourseDetailResponse(
                course.getId(),
                course.getSlug(),
                course.getTitle(),
                course.getDescription(),
                course.getIconUrl(),
                course.getTotalXpReward(),
                course.getEstimatedHours(),
                course.getDifficulty() != null ? course.getDifficulty().name() : null,
                modules
        );
    }

    private CourseDetailResponse.ModuleResponse toModuleResponse(CourseModule module) {
        var lessons = module.getLessons().stream()
                .filter(Lesson::isActive)
                .map(this::toLessonResponse)
                .toList();

        return new CourseDetailResponse.ModuleResponse(
                module.getId(),
                module.getTitle(),
                module.getDescription(),
                module.getDisplayOrder(),
                lessons
        );
    }

    private CourseDetailResponse.ModuleResponse.LessonResponse toLessonResponse(Lesson lesson) {
        return new CourseDetailResponse.ModuleResponse.LessonResponse(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.getDisplayOrder(),
                lesson.getXpReward()
        );
    }
}
