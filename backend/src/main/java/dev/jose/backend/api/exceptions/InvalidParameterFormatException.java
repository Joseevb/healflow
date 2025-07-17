package dev.jose.backend.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidParameterFormatException extends RuntimeException {

  private static final String BASE_MESSAGE = "Invalid parameter format. Expected type: %s, got: %s";
  private static final String DEFAULT_MESSAGE =
      BASE_MESSAGE.substring(0, BASE_MESSAGE.indexOf("."));

  public InvalidParameterFormatException(String expectedType, String actualType) {
    super(String.format(BASE_MESSAGE, expectedType, actualType));
  }

  public InvalidParameterFormatException() {
    super(DEFAULT_MESSAGE);
  }
}
