package dev.jose.backend.api.dtos;

import com.fasterxml.jackson.annotation.JsonView;

import dev.jose.backend.api.Views;
import dev.jose.backend.enumerations.UserRole;
import dev.jose.backend.validation.ValidEnum;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Builder;

@Schema(
        name = "UpdateUserRequestPut",
        description = "Request body for updating a user",
        example =
                """
                {
                    "email": "user@example.com",
                    "password": "StrongPassword123!",
                    "first_name": "John",
                    "last_name": "Doe",
                    "role": "USER"
                }
                """)
@Builder
public record UpdateUserRequestPutDto(
        @NotNull(message = "Email address is required.")
                @Email(message = "The provided email address is not in a valid format.")
                @NotBlank(message = "Email address cannot be empty or consist only of whitespace.")
                String email,
        @NotNull(message = "First name is required.")
                @NotBlank(message = "First name cannot be empty or consist only of whitespace.")
                String firstName,
        @NotNull(message = "Last name is required.")
                @NotBlank(message = "Last name cannot be empty or consist only of whitespace.")
                String lastName,
        @Schema(
                        requiredMode = RequiredMode.NOT_REQUIRED,
                        description =
                                """
                                Role, can only be set by administrators.
                                Will return an error when setting while authenticated as a non administrator user
                                """)
                @NotNull(message = "Role is required.")
                @ValidEnum(UserRole.class)
                @JsonView(Views.AdminUpdate.class)
                UserRole role,
        @NotNull(message = "Active flag is required")
                @Schema(
                        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
                        description =
                                """
                                Active flag, can only be set by administrators.
                                Will return an error when setting while authenticated as a non administrator user
                                """)
                @JsonView(Views.AdminUpdate.class)
                boolean isActive)
        implements BaseUpdateUserRequest {}
