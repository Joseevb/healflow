package dev.jose.backend.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ResourceAlreadyExistsException extends RuntimeException {

    private static final String DEFAULT_MESSAGE = "%s with the %s: %s already exists";

    public ResourceAlreadyExistsException(String resource, String identifier, Object value) {
        super(String.format(DEFAULT_MESSAGE, resource, identifier, value));
    }
}
