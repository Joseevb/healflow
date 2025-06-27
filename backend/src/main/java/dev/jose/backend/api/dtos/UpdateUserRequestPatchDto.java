package dev.jose.backend.api.dtos;

import dev.jose.backend.enumerations.UserRole;
import dev.jose.backend.validation.ValidEnum;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import lombok.Builder;

@Schema(
        name = "UpdateUserRequestPatch",
        description = "Request body for partially updating a user",
        example =
                """
                {
                    "email": "user@example.com",
                    "first_name": "John",
                    "last_name": "Doe",
                    "role": "USER"
                }
                """)
@Builder
public record UpdateUserRequestPatchDto(
        @Nullable
                @Email(message = "The provided email address is not in a valid format.")
                @NotBlank(message = "Email address cannot be empty or consist only of whitespace.")
                String email,
        @Nullable @NotBlank(message = "First name cannot be empty or consist only of whitespace.")
                String fistName,
        @Nullable @NotBlank(message = "Last name cannot be empty or consist only of whitespace.")
                String lastName,
        @Nullable @ValidEnum(UserRole.class) UserRole role)
        implements BaseUpdateUserRequest {}
