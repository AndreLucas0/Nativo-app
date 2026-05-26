package com.nativo.api.web;

import com.nativo.api.application.lesson.LessonCompleteResponse;
import com.nativo.api.application.lesson.LessonContentResponse;
import com.nativo.api.application.lesson.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
@Tag(name = "Lessons", description = "Conteúdo e conclusão de lições")
public class LessonController {

    private final LessonService lessonService;

    @GetMapping("/{id}")
    @Operation(summary = "Retorna o conteúdo de uma lição sem as respostas corretas")
    public ResponseEntity<LessonContentResponse> getLessonContent(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(lessonService.getLessonContent(id, userId));
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Finaliza uma lição e processa XP + streak")
    public ResponseEntity<LessonCompleteResponse> completeLesson(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(lessonService.completeLesson(id, userId));
    }
}
