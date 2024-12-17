import { Base64 } from "js-base64";

export function tryDecodeBase64(src: string): string {
  if (Base64.isValid(src)) return Base64.decode(src);
  return src;
}
