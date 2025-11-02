package dev.jose.healflow_api.api.models.errors;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Builder;

@Schema(name = "ApiErrorResponse", description = "API error response")
@Builder
public record ApiErrorResponseDto(
    LocalDateTime timestamp, short status, String error, String message, String path) {}
