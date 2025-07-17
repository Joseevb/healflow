package dev.jose.backend.utils;

public final class ExceptionUtils {

  private ExceptionUtils() {
    throw new UnsupportedOperationException("This class cannot be instantiated");
  }

  /**
   * Executes a supplier that might throw a checked exception, wrapping it into a specified custom
   * RuntimeException.
   *
   * <p>This is useful for converting checked exceptions into custom, application-specific runtime
   * exceptions without using explicit try-catch blocks everywhere.
   *
   * @param <T> The type of the result returned by the supplier.
   * @param <E> The type of the checked exception that might be thrown by the supplier.
   * @param <R> The type of the custom RuntimeException to throw.
   * @param throwingSupplier The supplier whose get() method might throw a checked exception.
   * @param exceptionSupplier A supplier that creates the custom RuntimeException, taking the
   *     original checked exception and its message as arguments.
   * @return The result of the throwingSupplier if no exception occurs.
   * @throws R A custom RuntimeException (R) if the throwingSupplier throws an exception (E).
   */
  public static <T, E extends Throwable, R extends RuntimeException> T safeRun(
      ThrowingSupplier<T, E> throwingSupplier, ThrowingExceptionSupplier<R, E> exceptionSupplier) {
    try {
      return throwingSupplier.get();
    } catch (Throwable e) {
      @SuppressWarnings("unchecked")
      E originalException = (E) e;
      throw exceptionSupplier.get(originalException.getMessage(), originalException);
    }
  }

  /**
   * Executes a runnable that might throw a checked exception, wrapping it into a specified custom
   * RuntimeException.
   *
   * <p>This is similar to {@link #safeRun(ThrowingSupplier, ThrowingExceptionSupplier)} but for
   * operations that do not return a value.
   *
   * @param <E> The type of the checked exception that might be thrown by the runnable.
   * @param <R> The type of the custom RuntimeException to throw.
   * @param throwingRunnable The runnable whose run() method might throw a checked exception.
   * @param exceptionSupplier A supplier that creates the custom RuntimeException, taking the
   *     original checked exception and its message as arguments.
   * @throws R A custom RuntimeException (R) if the throwingRunnable throws an exception (E).
   */
  public static <E extends Throwable, R extends RuntimeException> void safeRun(
      ThrowingRunnable<E> throwingRunnable, ThrowingExceptionSupplier<R, E> exceptionSupplier) {
    try {
      throwingRunnable.run();
    } catch (Throwable e) {
      @SuppressWarnings("unchecked")
      E originalException = (E) e;
      throw exceptionSupplier.get(originalException.getMessage(), originalException);
    }
  }

  /**
   * Functional interface for a supplier that might throw a checked exception.
   *
   * @param <T> The type of the result.
   * @param <E> The type of the checked exception.
   */
  @FunctionalInterface
  public interface ThrowingSupplier<T, E extends Throwable> {
    T get() throws E;
  }

  /**
   * Functional interface for a runnable that might throw a checked exception.
   *
   * @param <E> The type of the checked exception.
   */
  @FunctionalInterface
  public interface ThrowingRunnable<E extends Throwable> {
    void run() throws E;
  }

  /**
   * Functional interface for a supplier that creates a custom runtime exception, taking the
   * original exception's message and the original exception as arguments.
   *
   * @param <R> The type of the custom RuntimeException to create.
   * @param <E> The type of the original checked exception.
   */
  @FunctionalInterface
  public interface ThrowingExceptionSupplier<R extends RuntimeException, E extends Throwable> {
    R get(String message, E originalException);
  }
}
