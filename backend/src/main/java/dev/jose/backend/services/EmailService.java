package dev.jose.backend.services;

import java.util.Map;
import reactor.core.publisher.Mono;

public interface EmailService {

  /**
   * Sends an email.
   *
   * @param to the email address to send to
   * @param subject the subject of the email
   * @param text the text content of the email
   */
  Mono<Void> sendEmail(String to, String subject, String text);

  /**
   * Sends an email using a Thymeleaf template.
   *
   * @param to the email address to send to
   * @param subject the subject of the email
   * @param templateName the name of the Thymeleaf template to use
   * @param templateVariables the variables to pass to the template
   */
  Mono<Void> sendTemplatedEmail(
      String to, String subject, String templateName, Map<String, Object> templateVariables);
}
