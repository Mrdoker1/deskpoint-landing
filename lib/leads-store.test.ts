/**
 * Lead notify unit tests (no real SMTP).
 */
import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { notifyLeadByEmail, saveMarketingLead } from "./leads-store.ts";

describe("landing leads email", () => {
  const snap = { ...process.env };

  beforeEach(() => {
    process.env.LEADS_STORE = "memory";
    process.env.LEADS_TO_AMOCRM = "false";
    delete process.env.SMTP_HOST;
  });

  afterEach(() => {
    for (const k of Object.keys(process.env)) {
      if (!(k in snap)) delete process.env[k];
    }
    Object.assign(process.env, snap);
  });

  it("saveMarketingLead returns lead without SMTP", async () => {
    process.env.LEADS_NOTIFY_EMAIL = "ops@example.com";
    const result = await saveMarketingLead({
      name: "Test User",
      email: "user@example.com",
      message: "demo please",
    });
    assert.ok(result.lead.id);
    assert.equal(result.email.sent, false);
    assert.match(String(result.email.reason), /SMTP_HOST/);
    assert.equal(result.amocrm.pushed, false);
  });

  it("notifyLeadByEmail requires LEADS_NOTIFY_EMAIL", async () => {
    delete process.env.LEADS_NOTIFY_EMAIL;
    const r = await notifyLeadByEmail({
      id: "x",
      name: "A",
      email: "a@b.c",
      source: "landing",
      createdAt: new Date().toISOString(),
    });
    assert.equal(r.sent, false);
    assert.match(String(r.reason), /LEADS_NOTIFY_EMAIL/);
  });
});
