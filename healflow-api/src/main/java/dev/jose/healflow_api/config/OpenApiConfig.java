package dev.jose.healflow_api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import io.swagger.v3.core.jackson.ModelResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

  @Bean
  ModelResolver modelResolver(ObjectMapper mapper) {
    return new ModelResolver(mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE));
  }
}
