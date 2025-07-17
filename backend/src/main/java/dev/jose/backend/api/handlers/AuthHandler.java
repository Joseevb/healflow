package dev.jose.backend.api.handlers;

import static dev.jose.backend.utils.LocationUtils.buildLocationUri;
import static dev.jose.backend.utils.ResourceValidationUtils.validateResource;

import dev.jose.backend.api.dtos.LoginRequestDto;
import dev.jose.backend.api.dtos.RegisterUserRequestDto;
import dev.jose.backend.api.dtos.VerifyUserRequestDto;
import dev.jose.backend.api.routers.UsersRouter;
import dev.jose.backend.config.ApiConfig;
import dev.jose.backend.services.security.AuthService;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class AuthHandler {

  private final ApiConfig apiConfig;
  private final Validator validator;
  private final AuthService authService;

  public Mono<ServerResponse> login(ServerRequest request) {
    return request
        .bodyToMono(LoginRequestDto.class)
        .flatMap(
            reqDto ->
                validateResource(reqDto, validator)
                    .then(
                        authService
                            .login(reqDto)
                            .flatMap(res -> ServerResponse.ok().bodyValue(res))));
  }

  public Mono<ServerResponse> register(ServerRequest request) {
    return request
        .bodyToMono(RegisterUserRequestDto.class)
        .flatMap(
            reqDto ->
                validateResource(reqDto, validator)
                    .then(
                        authService
                            .register(reqDto)
                            .flatMap(
                                res ->
                                    buildLocationUri(
                                            request.exchange(),
                                            apiConfig.basePath + UsersRouter.USERS_RESOURCE_PATH,
                                            res.id())
                                        .flatMap(
                                            location ->
                                                ServerResponse.created(location)
                                                    .contentType(MediaType.APPLICATION_JSON)
                                                    .bodyValue(res)))));
  }

  public Mono<ServerResponse> verifyAccount(ServerRequest request) {
    return request
        .bodyToMono(VerifyUserRequestDto.class)
        .flatMap(
            reqDto ->
                validateResource(reqDto, validator)
                    .then(
                        authService
                            .verifyAccount(reqDto.token())
                            .flatMap(_ -> ServerResponse.noContent().build())));
  }
}
