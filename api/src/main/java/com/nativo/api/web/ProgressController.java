package com.nativo.api.web;

import com.nativo.api.application.progress.CourseProgressResponse;
import com.nativo.api.application.progress.DashboardResponse;
import com.nativo.api.application.progress.ProgressService;
import com.nativo.api.application.progress.ProgressSummaryResponse;
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
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@Tag(name = "Progress", description = "Progresso e dashboard do usuário")
public class ProgressController {

    private final ProgressService progressService;

    @GetMapping
    @Operation(summary = "Lista o progresso do usuário em todos os cursos")
    public ResponseEntity<List<ProgressSummaryResponse>> getAllProgress(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(progressService.getAllProgress(userId));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Dashboard com stats do usuário, cursos ativos e conclusões recentes")
    public ResponseEntity<DashboardResponse> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(progressService.getDashboard(userId));
    }

    @GetMapping("/{courseId}")
    @Operation(summary = "Detalha o progresso do usuário em um curso específico")
    public ResponseEntity<CourseProgressResponse> getCourseProgress(
            @PathVariable UUID courseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(progressService.getCourseProgress(userId, courseId));
    }
}
