package dev.jose.backend.services;

import dev.jose.backend.api.dtos.LoginResponseDto;
import dev.jose.backend.api.dtos.RegisterUserRequestDto;
import dev.jose.backend.api.dtos.UserResponseDto;

import org.springframework.security.core.Authentication;

public interface AuthService {

    LoginResponseDto login(Authentication login);

    UserResponseDto register(RegisterUserRequestDto register);
}
