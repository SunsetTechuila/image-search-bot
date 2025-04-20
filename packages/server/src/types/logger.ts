export abstract class ILogger {
  public static readonly LOG_LEVELS: Record<string, number>;

  public abstract info(message: string): void;
  public abstract warn(message: string): void;
  public abstract error(message: string): void;
}
