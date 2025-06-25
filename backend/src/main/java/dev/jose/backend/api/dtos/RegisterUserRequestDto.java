package dev.jose.backend.api.dtos;

import dev.jose.backend.validation.Password;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Builder;

@Builder
public record RegisterUserRequestDto(
        @NotNull(message = "Email address is required.")
                @Email(message = "The provided email address is not in a valid format.")
                @NotBlank(message = "Email address cannot be empty or consist only of whitespace.")
                String email,
        @NotNull(message = "Password is required.")
                @NotBlank(message = "Password cannot be empty or consist only of whitespace.")
                @Password(
                        message =
                                "Password must be at least 8 characters long and include at least"
                                    + " one uppercase letter, one lowercase letter, one digit, and"
                                    + " one special character. Spaces are not allowed.")
                String password,
        @NotNull(message = "First name is required.")
                @NotBlank(message = "First name cannot be empty or consist only of whitespace.")
                String firstName,
        @NotNull(message = "Last name is required.")
                @NotBlank(message = "Last name cannot be empty or consist only of whitespace.")
                String lastName) {}
