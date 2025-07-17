package dev.jose.backend.utils;

import java.util.Locale;

public class StringUtils {

  private StringUtils() {}

  public static String toSnake(String camel) {
    return camel.replaceAll("([a-z])([A-Z])", "$1_$2").toLowerCase(Locale.ROOT);
  }
}
