package dev.jose.healflow_api.api.models;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import java.util.UUID;
import lombok.Builder;

// TODO: add more fields
@Schema(name = "ProvisionUserRequest", description = "Request to provision a user")
@Builder
public record ProvisionUserRequestDTO(
    @Schema(description = "User ID", requiredMode = RequiredMode.REQUIRED) UUID userId,
    @Schema(description = "User email", requiredMode = RequiredMode.REQUIRED) String email,
    @Schema(description = "Primary specialist ID", requiredMode = RequiredMode.REQUIRED)
        UUID specialistId) {}
