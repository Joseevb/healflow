package dev.jose.backend.api.dtos;

import dev.jose.backend.enumerations.UserRole;
import dev.jose.backend.validation.ValidEnum;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Builder;

@Builder
public record UpdateUserRequestPutDto(
        @NotNull(message = "Email address is required.")
                @Email(message = "The provided email address is not in a valid format.")
                @NotBlank(message = "Email address cannot be empty or consist only of whitespace.")
                String email,
        @NotNull(message = "First name is required.")
                @NotBlank(message = "First name cannot be empty or consist only of whitespace.")
                String fistName,
        @NotNull(message = "Last name is required.")
                @NotBlank(message = "Last name cannot be empty or consist only of whitespace.")
                String lastName,
        @NotNull(message = "Role is required.") @ValidEnum(UserRole.class) UserRole role)
        implements BaseUpdateUserRequest {}
