package com.nativo.api.web;

import com.nativo.api.application.exercise.ExerciseService;
import com.nativo.api.application.exercise.ExerciseSubmitRequest;
import com.nativo.api.application.exercise.ExerciseSubmitResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
@Tag(name = "Exercises", description = "Submissão de respostas para exercícios")
public class ExerciseController {

    private final ExerciseService exerciseService;

    @PostMapping("/{id}/submit")
    @Operation(summary = "Submete uma resposta para um exercício")
    public ResponseEntity<ExerciseSubmitResponse> submitAnswer(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid ExerciseSubmitRequest request) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(exerciseService.submitAnswer(id, userId, request));
    }
}
