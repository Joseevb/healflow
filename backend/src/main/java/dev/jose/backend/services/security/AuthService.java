package dev.jose.backend.services.security;

import dev.jose.backend.api.dtos.LoginRequestDto;
import dev.jose.backend.api.dtos.LoginResponseDto;
import dev.jose.backend.api.dtos.RegisterUserRequestDto;
import dev.jose.backend.api.dtos.UserResponseDto;

import jakarta.mail.MessagingException;

import reactor.core.publisher.Mono;

public interface AuthService {

    Mono<LoginResponseDto> login(LoginRequestDto login);

    UserResponseDto register(RegisterUserRequestDto register) throws MessagingException;

    Mono<UserResponseDto> verifyAccount(String token);
}
