package dev.jose.backend.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

  private static final String DEFAULT_MESSAGE = "%s by the %s: %s not found";

  public ResourceNotFoundException(String resource, String identifier, Object value) {
    super(String.format(DEFAULT_MESSAGE, resource, identifier, value));
  }
}
