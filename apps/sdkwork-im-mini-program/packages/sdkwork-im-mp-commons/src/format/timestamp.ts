/**
 * Domain-neutral timestamp formatting for mini program list rows.
 *
 * Authority: `APP_MINI_PROGRAM_UI_SPEC.md`. Deliberately word-free: every
 * branch returns digits and separators only, so the same helper serves every
 * locale without a translation table. A date that needs a word ("yesterday")
 * belongs to the capability package, which owns authored copy.
 *
 * Inputs are the wire's ISO-8601 strings. An unparseable value returns an empty
 * string rather than `Invalid Date` — a broken timestamp must not render as
 * garbage inside a list row.
 */

/** Two-digit zero padding. */
function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

/**
 * Formats a wire timestamp for a list row.
 *
 * - same calendar day as `now` -> `HH:mm`
 * - same calendar year       -> `MM-DD`
 * - any other year           -> `YYYY-MM-DD`
 */
export function formatImMpTimestamp(iso: string, now: Date = new Date()): string {
  const value = typeof iso === "string" ? iso.trim() : "";
  if (!value) {
    return "";
  }
  const date = new Date(value);
  const time = date.getTime();
  if (!Number.isFinite(time)) {
    return "";
  }

  const clock = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const sameDay = date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
  if (sameDay) {
    return clock;
  }
  const monthDay = `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (date.getFullYear() === now.getFullYear()) {
    return monthDay;
  }
  return `${date.getFullYear()}-${monthDay}`;
}

/**
 * Caps a badge count for display.
 *
 * The badge is a fixed-width element, so `1000+` is the widest readable value;
 * beyond that the exact number is not actionable anyway.
 */
export function formatImMpBadgeCount(count: number, cap: number = 99): string {
  if (!Number.isFinite(count) || count <= 0) {
    return "";
  }
  return count > cap ? `${cap}+` : String(count);
}
