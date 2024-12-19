export function isDev(): boolean {
  if (navigator.userAgent.startsWith("Bun/")) return true;
  if (navigator.userAgent.startsWith("Cloudflare-Workers")) return false;
  return false;
}
