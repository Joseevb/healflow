package dev.jose.backend;

import dev.jose.backend.enumerations.UserRole;
import dev.jose.backend.presistence.entities.UserEntity;
import dev.jose.backend.presistence.repositories.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.List;

@EnableAsync
@EnableJpaAuditing
@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner startupRunner(UserRepository userRepository) {
        return args -> {
            userRepository.findByEmail("admin@admin.com").ifPresent(userRepository::delete);
            userRepository.findByEmail("user@example.com").ifPresent(userRepository::delete);
            userRepository.saveAll(
                    List.of(
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
                                    .build()));
        };
    }
}
