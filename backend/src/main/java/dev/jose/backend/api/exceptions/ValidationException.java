package dev.jose.backend.api.exceptions;

import java.util.Map;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidationException extends RuntimeException {

  @Getter private final Map<String, String> errors;

  public ValidationException(Map<String, String> errors) {
    super();
    this.errors = errors;
  }
}
