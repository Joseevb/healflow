package dev.jose.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PasswordConstraintValidator implements ConstraintValidator<Password, String> {

  private static final String PASSWORD_REGEX =
      "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=])(?=\\S+$).{8,}$";

  private Pattern pattern;

  @Override
  public void initialize(Password constraintAnnotation) {
    this.pattern = Pattern.compile(PASSWORD_REGEX);
  }

  @Override
  public boolean isValid(String passwordField, ConstraintValidatorContext context) {
    if (passwordField == null) {
      return true; // Handled by @NotNull or @NotBlank
    }

    Matcher matcher = pattern.matcher(passwordField);
    return matcher.matches();
  }
}
