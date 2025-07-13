package dev.jose.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;

import dev.jose.backend.api.exceptions.GlobalExceptionHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public CustomAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException)
            throws IOException, ServletException {

        var errorEntity =
                GlobalExceptionHandler.buildErrorResponse(
                        "Unauthorized",
                        "Resource requires authentication to access",
                        request,
                        HttpStatus.UNAUTHORIZED);

        response.setStatus(errorEntity.getStatusCode().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        objectMapper.writeValue(response.getWriter(), errorEntity.getBody());
    }
}
