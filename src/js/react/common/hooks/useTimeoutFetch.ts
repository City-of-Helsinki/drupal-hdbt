export default async function useTimeoutFetch(
  url: RequestInfo | string,
  options?: RequestInit,
  timeout: number = 8000,
) {
  const controller = new AbortController();
  const enforceTimeout = setTimeout(() => controller.abort(), timeout);

  const result = await fetch(url, { ...options, signal: controller.signal });
  clearTimeout(enforceTimeout);

  return result;
}
