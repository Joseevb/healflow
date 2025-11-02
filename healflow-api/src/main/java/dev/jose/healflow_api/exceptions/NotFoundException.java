package dev.jose.healflow_api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {

  private static final String BASE_MESSAGE = "%s with the %s: %s not found";

  public NotFoundException(String resource, String field, Object value) {
    super(String.format(BASE_MESSAGE, resource, field, value.toString()));
  }
}
