import { Logger } from "../interfaces";

export class ConsoleLogger extends Logger {
  debugImplementation(message: string): void {
    console.debug(message);
  }

  infoImplementation(message: string): void {
    console.info(message);
  }

  warnImplementation(message: string): void {
    console.warn(message);
  }

  errorImplementation(message: string): void {
    console.error(message);
  }
}
