package dev.jose.backend.api.routers;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;

import dev.jose.backend.api.dtos.LoginRequestDto;
import dev.jose.backend.api.dtos.LoginResponseDto;
import dev.jose.backend.api.dtos.RegisterUserRequestDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.api.dtos.VerifyUserRequestDto;
import dev.jose.backend.api.exceptions.GlobalExceptionHandler.ErrorMessage;
import dev.jose.backend.api.exceptions.GlobalExceptionHandler.ValidationErrorMessage;
import dev.jose.backend.api.handlers.AuthHandler;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springdoc.core.annotations.RouterOperation;
import org.springdoc.core.annotations.RouterOperations;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class AuthRouter {

  public static final String BASE_PATH = "/auth";
  public static final String LOGIN_PATH = "/login";
  public static final String REGISTER_PATH = "/register";
  public static final String VERIFY_PATH = "/verify";

  @Bean
  @RouterOperations({
    @RouterOperation(
        path = BASE_PATH + LOGIN_PATH,
        beanClass = AuthHandler.class,
        beanMethod = "login",
        method = RequestMethod.POST,
        operation =
            @Operation(
                operationId = "login",
                summary = "Authenticates as an existing user",
                description =
                    "Authenticates via email and password as an existing user, and returns the JWT"
                        + " and Refresh tokens, as well as the user's ID and role",
                tags = {"Auth"},
                requestBody =
                    @RequestBody(
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
                      content =
                          @Content(
                              schema = @Schema(implementation = ValidationErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "401",
                      description = "Invalid credentials (e.g., incorrect email/password)",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "500",
                      description = "Internal server error",
                      content = {@Content(schema = @Schema(implementation = ErrorMessage.class))})
                })),
    @RouterOperation(
        path = BASE_PATH + REGISTER_PATH,
        beanClass = AuthHandler.class,
        beanMethod = "register",
        method = RequestMethod.POST,
        operation =
            @Operation(
                operationId = "registerUser",
                summary = "Registers a new user account",
                description =
                    "Creates a new user account with the provided details. "
                        + "Upon successful registration, a 201 Created response is returned, "
                        + "including the new user's ID and a 'Location' header pointing to the "
                        + "newly created user resource (e.g., /api/v1/users/{id}).",
                tags = {"Auth", "Users"},
                requestBody =
                    @RequestBody(
                        description = "Details for the new user account",
                        required = true,
                        content =
                            @Content(
                                mediaType = MediaType.APPLICATION_JSON_VALUE,
                                schema =
                                    @Schema(
                                        name = "RegisterUserRequest",
                                        implementation = RegisterUserRequestDto.class,
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
                          @Header(
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
                })),
    @RouterOperation(
        path = BASE_PATH + VERIFY_PATH,
        beanClass = AuthHandler.class,
        beanMethod = "verifyAccount",
        method = RequestMethod.POST,
        operation =
            @Operation(
                operationId = "verifyAccount",
                summary = "Verifies an user account with a verification token",
                description = "Verifies an existing user account with a verification token.",
                tags = {"Auth"},
                requestBody =
                    @RequestBody(
                        description = "Verification token",
                        required = true,
                        content =
                            @Content(
                                mediaType = MediaType.APPLICATION_JSON_VALUE,
                                schema =
                                    @Schema(
                                        name = "VerifyUserRequest",
                                        implementation = VerifyUserRequestDto.class,
                                        example =
                                            """
                                            {
                                                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                                            }
                                            """))),
                responses = {
                  @ApiResponse(
                      responseCode = "204",
                      description = "User account verified successfully"),
                  @ApiResponse(
                      responseCode = "400",
                      description = "The request was invalid (e.g., missing token)",
                      content =
                          @Content(
                              schema =
                                  @Schema(
                                      implementation = ErrorMessage.class,
                                      example =
                                          """
                                          {
                                            "timestamp": "2023-03-30T15:00:00.000Z",
                                            "status": 400,
                                            "error": "Bad Request",
                                            "messages": {
                                              "token": "Token is required"
                                            }
                                            "path": "/api/v1/auth/verify"
                                          }
                                          """))),
                  @ApiResponse(
                      responseCode = "401",
                      description = "Invalid token (e.g., expired, invalid)",
                      content = @Content(schema = @Schema(implementation = ErrorMessage.class))),
                  @ApiResponse(
                      responseCode = "500",
                      description = "Internal server error",
                      content = {@Content(schema = @Schema(implementation = ErrorMessage.class))})
                }))
  })
  RouterFunction<ServerResponse> authRoutes(AuthHandler authHandler) {
    return route()
        .path(
            BASE_PATH,
            b1 ->
                b1.POST(LOGIN_PATH, authHandler::login)
                    .POST(REGISTER_PATH, authHandler::register)
                    .POST(VERIFY_PATH, authHandler::verifyAccount)
                    .build())
        .build();
  }
}
