package dev.jose.backend.api;

import dev.jose.backend.api.dtos.LoginRequestDto;
import dev.jose.backend.api.dtos.LoginResponseDto;
import dev.jose.backend.api.dtos.RegisterUserRequestDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.api.dtos.VerifyUserRequestDto;
import dev.jose.backend.api.exceptions.GlobalExceptionHandler.ErrorMessage;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Tag(name = "Auth", description = "Endpoint to manage authentication and authorization")
@RequestMapping("/auth")
public interface AuthApi {

    @Operation(
            operationId = "login",
            summary = "Authenticates as an existing user",
            description =
                    "Authenticates via email and password as an existing user, and returns the JWT"
                            + " and Refresh tokens, as well as the user's ID and role",
            requestBody =
                    @io.swagger.v3.oas.annotations.parameters.RequestBody(
                            description = "Details for the user to authenticate",
                            required = true,
                            content =
                                    @Content(
                                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                                            schema =
                                                    @Schema(
                                                            name = "LoginRequest",
                                                            implementation = LoginRequestDto.class,
                                                            example =
                                                                    """
                                                                    {
                                                                        "email": "user@example.com",
                                                                        "password": "StrongPassword123"
                                                                    }
                                                                    """))),
            responses = {
                @ApiResponse(
                        responseCode = "200",
                        description = "The user was authenticated successfully",
                        content =
                                @Content(
                                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                                        schema = @Schema(implementation = LoginResponseDto.class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "The request was invalid (e.g., missing email/password)",
                        content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                @ApiResponse(
                        responseCode = "401",
                        description = "Invalid credentials (e.g., incorrect email/password)",
                        content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                @ApiResponse(
                        responseCode = "500",
                        description = "Internal server error",
                        content = {@Content(schema = @Schema(implementation = ErrorMessage.class))})
            })
    @PostMapping("/login")
    ResponseEntity<LoginResponseDto> login(@RequestBody @Valid LoginRequestDto login);

    @Operation(
            operationId = "registerUser",
            summary = "Registers a new user account",
            description =
                    "Creates a new user account with the provided details. "
                            + "Upon successful registration, a 201 Created response is returned, "
                            + "including the new user's ID and a 'Location' header pointing to the "
                            + "newly created user resource (e.g., /api/v1/users/{id}).",
            tags = {"Users"},
            requestBody =
                    @io.swagger.v3.oas.annotations.parameters.RequestBody(
                            description = "Details for the new user account",
                            required = true,
                            content =
                                    @Content(
                                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                                            schema =
                                                    @Schema(
                                                            name = "RegisterUserRequest",
                                                            implementation =
                                                                    RegisterUserRequestDto.class,
                                                            example =
                                                                    """
                                                                    {
                                                                        "email": "user@example.com",
                                                                        "password": "StrongPassword123",
                                                                        "first_name": "John",
                                                                        "last_name": "Doe"
                                                                    }
                                                                    """))),
            responses = {
                @ApiResponse(
                        responseCode = "201",
                        description = "User account created successfully",
                        content =
                                @Content(
                                        mediaType = MediaType.APPLICATION_JSON_VALUE,
                                        schema = @Schema(implementation = UserResponseDto.class)),
                        headers =
                                @io.swagger.v3.oas.annotations.headers.Header(
                                        name = "Location",
                                        description = "URL of the newly created user resource",
                                        schema = @Schema(type = "string", format = "uri"))),
                @ApiResponse(
                        responseCode = "400",
                        description =
                                "Invalid request payload (e.g., missing fields, invalid email"
                                        + " format, weak password)",
                        content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                @ApiResponse(
                        responseCode = "409",
                        description = "Conflict: A user with the provided email already exists",
                        content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                @ApiResponse(
                        responseCode = "500",
                        description = "Internal server error",
                        content = {@Content(schema = @Schema(implementation = ErrorMessage.class))})
            })
    @PostMapping("/register")
    ResponseEntity<UserResponseDto> register(@RequestBody @Valid RegisterUserRequestDto register);

    @PostMapping("/verify")
    ResponseEntity<Void> verifyAccount(@RequestBody @Valid VerifyUserRequestDto token);
}
