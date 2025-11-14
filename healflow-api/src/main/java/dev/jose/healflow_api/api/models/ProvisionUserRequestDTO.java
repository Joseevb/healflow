package dev.jose.healflow_api.api.models;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import lombok.Builder;

// TODO: add more fields
@Schema(name = "ProvisionUserRequest", description = "Request to provision a user")
@Builder
public record ProvisionUserRequestDTO(
    @Schema(description = "User ID", requiredMode = RequiredMode.REQUIRED) String userId,
    @Schema(description = "User email", requiredMode = RequiredMode.REQUIRED) String email) {}
