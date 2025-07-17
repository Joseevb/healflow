package dev.jose.backend.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.jose.backend.api.exceptions.GlobalExceptionHandler.ErrorMessage;
import java.time.Instant;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class CustomAuthenticationEntryPoint implements ServerAuthenticationEntryPoint {

  private final ObjectMapper objectMapper;

  public CustomAuthenticationEntryPoint(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  /**
   * Commences an authentication scheme.
   *
   * <p>This method is called when a user is trying to access a protected resource but has not been
   * authenticated.
   *
   * @param exchange the current server exchange
   * @param authException the authentication exception
   * @return a Mono that completes when the response is written
   */
  @Override
  public Mono<Void> commence(ServerWebExchange exchange, AuthenticationException authException) {

    ServerHttpRequest request = exchange.getRequest();
    ServerHttpResponse response = exchange.getResponse();

    ErrorMessage errorMessageBody =
        ErrorMessage.builder()
            .timestamp(Instant.now())
            .status(HttpStatus.UNAUTHORIZED.value())
            .error("Unauthorized")
            .message("Resource requires authentication to access")
            .path(request.getPath().value())
            .build();

    response.setStatusCode(HttpStatus.UNAUTHORIZED);
    response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

    var bufferMono =
        Mono.fromCallable(
                () -> {
                  byte[] bytes = objectMapper.writeValueAsBytes(errorMessageBody);
                  return response.bufferFactory().wrap(bytes);
                })
            .onErrorResume(
                JsonProcessingException.class,
                e -> {
                  log.error("Error serializing authentication error response body", e);
                  response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
                  return Mono.empty();
                });

    return response
        .writeWith(bufferMono)
        .onErrorResume(
            e -> {
              log.error("Unexpected error processing authentication entry point" + " response", e);
              response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
              return response.setComplete();
            });
  }
}
