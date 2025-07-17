package dev.jose.backend.config;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
@RequiredArgsConstructor
public class RouterConfig {

  private final ApiConfig apiConfig;
  private final List<RouterFunction<ServerResponse>> routerFunctions;

  @Bean
  RouterFunction<ServerResponse> apiRoutes() {
    return route()
        .path(apiConfig.basePath, builder -> routerFunctions.forEach(builder::add))
        .build();
  }
}
