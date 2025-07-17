package dev.jose.backend.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ApiConfig {

  @Value("${app.base-path}")
  @Getter
  public String basePath;
}
