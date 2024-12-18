import { newLogger } from "./logging";

const logger = newLogger();

export class FetchError extends Error {
  name = "FetchError";
  cause?: unknown;
  input: string;
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  body?: string;

  constructor(
    input: string | URL | Request,
    options?: {
      message?: string;
      cause?: unknown;
      resp?: Response;
      body?: string;
    },
  ) {
    super(options?.message ?? options?.body, { cause: options?.cause });
    this.cause = options?.cause;
    this.input = asString(input);
    if (options?.resp) {
      this.status = options.resp.status;
      this.statusText = options.resp.statusText;
      this.headers = Object.fromEntries(options.resp.headers.entries());
    }
    this.body = options?.body;
  }
}

export async function fetchUnsafe(
  input: string | URL | Request,
  init?: RequestInit,
): Promise<Response> {
  try {
    const resp: Response = await fetch(input, init);
    if (!resp.ok) {
      const body: string = await resp.text();
      const err = new FetchError(input, { resp, body });
      logger.error(err);
      throw err;
    }
    return resp;
  } catch (err) {
    if (err instanceof FetchError) throw err;
    const errWrapped = new FetchError(input, { cause: err });
    logger.error(errWrapped);
    throw errWrapped;
  }
}

function asString(input: string | URL | Request): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  if (input instanceof Request) return input.url;
  return `${input}`;
}
