// Strip GW2 client markup tags (e.g. <c=@Flavor>, <br>, </c>) from API strings.
export function stripGw2Markup(text: string): string {
  return text.replace(/<[^>]+>/g, '').trim()
}
