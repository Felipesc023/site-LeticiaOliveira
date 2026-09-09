// Runnable check for the non-trivial pure logic. Node 24 strips types natively:
//   npm test   ->   node --test
import test from "node:test";
import assert from "node:assert/strict";
import { slugify } from "../lib/slug.ts";
import { extractJson } from "../lib/json.ts";
import { resolvePublish } from "../lib/publish.ts";
import { whatsappUrl } from "../lib/config.ts";

test("slugify strips accents, lowercases, hyphenates", () => {
  assert.equal(
    slugify("Leilão Extrajudicial: consolidação da PROPRIEDADE"),
    "leilao-extrajudicial-consolidacao-da-propriedade",
  );
  assert.equal(slugify("  --Hello--World--  "), "hello-world");
});

test("extractJson tolerates code fences and surrounding prose", () => {
  assert.deepEqual(extractJson('```json\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(extractJson('claro, aqui está: {"b":[2,3]} pronto'), { b: [2, 3] });
  assert.throws(() => extractJson("sem json aqui"));
});

test("resolvePublish: draft has no date", () => {
  assert.deepEqual(resolvePublish("draft", null), {
    ok: true,
    status: "draft",
    published_at: null,
  });
});

test("resolvePublish: publish now stamps current time", () => {
  const now = Date.UTC(2026, 0, 2, 12, 0, 0);
  const r = resolvePublish("published", null, now);
  assert.equal(r.ok && r.status, "published");
  assert.equal(r.ok && r.published_at, new Date(now).toISOString());
});

test("resolvePublish: future schedule stays scheduled", () => {
  const now = Date.UTC(2026, 0, 2, 12, 0, 0);
  const future = new Date(Date.UTC(2026, 0, 9, 12, 0, 0)).toISOString();
  const r = resolvePublish("scheduled", future, now);
  assert.equal(r.ok && r.status, "scheduled");
  assert.equal(r.ok && r.published_at, future);
});

test("resolvePublish: past schedule publishes immediately", () => {
  const now = Date.UTC(2026, 0, 2, 12, 0, 0);
  const past = new Date(Date.UTC(2026, 0, 1, 12, 0, 0)).toISOString();
  const r = resolvePublish("scheduled", past, now);
  assert.equal(r.ok && r.status, "published");
});

test("resolvePublish: scheduled without a date is an error", () => {
  assert.equal(resolvePublish("scheduled", null).ok, false);
  assert.equal(resolvePublish("scheduled", "not-a-date").ok, false);
});

test("whatsappUrl adds an encoded ?text only when a message is given", () => {
  assert.ok(!whatsappUrl().includes("?"));
  assert.match(whatsappUrl("olá, tudo bem?"), /\?text=ol%C3%A1%2C%20tudo%20bem%3F$/);
});
