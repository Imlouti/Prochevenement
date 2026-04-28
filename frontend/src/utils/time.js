// ── Time formatting helpers ────────────────────────────────────────────────────

/**
 * Formats a 24-hour hour + minute into a readable 12-hour time string.
 * Returns '—' when hour is null or undefined.
 *
 * @param {number} h  Hour (0–23)
 * @param {number} m  Minute (0–59)
 * @returns {string}  e.g. "1:30 PM"
 */
export function fmtTime(h, m) {
    if (h === undefined || h === null) return '—';
    const hh = h % 12 === 0 ? 12 : h % 12;
    const mm = String(m).padStart(2, '0');
    return `${hh}:${mm} ${h < 12 ? 'AM' : 'PM'}`;
}
