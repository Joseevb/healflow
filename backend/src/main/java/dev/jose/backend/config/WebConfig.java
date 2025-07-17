package dev.jose.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.HandlerTypePredicate;
import org.springframework.web.reactive.config.PathMatchConfigurer;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@Configuration
public class WebConfig implements WebFluxConfigurer {

  @Value("${app.base-path}")
  private String apiV1BasePath;

  @Override
  public void configurePathMatching(PathMatchConfigurer configurer) {
    configurer.addPathPrefix(
        apiV1BasePath, HandlerTypePredicate.forBasePackage("dev.jose.backend.api.controllers"));
  }
}
