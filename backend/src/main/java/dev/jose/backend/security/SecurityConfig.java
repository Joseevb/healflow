package dev.jose.backend.security;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity.CsrfSpec;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
@EnableReactiveMethodSecurity
@EnableConfigurationProperties(RsaKeyConfigProperties.class)
public class SecurityConfig {

  private final ReactiveUserDetailsService userDetailsService;
  private final RsaKeyConfigProperties rsaKeyConfigProperties;
  private final ServerAuthenticationEntryPoint customAuthenticationEntryPoint;

  private static final String[] PUBLIC_RESOURCES = {
    "/",
    "/index.html",
    "/login",
    "/error",
    "/webjars/**",
    "/swagger-ui.html",
    "/swagger-ui/**",
    "/v3/api-docs/**",
    "/swagger-resources/**",
    "/configuration/ui",
    "/configuration/security",
    "/api/v1/auth/**",
    "/actuator/**"
  };

  private static final String[] GET_ALLOWED_RESOURCES = {"/users/**"};

  private static final String[] ALLOWED_ORIGINS = {
    "http://localhost:5173", "http://localhost:4173", "http://localhost",
  };

  @Bean
  PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of(ALLOWED_ORIGINS));
    configuration.setAllowedMethods(List.of("*"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  ReactiveJwtDecoder jwtDecoder() {
    return NimbusReactiveJwtDecoder.withPublicKey(rsaKeyConfigProperties.publicKey()).build();
  }

  @Bean
  JwtEncoder jwtEncoder() {
    var jwk =
        new RSAKey.Builder(rsaKeyConfigProperties.publicKey())
            .privateKey(rsaKeyConfigProperties.privateKey())
            .build();

    JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
    return new NimbusJwtEncoder(jwks);
  }

  @Bean
  ReactiveJwtAuthenticationConverterAdapter jwtAuthenticationConverter() {
    JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(new CustomJwtAuthenticationConverter());
    return new ReactiveJwtAuthenticationConverterAdapter(converter);
  }

  @Bean
  ReactiveAuthenticationManager authenticationManager() {
    var authenticationManager =
        new UserDetailsRepositoryReactiveAuthenticationManager(userDetailsService);
    authenticationManager.setPasswordEncoder(passwordEncoder());
    return authenticationManager;
  }

  @Bean
  SecurityWebFilterChain filterChain(
      ServerHttpSecurity http, @Value("${app.base-path}") String apiV1BasePath) {
    return http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(CsrfSpec::disable)
        .headers(header -> header.disable())
        .authorizeExchange(
            authorize ->
                authorize
                    .pathMatchers(PUBLIC_RESOURCES)
                    .permitAll()
                    .pathMatchers(
                        HttpMethod.GET,
                        Arrays.stream(GET_ALLOWED_RESOURCES)
                            .map(apiV1BasePath::concat)
                            .toArray(String[]::new))
                    .permitAll()
                    .anyExchange()
                    .authenticated())
        .exceptionHandling(ex -> ex.authenticationEntryPoint(customAuthenticationEntryPoint))
        .oauth2ResourceServer(
            (oauth2) ->
                oauth2.jwt(
                    (jwt) ->
                        jwt.jwtDecoder(jwtDecoder())
                            .jwtAuthenticationConverter(jwtAuthenticationConverter())))
        .build();
  }
}
