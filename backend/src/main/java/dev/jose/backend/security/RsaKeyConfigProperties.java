package dev.jose.backend.security;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rsa.keys")
public record RsaKeyConfigProperties(RSAPublicKey publicKey, RSAPrivateKey privateKey) {}
