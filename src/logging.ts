import type { Logger } from "pino";
import pino from "pino";
import { hasTTY } from "std-env";

export function newLogger(options?: { name?: string }): Logger<never, boolean> {
  if (hasTTY)
    return pino({ name: options?.name, transport: { target: "pino-pretty" } });
  return pino({
    name: options?.name,
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
