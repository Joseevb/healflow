package dev.jose.healflow_api.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

  @Value("${api.key-header}")
  private String HEADER_NAME;

  @Value("${api.key}")
  private String validApiKey;

  @Value("${api.key-path}")
  private String apiKeyAllowedPath;

  private final AntPathMatcher pathMatcher = new AntPathMatcher();

  @Lazy private final String basePath;

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    String path = request.getRequestURI();
    return !pathMatcher.match(basePath + apiKeyAllowedPath, path);
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String key = request.getHeader(HEADER_NAME);
    if (key == null || !key.equals(validApiKey)) {
      filterChain.doFilter(request, response);
      return;
    }

    Authentication auth =
        new UsernamePasswordAuthenticationToken(
            "apiKeyUser", key, List.of(new SimpleGrantedAuthority("ROLE_API_KEY_USER")));
    SecurityContextHolder.getContext().setAuthentication(auth);

    filterChain.doFilter(request, response);
  }
}
