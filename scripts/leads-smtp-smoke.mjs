/**
 * Smoke: Ethereal SMTP lead notify (proves landing leads-store email path).
 * Run: npm run smoke:leads-email  (from apps/deskpoint-landing)
 */
import nodemailer from "nodemailer";
import { saveMarketingLead } from "../lib/leads-store.ts";

async function main() {
  const testAccount = await nodemailer.createTestAccount();
  process.env.LEADS_STORE = "memory";
  process.env.LEADS_TO_AMOCRM = "false";
  process.env.LEADS_NOTIFY_EMAIL = testAccount.user;
  process.env.SMTP_HOST = testAccount.smtp.host;
  process.env.SMTP_PORT = String(testAccount.smtp.port);
  process.env.SMTP_USER = testAccount.user;
  process.env.SMTP_PASSWORD = testAccount.pass;
  process.env.SMTP_FROM = `"Deskpoint smoke" <${testAccount.user}>`;

  const result = await saveMarketingLead({
    name: "SMTP Smoke",
    email: "lead@example.com",
    phone: "+79990001122",
    company: "Smoke Co",
    message: "landing-lead-smtp-smoke",
    source: "smoke",
  });

  if (!result.email.sent) {
    console.error("FAIL: email not sent", result.email);
    process.exit(1);
  }
  console.log("OK: lead email sent via Ethereal SMTP");
  console.log({ leadId: result.lead.id, to: testAccount.user });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
