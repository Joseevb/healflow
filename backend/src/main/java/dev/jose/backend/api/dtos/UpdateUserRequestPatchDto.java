package dev.jose.backend.api.dtos;

import dev.jose.backend.enumerations.UserRole;
import dev.jose.backend.validation.ValidEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
    @Schema(requiredMode = RequiredMode.NOT_REQUIRED)
        @Nullable
        @Email(message = "The provided email address is not in a valid format.")
        @Size(min = 1, message = "First name cannot be blank.")
        @Pattern(
            regexp = "\\S+",
            message = "Email address cannot be empty or consist only of whitespace.")
        String email,
    @Schema(requiredMode = RequiredMode.NOT_REQUIRED)
        @Size(min = 1, message = "First name cannot be blank.")
        @Nullable
        @Pattern(regexp = "\\S+", message = "First name cannot be blank or whitespace only.")
        String fistName,
    @Schema(requiredMode = RequiredMode.NOT_REQUIRED)
        @Nullable
        @Size(min = 1, message = "First name cannot be blank.")
        @Pattern(
            regexp = "\\S+",
            message = "Last name cannot be empty or consist only of whitespace.")
        String lastName,
    @Schema(
            requiredMode = RequiredMode.NOT_REQUIRED,
            description =
                """
                Role, can only be set by administrators.
                Will return an error when setting while authenticated as a non administrator user
                """)
        @Nullable
        @ValidEnum(UserRole.class)
        UserRole role,
    @Schema(
            requiredMode = RequiredMode.NOT_REQUIRED,
            description =
                """
                Active flag, can only be set by administrators.
                Will return an error when setting while authenticated as a non administrator user
                """)
        @Nullable
        boolean isActive)
    implements BaseUpdateUserRequest {}
