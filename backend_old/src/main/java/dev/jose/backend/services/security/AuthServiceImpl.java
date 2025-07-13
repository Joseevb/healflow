package dev.jose.backend.services.security;

import dev.jose.backend.api.dtos.LoginRequestDto;
import dev.jose.backend.api.dtos.LoginResponseDto;
import dev.jose.backend.api.dtos.RegisterUserRequestDto;
import dev.jose.backend.api.dtos.UpdateUserRequestPatchDto;
import dev.jose.backend.api.dtos.UserResponseDto;
import dev.jose.backend.api.exceptions.UnauthorizedOperationException;
import dev.jose.backend.mappers.UserMapper;
import dev.jose.backend.presistence.entities.UserEntity;
import dev.jose.backend.security.AuthUser;
import dev.jose.backend.services.UserService;

import jakarta.mail.MessagingException;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @Value("${app.token.expiration-seconds.refresh}")
    private long REFRESH_TOKEN_EXPIRATION_SECONDS;

    @Value("${app.token.expiration-seconds.jwt}")
    private long AUTH_TOKEN_EXPIRATION_SECONDS;

    private final JwtEncoder jwtEncoder;
    private final UserMapper userMapper;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserVerificationService userVerificationService;

    @Override
    @Transactional
    public LoginResponseDto login(LoginRequestDto login) {

        var authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(login.email(), login.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        final var now = Instant.now();

        final var authorities =
                authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList());

        final var jwtClaims =
                JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(now)
                        .expiresAt(now.plus(AUTH_TOKEN_EXPIRATION_SECONDS, ChronoUnit.SECONDS))
                        .subject(authentication.getName())
                        .claim("authorities", authorities)
                        .build();

        final String jwt = jwtEncoder.encode(JwtEncoderParameters.from(jwtClaims)).getTokenValue();

        final var refreshClaims =
                JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(now)
                        .expiresAt(now.plus(REFRESH_TOKEN_EXPIRATION_SECONDS, ChronoUnit.SECONDS))
                        .subject(authentication.getName())
                        .claim("type", "refresh")
                        .claim("authorities", authorities)
                        .build();

        final String refreshToken =
                jwtEncoder.encode(JwtEncoderParameters.from(refreshClaims)).getTokenValue();

        final var user = (AuthUser) authentication.getPrincipal();

        return LoginResponseDto.builder()
                .userId(user.userEntity().getId())
                .role(user.userEntity().getRole())
                .jwt(jwt)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    @Transactional
    public UserResponseDto register(RegisterUserRequestDto register) throws MessagingException {
        var request = userMapper.toDto(register);
        var createdUserDto = userService.createUser(request);

        UserEntity userEntity = userService.getUserEntityById(createdUserDto.id());

        userVerificationService.createAndSendVerificationToken(userEntity);

        return createdUserDto;
    }

    @Override
    public UserResponseDto verifyAccount(String token) {
        AuthUser principal =
                (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = principal.userEntity().getId();

        if (!userVerificationService.validateToken(token, userId)) {
            throw new UnauthorizedOperationException("Invalid token");
        }
        return userService.partiallyUpdateUserById(
                userId, UpdateUserRequestPatchDto.builder().isActive(true).build());
    }
}
