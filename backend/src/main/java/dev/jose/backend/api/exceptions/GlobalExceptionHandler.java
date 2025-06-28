package dev.jose.backend.api.exceptions;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.servlet.http.HttpServletRequest;

import lombok.Builder;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorMessage> handleValidationExceptions(
            final MethodArgumentNotValidException ex, final HttpServletRequest request) {

        final var errors =
                ex.getBindingResult().getFieldErrors().stream()
                        .collect(
                                Collectors.toMap(
                                        FieldError::getField,
                                        FieldError::getDefaultMessage,
                                        (existing, replacement) -> existing));

        return buildValidationErrorResponse(errors, request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorMessage> handleAccessDeniedExceptions(
            final AccessDeniedException ex, final HttpServletRequest request) {
        return buildErrorResponse(
                ex.getMessage(), "Authorization failed", request, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public void handleInvalidEnumException(
            HttpMessageNotReadableException ex, HttpServletRequest request) throws BindException {

        if (ex.getCause() instanceof InvalidFormatException invalidFormatEx) {
            String fieldName = invalidFormatEx.getPath().get(0).getFieldName();

            FieldError fieldError =
                    new FieldError(
                            "requestBody",
                            fieldName,
                            "Invalid value. Accepted values: "
                                    + Arrays.asList(
                                            invalidFormatEx.getTargetType().getEnumConstants()));

            var bindingResult = new BeanPropertyBindingResult(null, "requestBody");
            bindingResult.addError(fieldError);

            throw new BindException(bindingResult);
        }

        throw ex; // If it's not an InvalidFormatException, let Spring handle it
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ErrorMessage> handleLockedException(
            LockedException e, HttpServletRequest request) {
        return buildAuthenticationErrorResponse(
                "Your account is locked. Please contact support.", request);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorMessage> handleDisabledException(
            DisabledException e, HttpServletRequest request) {
        return buildAuthenticationErrorResponse("Your account is disabled.", request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorMessage> handleBadCredentials(
            BadCredentialsException e, HttpServletRequest request) {
        return buildAuthenticationErrorResponse("Invalid username or password.", request);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorMessage> handleAuthenticationException(
            AuthenticationException e, HttpServletRequest request) {
        return buildAuthenticationErrorResponse(
                "Authentication failed. Please try again.", request);
    }

    /**
     * Builds a ResponseEntity with the provided error message, status, and path. This method is
     * typically used by exception handlers to build error responses.
     *
     * <p>The timestamp is set to the current instant.
     *
     * @param error The error message to include in the response
     * @param message The message to include in the response
     * @param request The request object
     * @param status The HTTP status code to use in the response
     * @return A ResponseEntity with the provided error message, status, and path
     */
    public static ResponseEntity<ErrorMessage> buildErrorResponse(
            String error, String message, HttpServletRequest request, HttpStatus status) {
        return ResponseEntity.status(status)
                .body(
                        ErrorMessage.builder()
                                .timestamp(Instant.now())
                                .status(status.value())
                                .error(error)
                                .message(message)
                                .path(request.getRequestURI())
                                .build());
    }

    /**
     * Builds a ResponseEntity with the provided error message, status, and path. This method is
     * typically used by exception handlers to build error responses.
     *
     * <p>It buids a {@link ValidationErrorMessage} with the provided errors, status, and path.
     *
     * <p>The timestamp is set to the current instant.
     *
     * <p>The status is set to 400 (Bad Request).
     *
     * @param errors A map of field names to error messages
     * @param request The request object
     * @return A ResponseEntity with the provided error message, status, and path
     */
    public static ResponseEntity<ValidationErrorMessage> buildValidationErrorResponse(
            Map<String, String> errors, HttpServletRequest request) {
        var res =
                ValidationErrorMessage.builder()
                        .timestamp(Instant.now())
                        .status(HttpStatus.BAD_REQUEST.value())
                        .error("Validation Error")
                        .messages(errors)
                        .path(request.getRequestURI())
                        .build();
        return ResponseEntity.badRequest().body(res);
    }

    private ResponseEntity<ErrorMessage> buildAuthenticationErrorResponse(
            String error, HttpServletRequest request) {
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
                    }
                    """)
    public static record ValidationErrorMessage(
            Instant timestamp,
            Integer status,
            String error,
            Map<String, String> messages,
            String path) {}
}
