package dev.jose.backend.api.exceptions;

import static dev.jose.backend.utils.StringUtils.toSnake;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.mail.MessagingException;

import lombok.Builder;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.server.ServerWebInputException;

import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(WebExchangeBindException.class)
    public Mono<ResponseEntity<ValidationErrorMessage>> handleValidationExceptions(
            final WebExchangeBindException ex, final ServerHttpRequest request) {

        final var errors =
                ex.getBindingResult().getFieldErrors().stream()
                        .collect(
                                Collectors.toMap(
                                        fe -> toSnake(fe.getField()),
                                        FieldError::getDefaultMessage,
                                        (a, _) -> a));

        return buildValidationErrorResponse(errors, request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public Mono<ResponseEntity<ErrorMessage>> handleAccessDeniedExceptions(
            final AccessDeniedException ex, final ServerHttpRequest request) {
        return buildErrorResponse(
                ex.getMessage(), "Authorization failed", request, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ServerWebInputException.class)
    public Mono<ResponseEntity<ErrorMessage>> handleServerWebInputException(
            final ServerWebInputException ex, final ServerHttpRequest request) {

        if (ex.getCause() instanceof InvalidFormatException invalidFormatEx) {
            String fieldName = invalidFormatEx.getPath().get(0).getFieldName();
            String invalidValue =
                    invalidFormatEx.getValue() != null
                            ? invalidFormatEx.getValue().toString()
                            : "null";

            String errorMessage =
                    "Invalid value '%s' for field '%s'. Expected type: %s"
                            .formatted(
                                    invalidValue,
                                    fieldName,
                                    invalidFormatEx.getTargetType().getSimpleName());

            if (invalidFormatEx.getTargetType().isEnum()) {
                errorMessage =
                        "Invalid value '%s' for field '%s'. Accepted values: %s"
                                .formatted(
                                        invalidValue,
                                        fieldName,
                                        Arrays.stream(
                                                        invalidFormatEx
                                                                .getTargetType()
                                                                .getEnumConstants())
                                                .map(Object::toString)
                                                .collect(Collectors.joining(", ")));
            }

            return buildErrorResponse(
                    errorMessage, "Invalid request format", request, HttpStatus.BAD_REQUEST);

        } else if (ex.getCause() instanceof MismatchedInputException mismatchedInputEx) {
            String fieldName = mismatchedInputEx.getPath().get(0).getFieldName();
            String errorMessage =
                    "Mismatched input for field '%s'. Expected type: %s"
                            .formatted(
                                    fieldName, mismatchedInputEx.getTargetType().getSimpleName());
            return buildErrorResponse(
                    errorMessage, "Invalid request format", request, HttpStatus.BAD_REQUEST);

        } else {
            return buildErrorResponse(
                    ex.getReason() != null
                            ? ex.getReason()
                            : ex.getMessage(), // Use reason or message
                    "Invalid request input",
                    request,
                    HttpStatus.BAD_REQUEST);
        }
    }

    @ExceptionHandler(LockedException.class)
    public Mono<ResponseEntity<ErrorMessage>> handleLockedException(
            LockedException e, ServerHttpRequest request) {
        return buildAuthenticationErrorResponse(
                "Your account is locked. Please contact support.", request);
    }

    @ExceptionHandler(DisabledException.class)
    public Mono<ResponseEntity<ErrorMessage>> handleDisabledException(
            DisabledException e, ServerHttpRequest request) {
        return buildAuthenticationErrorResponse("Your account is disabled.", request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public Mono<ResponseEntity<ErrorMessage>> handleBadCredentials(
            BadCredentialsException e, ServerHttpRequest request) {
        return buildAuthenticationErrorResponse("Invalid username or password.", request);
    }

    @ExceptionHandler(AuthenticationException.class)
    public Mono<ResponseEntity<ErrorMessage>> handleAuthenticationException(
            AuthenticationException e, ServerHttpRequest request) {
        // Note: Spring Security for WebFlux often handles AuthenticationException internally
        // via ServerAuthenticationEntryPoint, but this handler will catch it if thrown
        // explicitly in your reactive code and not handled earlier.
        return buildAuthenticationErrorResponse(
                "Authentication failed. Please try again.", request);
    }

    @ExceptionHandler(MessagingException.class)
    public Mono<ResponseEntity<ErrorMessage>> handleMessagingException(
            MessagingException e, ServerHttpRequest request) {
        return buildErrorResponse(
                "Failed to send email. Please try again.",
                "Failed to send email",
                request,
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Builds a Mono with a ResponseEntity wrapping the provided error message, status, and path.
     * This method is typically used by exception handlers to build error responses in WebFlux.
     *
     * <p>The timestamp is set to the current instant.
     *
     * @param error The error message to include in the response
     * @param message The message to include in the response
     * @param request The reactive request object
     * @param status The HTTP status code to use in the response
     * @return A Mono emitting a ResponseEntity with the provided error message, status, and path
     */
    public static Mono<ResponseEntity<ErrorMessage>> buildErrorResponse(
            String error, String message, ServerHttpRequest request, HttpStatus status) {
        ErrorMessage errorMessageBody =
                ErrorMessage.builder()
                        .timestamp(Instant.now())
                        .status(status.value())
                        .error(error)
                        .message(message)
                        .path(
                                request.getPath()
                                        .pathWithinApplication()
                                        .value()) // Get path reactively
                        .build();
        return Mono.just(ResponseEntity.status(status).body(errorMessageBody)); // Wrap in Mono
    }

    /**
     * Builds a Mono with a ResponseEntity wrapping a ValidationErrorMessage for validation errors.
     *
     * <p>It builds a {@link ValidationErrorMessage} with the provided errors, status, and path.
     *
     * <p>The timestamp is set to the current instant.
     *
     * <p>The status is set to 400 (Bad Request).
     *
     * @param errors A map of field names to error messages
     * @param request The reactive request object
     * @return A Mono emitting a ResponseEntity with the validation error details
     */
    public static Mono<ResponseEntity<ValidationErrorMessage>> buildValidationErrorResponse(
            Map<String, String> errors, ServerHttpRequest request) {
        ValidationErrorMessage errorMessageBody =
                ValidationErrorMessage.builder()
                        .timestamp(Instant.now())
                        .status(HttpStatus.BAD_REQUEST.value())
                        .error("Validation Error")
                        .messages(errors)
                        .path(request.getPath().pathWithinApplication().value())
                        .build();
        return Mono.just(ResponseEntity.badRequest().body(errorMessageBody));
    }

    private Mono<ResponseEntity<ErrorMessage>> buildAuthenticationErrorResponse(
            String error, ServerHttpRequest request) {
        return buildErrorResponse(error, "Authentication Failed", request, HttpStatus.UNAUTHORIZED);
    }

    @Builder
    @Schema(
            name = "ErrorMessage",
            example =
                    """
                    {
                        "timestamp": "2023-03-30T15:00:00.000Z",
                        "status": 401,
                        "error": "Unauthorized"
                        "message": "Authentication Failed",
                        "path": "/api/v1/auth/login"
                    }
                    """)
    public static record ErrorMessage(
            Instant timestamp, Integer status, String error, String message, String path) {}

    @Builder
    @Schema(
            name = "ValidationErrorMessage",
            example =
                    """
                    {
                        "timestamp": "2023-03-30T15:00:00.000Z",
                        "status": 401,
                        "error": "Unauthorized"
                        "messages": {
                            "password": "Password is too weak"
                        }
                        "path": "/api/v1/auth/login"
                    }\
                    """)
    public static record ValidationErrorMessage(
            Instant timestamp,
            Integer status,
            String error,
            Map<String, String> messages,
            String path) {}
}
