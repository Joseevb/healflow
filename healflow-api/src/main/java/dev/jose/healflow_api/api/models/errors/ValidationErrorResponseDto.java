package dev.jose.healflow_api.api.models.errors;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.Map;

@Schema(name = "ValidationErrorResponse", description = "Validation error response")
public record ValidationErrorResponseDto(
    LocalDateTime timestamp,
    short status,
    String error,
    Map<String, String> messages,
    String path) {}
