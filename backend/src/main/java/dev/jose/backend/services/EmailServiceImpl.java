package dev.jose.backend.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;
import java.util.concurrent.Callable;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

  private final JavaMailSender mailSender;
  private final SpringTemplateEngine templateEngine;
  private final Scheduler emailScheduler = Schedulers.boundedElastic();

  @Value("${spring.mail.username}")
  private String from;

  @Override
  public Mono<Void> sendEmail(String to, String subject, String text) {
    return Mono.fromRunnable(
            () -> {
              var message = new SimpleMailMessage();
              message.setFrom(from);
              message.setTo(to);
              message.setSubject(subject);
              message.setText(text);
              mailSender.send(message);
            })
        .subscribeOn(emailScheduler)
        .then();
  }

  @Override
  public Mono<Void> sendTemplatedEmail(
      String to, String subject, String templateName, Map<String, Object> templateVariables) {
    Context context = new Context();
    context.setVariables(templateVariables);

    String htmlContent = templateEngine.process("email/" + templateName, context);

    Callable<Void> mailTask =
        () -> {
          MimeMessage mimeMessage = mailSender.createMimeMessage();
          MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

          helper.setFrom(from);
          helper.setTo(to);
          helper.setSubject(subject);
          helper.setText(htmlContent, true);

          mailSender.send(mimeMessage);
          return null;
        };

    return Mono.fromCallable(mailTask)
        .subscribeOn(emailScheduler)
        .onErrorMap(MessagingException.class, e -> e)
        .then();
  }
}
