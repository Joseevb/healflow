package dev.jose.backend.api.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Schema(
    name = "VerifyUserRequest",
    description = "Request used to verify a user's account via a token",
    example =
        """
        {
            "token": "535523"
        }
        """)
@Builder
public record VerifyUserRequestDto(
    @NotBlank(message = "Token is required") @NotNull(message = "Token is required")
        String token) {}
