// ── Order grouping helper ──────────────────────────────────────────────────────

/**
 * Groups a flat array of ticket/achat objects into purchase orders.
 * Orders are identified by rounding acheteLe to the nearest second —
 * all tickets from a single purchase call have the same timestamp.
 *
 * Returns an array of { ts, items } sorted newest first.
 * Optionally pass a limit to take only the N most recent orders.
 *
 * @param {Array}  tickets  Array of achat objects (each with acheteLe)
 * @param {number} [limit]  Optional max number of orders to return
 * @returns {{ ts: number, items: Array }[]}
 */
export function groupTicketsByOrder(tickets, limit) {
    const map = {};
    tickets.forEach(t => {
        const ts = t.acheteLe
            ? new Date(new Date(t.acheteLe).toISOString().slice(0, 19)).getTime()
            : 0;
        if (!map[ts]) map[ts] = { ts, items: [] };
        map[ts].items.push(t);
    });
    const orders = Object.values(map).sort((a, b) => b.ts - a.ts);
    return limit ? orders.slice(0, limit) : orders;
}
