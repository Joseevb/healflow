package dev.jose.backend.services.security;

import dev.jose.backend.api.dtos.LoginRequestDto;
import dev.jose.backend.api.dtos.LoginResponseDto;
import dev.jose.backend.api.dtos.RegisterUserRequestDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import reactor.core.publisher.Mono;

public interface AuthService {

  Mono<LoginResponseDto> login(LoginRequestDto login);

  Mono<UserResponseDto> register(RegisterUserRequestDto register);

  Mono<UserResponseDto> verifyAccount(String token);
}
