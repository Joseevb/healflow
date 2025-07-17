package dev.jose.backend;

import dev.jose.backend.enumerations.UserRole;
import dev.jose.backend.presistence.entities.UserEntity;
import dev.jose.backend.presistence.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.r2dbc.config.EnableR2dbcAuditing;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@EnableR2dbcAuditing
@SpringBootApplication
public class BackendApplication {

  public static void main(String[] args) {
    SpringApplication.run(BackendApplication.class, args);
  }

  @Bean
  CommandLineRunner startupRunner(UserRepository userRepository) {
    return _ -> {
      log.info("Populating initial data...");

      Mono<Void> deleteExistingUsers =
          userRepository
              .findByEmail("admin@admin.com")
              .flatMap(userRepository::delete)
              .then(userRepository.findByEmail("user@example.com").flatMap(userRepository::delete))
              .then(userRepository.findByEmail("user2@example.com").flatMap(userRepository::delete))
              .then(userRepository.findByEmail("user3@example.com").flatMap(userRepository::delete))
              .then();

      Flux<UserEntity> initialUsers =
          Flux.just(
              UserEntity.builder()
                  .email("admin@admin.com")
                  .password("{noop}admin")
                  .firstName("admin")
                  .lastName("admin")
                  .isActive(true)
                  .role(UserRole.ADMIN)
                  .build(),
              UserEntity.builder()
                  .email("user@example.com")
                  .password("{noop}user")
                  .firstName("John")
                  .lastName("Doe")
                  .isActive(true)
                  .role(UserRole.USER)
                  .build(),
              UserEntity.builder()
                  .email("user2@example.com")
                  .password("{noop}user2")
                  .firstName("Jane")
                  .lastName("Doe")
                  .isActive(true)
                  .role(UserRole.USER)
                  .build(),
              UserEntity.builder()
                  .email("user3@example.com")
                  .password("{noop}user3")
                  .firstName("Joe")
                  .lastName("Doe")
                  .isActive(true)
                  .role(UserRole.USER)
                  .build());

      deleteExistingUsers
          .thenMany(userRepository.saveAll(initialUsers))
          .then()
          .doOnSuccess(_ -> log.info("Initial data population complete."))
          .doOnError(e -> log.error("Failed to populate initial data: {}", e.getMessage(), e))
          .block();
    };
  }
}
