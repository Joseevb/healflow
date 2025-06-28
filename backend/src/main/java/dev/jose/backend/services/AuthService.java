package dev.jose.backend.services;

import dev.jose.backend.api.dtos.LoginRequestDto;
import dev.jose.backend.api.dtos.LoginResponseDto;
import dev.jose.backend.api.dtos.RegisterUserRequestDto;
import dev.jose.backend.api.dtos.UserResponseDto;

public interface AuthService {

    LoginResponseDto login(LoginRequestDto login);

    UserResponseDto register(RegisterUserRequestDto register);
}
