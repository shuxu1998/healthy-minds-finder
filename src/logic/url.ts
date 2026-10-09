/** A destination may be rendered as a link only if it is a real https URL (not empty or a TODO marker). */
export function isUsableUrl(url: string | null | undefined): url is string {
  return typeof url === 'string' && url.startsWith('https://') && !/todo/i.test(url);
}
