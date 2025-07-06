## Important Security Note: Development RSA Keys

This project includes RSA key files (`src/main/resources/keys/jwt_private.pem` and `jwt_public.pem`) in the repository for **ease of local development and assignment grading.**

**THESE KEYS ARE FOR DEVELOPMENT PURPOSES ONLY AND MUST NEVER BE USED IN A PRODUCTION ENVIRONMENT.**

In a production system, RSA private keys are highly sensitive cryptographic secrets and must be securely managed using:

- Environment variables (for private keys, ensuring they are not exposed in logs or build artifacts).
- Dedicated Key Management Services (KMS) like AWS Secrets Manager, Azure Key Vault, Google Secret Manager, or HashiCorp Vault.
- Securely mounted file systems with strict permissions (for private keys).

Private keys should **never** be committed to any version control system (public or private) for production applications. This setup is a pedagogical compromise to facilitate direct execution for evaluation purposes.
