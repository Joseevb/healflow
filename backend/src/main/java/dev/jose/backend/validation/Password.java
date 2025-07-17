package dev.jose.backend.validation;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = PasswordConstraintValidator.class)
@Target({FIELD, METHOD})
@Retention(RUNTIME)
public @interface Password {
  // Default message - this can be overridden on the DTO, which we did for a more comprehensive
  // message.
  String message() default "Password does not meet complexity requirements.";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
