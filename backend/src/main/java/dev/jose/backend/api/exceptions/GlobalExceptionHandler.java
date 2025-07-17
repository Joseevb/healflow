package dev.jose.backend.api.exceptions;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.mail.MessagingException;
import jakarta.validation.ConstraintViolation;
import java.time.Instant;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ServerWebInputException;
import reactor.core.publisher.Mono;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ValidationException.class)
  public Mono<ServerResponse> handleValidationExceptions(
      final ValidationException ex, final ServerRequest request) {
    return buildValidationErrorResponse(ex.getErrors(), request);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public Mono<ServerResponse> handleAccessDeniedExceptions(
      final AccessDeniedException ex, final ServerRequest request) {
    return buildErrorResponse(
        ex.getMessage(), "Authorization failed", request, HttpStatus.FORBIDDEN);
  }

  @ExceptionHandler(ServerWebInputException.class)
  public Mono<ServerResponse> handleServerWebInputException(
      final ServerWebInputException ex, final ServerRequest request) {

    return switch (ex.getCause()) {
      case InvalidFormatException invalidFormatEx -> {
        String fieldName = invalidFormatEx.getPath().get(0).getFieldName();
        String invalidValue =
            invalidFormatEx.getValue() != null ? invalidFormatEx.getValue().toString() : "null";

        String errorMessage =
            "Invalid value '%s' for field '%s'. Expected type: %s"
                .formatted(
                    invalidValue, fieldName, invalidFormatEx.getTargetType().getSimpleName());

        if (invalidFormatEx.getTargetType().isEnum()) {
          errorMessage =
              "Invalid value '%s' for field '%s'. Accepted values: %s"
                  .formatted(
                      invalidValue,
                      fieldName,
                      Arrays.stream(invalidFormatEx.getTargetType().getEnumConstants())
                          .map(Object::toString)
                          .collect(Collectors.joining(", ")));
        }

        yield buildErrorResponse(
            errorMessage, "Invalid request format", request, HttpStatus.BAD_REQUEST);
      }
      case MismatchedInputException mismatchedInputEx -> {
        String fieldName = mismatchedInputEx.getPath().get(0).getFieldName();
        String errorMessage =
            "Mismatched input for field '%s'. Expected type: %s"
                .formatted(fieldName, mismatchedInputEx.getTargetType().getSimpleName());
        yield buildErrorResponse(
            errorMessage, "Invalid request format", request, HttpStatus.BAD_REQUEST);
      }
      default ->
          buildErrorResponse(
              ex.getReason() != null ? ex.getReason() : ex.getMessage(), // Use reason or message
              "Invalid request input",
              request,
              HttpStatus.BAD_REQUEST);
    };
  }

  @ExceptionHandler(LockedException.class)
  public Mono<ServerResponse> handleLockedException(LockedException e, ServerRequest request) {
    return buildAuthenticationErrorResponse(
        "Your account is locked. Please contact support.", request);
  }

  @ExceptionHandler(DisabledException.class)
  public Mono<ServerResponse> handleDisabledException(DisabledException e, ServerRequest request) {
    return buildAuthenticationErrorResponse("Your account is disabled.", request);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public Mono<ServerResponse> handleBadCredentials(
      BadCredentialsException e, ServerRequest request) {
    return buildAuthenticationErrorResponse("Invalid username or password.", request);
  }

  @ExceptionHandler(AuthenticationException.class)
  public Mono<ServerResponse> handleAuthenticationException(
      AuthenticationException e, ServerRequest request) {
    return buildAuthenticationErrorResponse("Authentication failed. Please try again.", request);
  }

  @ExceptionHandler(MessagingException.class)
  public Mono<ServerResponse> handleMessagingException(
      MessagingException e, ServerRequest request) {
    return buildErrorResponse(
        "Failed to send email. Please try again.",
        "Failed to send email",
        request,
        HttpStatus.INTERNAL_SERVER_ERROR);
  }

  /**
   * Builds a Mono with a ResponseEntity wrapping the provided error message, status, and path. This
   * method is typically used by exception handlers to build error responses in WebFlux.
   *
   * <p>The timestamp is set to the current instant.
   *
   * @param error The error message to include in the response
   * @param message The message to include in the response
   * @param request The reactive request object
   * @param status The HTTP status code to use in the response
   * @return A Mono emitting a ResponseEntity with the provided error message, status, and path
   */
  private static Mono<ServerResponse> buildErrorResponse(
      String error, String message, ServerRequest request, HttpStatus status) {
    ErrorMessage errorMessageBody =
        ErrorMessage.builder()
            .timestamp(Instant.now())
            .status(status.value())
            .error(error)
            .message(message)
            .path(request.path())
            .build();
    return ServerResponse.badRequest().bodyValue(errorMessageBody);
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
  private static Mono<ServerResponse> buildValidationErrorResponse(
      Map<String, String> errors, ServerRequest request) {
    ValidationErrorMessage errorMessageBody =
        ValidationErrorMessage.builder()
            .timestamp(Instant.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Validation Error")
            .messages(errors)
            .path(request.path())
            .build();
    return ServerResponse.badRequest().bodyValue(errorMessageBody);
  }

  private Mono<ServerResponse> buildAuthenticationErrorResponse(
      String error, ServerRequest request) {
    return buildErrorResponse(error, "Authentication Failed", request, HttpStatus.UNAUTHORIZED);
  }

  /**
   * Builds a Map of error messages from a Set of ConstraintViolations.
   *
   * @param violations The Set of ConstraintViolations to extract error messages from
   * @param <T> The type of the object being validated
   * @return A Map of error messages, where the key is the property path and the value is the error
   *     message
   */
  public static <T> Map<String, String> extractErrorMessages(
      Set<ConstraintViolation<T>> violations) {
    return violations.stream()
        .collect(
            Collectors.toMap(
                v -> String.valueOf(v.getPropertyPath()),
                v -> v.getMessage(),
                (oldValue, _) -> oldValue));
  }

  @Builder
  @Schema(
      name = "ErrorMessage",
      example =
          """
          {
            "timestamp": "2023-03-30T15:00:00.000Z",
            "status": 401,
            "error": "Unauthorized",
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
            "error": "Unauthorized",
            "messages": {
              "password": "Password is too weak"
            },
            "path": "/api/v1/auth/login"
          }
          """)
  public static record ValidationErrorMessage(
      Instant timestamp, Integer status, String error, Map<String, String> messages, String path) {}
}
