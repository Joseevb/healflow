package dev.jose.backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
@OpenAPIDefinition(
    info =
        @Info(title = "Hospital Management API", version = "v1", description = "API Documentation"))
public class OpenApiConfig {

  @Value("${app.base-path}")
  private String apiBasePath;

  private static final List<Tag> TAGS =
      List.of(
          new Tag().name("Users").description("Endpoints to manage users"),
          new Tag().name("Auth").description("Endpoints to manage authentication"),
          new Tag()
              .name("Admin")
              .description(
                  """
                  Endpoints that require admin privileges to either access them or to perform certain actions within them
                  """));

  @Bean
  OpenAPI customizeOpenAPI() {
    return new OpenAPI()
        .components(
            new Components()
                .addSecuritySchemes(
                    "bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("JWT authentication with Bearer token")))
        .tags(TAGS);
  }

  @Bean
  OpenApiCustomizer openApiCustomizer() {
    return openApi -> {
      Paths newPaths = new Paths();

      openApi
          .getPaths()
          .forEach(
              (path, pathItem) -> {
                log.info("Path: {}, PathItem: {}", path, pathItem);
                newPaths.put(apiBasePath + path, pathItem);
              });

      openApi.setPaths(newPaths);
    };
  }
}
