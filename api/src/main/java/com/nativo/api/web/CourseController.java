package com.nativo.api.web;

import com.nativo.api.application.course.CourseDetailResponse;
import com.nativo.api.application.course.CourseListItem;
import com.nativo.api.application.course.CourseService;
import com.nativo.api.application.course.EnrollResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Courses", description = "Listagem e matrícula em cursos")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @Operation(summary = "Listar cursos ativos")
    public ResponseEntity<List<CourseListItem>> listCourses() {
        return ResponseEntity.ok(courseService.listActiveCourses());
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Detalhes de um curso com módulos e lições")
    public ResponseEntity<CourseDetailResponse> getCourse(@PathVariable String slug) {
        return ResponseEntity.ok(courseService.getCourseDetails(slug));
    }

    @PostMapping("/{slug}/enroll")
    @Operation(summary = "Matricular usuário autenticado no curso")
    public ResponseEntity<EnrollResponse> enroll(
            @PathVariable String slug,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(courseService.enrollInCourse(userId, slug));
    }
}
