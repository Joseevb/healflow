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
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
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
    private final ReactiveAuthenticationManager authenticationManager;
    private final UserVerificationService userVerificationService;

    @Override
    public Mono<LoginResponseDto> login(LoginRequestDto login) {
        return authenticationManager
                .authenticate(
                        new UsernamePasswordAuthenticationToken(login.email(), login.password()))
                .flatMap(
                        authentication -> {
                            final var now = Instant.now();

                            final List<String> authorities =
                                    authentication.getAuthorities().stream()
                                            .map(GrantedAuthority::getAuthority)
                                            .collect(Collectors.toList());

                            final var jwtClaims =
                                    JwtClaimsSet.builder()
                                            .issuer("self")
                                            .issuedAt(now)
                                            .expiresAt(
                                                    now.plus(
                                                            AUTH_TOKEN_EXPIRATION_SECONDS,
                                                            ChronoUnit.SECONDS))
                                            .subject(authentication.getName())
                                            .claim("authorities", authorities)
                                            .build();

                            final String jwt =
                                    jwtEncoder
                                            .encode(JwtEncoderParameters.from(jwtClaims))
                                            .getTokenValue();

                            final var refreshClaims =
                                    JwtClaimsSet.builder()
                                            .issuer("self")
                                            .issuedAt(now)
                                            .expiresAt(
                                                    now.plus(
                                                            REFRESH_TOKEN_EXPIRATION_SECONDS,
                                                            ChronoUnit.SECONDS))
                                            .subject(authentication.getName())
                                            .claim("type", "refresh")
                                            .claim("authorities", authorities)
                                            .build();

                            final String refreshToken =
                                    jwtEncoder
                                            .encode(JwtEncoderParameters.from(refreshClaims))
                                            .getTokenValue();

                            final var user = (AuthUser) authentication.getPrincipal();

                            return Mono.just(
                                    LoginResponseDto.builder()
                                            .userId(user.userEntity().getId())
                                            .role(user.userEntity().getRole())
                                            .jwt(jwt)
                                            .refreshToken(refreshToken)
                                            .build());
                        });
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
    public Mono<UserResponseDto> verifyAccount(String token) {
        return ReactiveSecurityContextHolder.getContext() // Get the reactive security context
                .flatMap(
                        context -> { // FlatMap to access the context content
                            final var authentication = context.getAuthentication();
                            if (authentication == null
                                    || !(authentication.getPrincipal()
                                            instanceof AuthUser authUser)) {
                                // Return an error if the principal is not available or not of the
                                // expected type
                                return Mono.error(
                                        new UnauthorizedOperationException(
                                                "User not authenticated or principal type"
                                                    + " incorrect"));
                            }
                            final Long userId = authUser.userEntity().getId();

                            // Call the reactive validation service method (assuming it exists)
                            return userVerificationService
                                    .validateToken(token, userId)
                                    .flatMap(
                                            isValid -> {
                                                if (!isValid) {
                                                    // Return an error if token is invalid
                                                    return Mono.error(
                                                            new UnauthorizedOperationException(
                                                                    "Invalid token"));
                                                }
                                                // Call the reactive user update service method
                                                // (assuming it exists)
                                                return userService.partiallyUpdateUserById(
                                                        userId,
                                                        UpdateUserRequestPatchDto.builder()
                                                                .isActive(true)
                                                                .build());
                                            });
                        });
    }
}
