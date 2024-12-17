import type { Logger } from "pino";
import pino from "pino";

export function newLogger(): Logger<never, boolean> {
  return pino({
    browser: {
      asObject: true,
      formatters: {
        level(label: string, number: number): object {
          return { level: label };
        },
      },
      serialize: true,
    },
  });
}
