# Telegram sales ingestion

## Objective

Register a sale from the phone by sending a short text message to the Telegram bot,
with zero cost data, so the sale is never blocked by missing information.

## Problem

Sales registered from Telegram have no cost, so monthly profit cannot be computed
for them. There is no report endpoint yet: `/api/sales` returns a flat list and
`sale-list` renders a per-sale breakdown.

## Why

Cost is a historical fact. It must be captured at sale time and never recomputed,
because material prices, electricity rate and settings change over time. A cost
that is guessed is worse than a cost that is absent: it silently distorts profit.

## Scope

- Deterministic command parsing (no LLM, no external provider).
- `cost` stays absent for Telegram sales, surfaced explicitly in the UI.

## Out of scope

- Finished-product catalog with maintained cost (see Decision C, deferred).
- Monthly summary / report endpoint.
- Telegram webhook registration (`setWebhook`, public HTTPS URL).
- Frontend Telegram linking UI (code + `t.me` deep link).

## Decisions

| ID | Decision | Status |
| --- | --- | --- |
| D1 | Command format is `<title...> <price>`, parsed from the right | Accepted |
| D2 | Last token must be a number; everything before it is the title | Accepted |
| D3 | `cost` is never sent from the Telegram path (Option D) | Accepted |
| D4 | A sale without cost shows an explicit "Sin costear" marker in the UI | Accepted |
| D5 | Reply echoes the parsed title and price, so a bad parse is visible | Accepted |
| D6 | `OpenaiService` and `ExtractedSaleSchema` are removed (dead code) | Accepted |
| C | Finished-product catalog with maintained cost | **Deferred — revisit after WU2 ships** |

## Tasks

- [x] T1. Add `parseSaleCommand(text)` returning `{ title, salePrice } | null`.
      Rules: trim; the last whitespace-separated token must parse as a number
      (`$` optional, `.` as thousands separator); title is the remaining text,
      trimmed, non-empty. Return `null` when either side is missing.
      Done: `backend/src/utils/parse-sale-command.ts`, validated with `/^\d+$/` before
      `Number()` and `titleToken.length === 0`. Covered by 8 tests in
      `backend/src/utils/parse-sale-command.test.ts` (`bun test`: 8 pass, 0 fail).
- [x] T2. Replace the `OpenaiService.extractSaleData` call in the webhook with the parser.
      Done: single `if (!extracted)` guard; the old `title`/`salePrice` null guards were
      removed because `ParsedSaleCommand` already excludes null on both fields.
- [x] T3. Keep `SaleService.createSale({ title, salePrice })` without `cost`.
      Done: `cost` is never passed, so Telegram sales are uncosted by construction.
- [x] T4. Update the failure reply to show the expected format, not the old phrase.
      Done together with T2: "Mandame: producto precio. Ej: Lampara 30000".
- [x] T5. Add the "Costo desconocido" tile in `sale-list.html` for `sale.cost === undefined`.
      Done: `Cobrado` moved first and always visible; `Costo total` + `Ganancia` grouped in
      one `@if`, with an amber `@else` tile reading "Costo desconocido / Ganancia no disponible".
      Verified with `bun run build` in `frontend/` (no template errors).
- [ ] T6. Remove `openai.service.ts`, its barrel export and `ExtractedSaleSchema`.

## Acceptance criteria

- `Lampara 30.000` creates a sale titled `Lampara` with `salePrice: 30000` and no `cost`.
- `Figura Goku 30cm 30000` creates a sale titled `Figura Goku 30cm` with `salePrice: 30000`.
- `Lampara` (no number) creates nothing and asks for the price.
- `30000` (no title) creates nothing and asks for the product.
- The expanded sale row shows "Sin costear" instead of an empty breakdown.

## Checks

- `cd backend && bun build src/app.ts --target=bun`
- Manual: `POST /api/telegram/webhook` with a fake payload and the secret header.

## Progress

- WU1 (linking handshake) shipped in `48614ca`.
- WU2 shipped: deterministic parser, Telegram sales uncosted, "Costo desconocido" tile.
- OpenAI was dropped: the account had no credits, and the parser needs no provider.
- Verified end to end with fake Telegram payloads against the real DB: `Lampara 30.000`
  and `Figura Goku 30cm 30000` created sales with no `cost` field; `Lampara` and
  `30000` created nothing and were answered with the expected format. Test data removed.

## Next step

WU3 (register the webhook: public HTTPS URL plus `secret_token`), then WU4 (frontend
linking UI). Option C (product catalog) stays deferred until both ship.
