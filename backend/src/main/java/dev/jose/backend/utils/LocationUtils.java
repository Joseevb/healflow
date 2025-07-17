package dev.jose.backend.utils;

import java.net.URI;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

public class LocationUtils {

  private LocationUtils() {}

  /**
   * Builds a URI for a newly created resource based on the current request URI and the resource's
   * ID. This is typically used to set the Location header in a 201 Created response.
   *
   * <p>Assumes the current request path is the collection URI and the resource URI is the
   * collection URI followed by the resource ID as a path segment.
   *
   * <p>Use this method when a POST to `/collection` creates a resource at `/collection/{id}`.
   *
   * @param resourceId The ID of the newly created resource.
   * @return A {@link Mono} containing the URI of the newly created resource.
   */
  public static Mono<URI> buildLocationUriFromCurrentRequest(
      ServerWebExchange exchange, Object resourceId) {
    return Mono.just(
        UriComponentsBuilder.fromUri(exchange.getRequest().getURI())
            .pathSegment(resourceId.toString())
            .build()
            .toUri());
  }

  /**
   * Builds a URI for a newly created resource based on a specified base path and the resource's ID,
   * starting from the current context path. This is typically used to set the Location header in a
   * 201 Created response.
   *
   * <p>Use this method when a request to one URI (e.g., `/auth/register`) creates a resource at a
   * different, specific base path (e.g., `/api/v1/users/{id}`).
   *
   * @param basePath The base path for the new resource (e.g., "/api/v1/users"). Should start with a
   *     '/' or be empty.
   * @param resourceId The ID of the newly created resource.
   * @return A {@link Mono} containing the URI of the newly created resource.
   */
  public static Mono<URI> buildLocationUri(
      ServerWebExchange exchange, String basePath, Object resourceId) {
    return Mono.just(
        UriComponentsBuilder.fromUri(exchange.getRequest().getURI())
            .replacePath(exchange.getRequest().getPath().contextPath().value() + basePath)
            .pathSegment(resourceId.toString())
            .build()
            .toUri());
  }
}
