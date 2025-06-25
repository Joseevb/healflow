package dev.jose.backend.api.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Builder;

@Builder
public record LoginRequestDto(
        @NotNull(message = "Email address is required.")
                @NotBlank(message = "Email address cannot be empty or consist only of whitespace.")
                String email,
        @NotNull(message = "Password is required.")
                @NotBlank(message = "Password cannot be empty or consist only of whitespace.")
                String password) {}
